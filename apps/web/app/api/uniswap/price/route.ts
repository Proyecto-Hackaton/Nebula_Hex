// apps/web/app/api/uniswap/price/route.ts
import { NextResponse } from "next/server";
import { createPublicClient, http, parseAbi, getAddress } from "viem";
import { sepolia } from "viem/chains";

// ====== ENV ======
const RPC = process.env.NEXT_PUBLIC_PUBLIC_CLIENT_RPC!;              // p.ej. https://eth-sepolia.g.alchemy.com/v2/<KEY>
const QUOTER_V2 = process.env.UNISWAP_V3_QUOTER_V2 as `0x${string}`; // 0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3

// ====== Direcciones oficiales Uniswap v3 en Sepolia ======
const FACTORY_V3 = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c" as `0x${string}`;
// (NFPM por si luego quieres mintear liquidez: 0x1238536071E1c677A632429e3655c799b22cDA52)

// ====== ABIs ======
const ABI_QUOTER_V2 = parseAbi([
  // Firma correcta (SIN recipient en la tupla)
  "function quoteExactInputSingle((address tokenIn,address tokenOut,uint24 fee,uint256 amountIn,uint160 sqrtPriceLimitX96)) view returns (uint256 amountOut,uint160 sqrtPriceX96After,uint32 initializedTicksCrossed,uint256 gasEstimate)"
]);

const ABI_FACTORY = parseAbi([
  "function getPool(address tokenA,address tokenB,uint24 fee) view returns (address)"
]);

const ABI_ERC20 = parseAbi([
  "function decimals() view returns (uint8)"
]);

// ====== Client ======
const client = createPublicClient({ chain: sepolia, transport: http(RPC) });

export async function GET(req: Request) {
  try {
    if (!RPC) return NextResponse.json({ error: "Missing NEXT_PUBLIC_PUBLIC_CLIENT_RPC" }, { status: 500 });
    if (!QUOTER_V2) return NextResponse.json({ error: "UNISWAP_V3_QUOTER_V2 no configurado" }, { status: 500 });

    const url = new URL(req.url);
    const tokenIn  = getAddress(url.searchParams.get("tokenIn")  || "");
    const tokenOut = getAddress(url.searchParams.get("tokenOut") || "");
    const fee      = Number(url.searchParams.get("fee") || "3000") as 500 | 3000 | 10000;
    const amountInHuman = url.searchParams.get("amountIn") || "0";

    // 1) Confirma que estás en Sepolia
    const chainId = await client.getChainId();
    if (chainId !== 11155111) {
      return NextResponse.json({ error: `RPC no es Sepolia (chainId=${chainId})` }, { status: 500 });
    }

    // 2) ¿Son contratos ERC-20?
    const [codeIn, codeOut] = await Promise.all([
      client.getBytecode({ address: tokenIn }),
      client.getBytecode({ address: tokenOut }),
    ]);
    if (!codeIn)  return NextResponse.json({ error: `tokenIn no es contrato en Sepolia: ${tokenIn}` }, { status: 400 });
    if (!codeOut) return NextResponse.json({ error: `tokenOut no es contrato en Sepolia: ${tokenOut}` }, { status: 400 });

    // 3) Decimales y amountIn (parseo desde humano)
    const [decIn, decOut] = await Promise.all([
      client.readContract({ address: tokenIn,  abi: ABI_ERC20, functionName: "decimals" }),
      client.readContract({ address: tokenOut, abi: ABI_ERC20, functionName: "decimals" }),
    ]);
    const amountIn = BigInt(Math.round(Number(amountInHuman) * 10 ** Number(decIn)));

    // 4) ¿Existe pool para ese fee?
    const pool = await client.readContract({
      address: FACTORY_V3,
      abi: ABI_FACTORY,
      functionName: "getPool",
      args: [tokenIn, tokenOut, fee],
    });
    if (pool === "0x0000000000000000000000000000000000000000") {
      return NextResponse.json({ error: "No existe pool para tokenIn/tokenOut con ese fee en Sepolia" }, { status: 400 });
    }

    // 5) Cotiza con QuoterV2
    const [amountOut] = await client.readContract({
      address: QUOTER_V2,
      abi: ABI_QUOTER_V2,
      functionName: "quoteExactInputSingle",
      args: [{ tokenIn, tokenOut, fee, amountIn, sqrtPriceLimitX96: 0n }],
    }) as readonly [bigint, bigint, number, bigint];

    // 6) Respuesta
    const formattedOut = (Number(amountOut) / 10 ** Number(decOut)).toString();
    return NextResponse.json({
      chainId,
      tokenIn, tokenOut, fee,
      amountIn: amountIn.toString(),
      amountOut: amountOut.toString(),
      formattedOut,
      used: "QuoterV2",
      quoter: QUOTER_V2,
      pool
    });

  } catch (e: any) {
    return NextResponse.json({ error: e?.shortMessage || e?.message || String(e) }, { status: 500 });
  }
}