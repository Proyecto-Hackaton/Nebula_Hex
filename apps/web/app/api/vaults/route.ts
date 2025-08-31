import { NextResponse } from "next/server";
import { createPublicClient, http, formatEther } from "viem";
import { mainnet, sepolia } from "viem/chains";
import { VAULT_ABI, VAULT_ADDRESS } from "@/abis/vaultAbi";

export const dynamic = "force-dynamic"; // evita caché en dev/prod

const NET = (process.env.NEXT_PUBLIC_NETWORK || "sepolia").toLowerCase();
const RPC =
  process.env.NEXT_PUBLIC_PUBLIC_CLIENT_RPC ||
  "https://eth-sepolia.g.alchemy.com/v2/demo";

const chain = NET === "mainnet" ? mainnet : sepolia;

export async function GET() {
  try {
    const client = createPublicClient({ chain, transport: http(RPC) });
    const address = VAULT_ADDRESS as `0x${string}`;

    // sanity checks para evitar "fetch failed" por throws no atrapados
    const bytecode = await client.getBytecode({ address });
    if (!bytecode) {
      return NextResponse.json(
        {
          demo: true,
          error: `Contrato sin bytecode en ${chain.name}. Revisa VAULT_ADDRESS: ${address}`,
          vaults: [],
        },
        { status: 200 }
      );
    }

    let tvl: bigint = 0n;
    try {
      tvl = (await client.readContract({
        address,
        abi: VAULT_ABI,
        functionName: "totalAssets",
      })) as bigint;
    } catch {
      tvl = await client.getBalance({ address });
    }

    const vaults = [
      {
        id: "eth-vault",
        name: "ETH Vault",
        address,
        chainId: chain.id,
        apr: 0,
        tvl: Number(formatEther(tvl)),
      },
    ];

    return NextResponse.json({ vaults }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return NextResponse.json(
      {
        demo: true,
        error: e?.message || String(e),
        vaults: [],
      },
      { status: 200 }
    );
  }
}
