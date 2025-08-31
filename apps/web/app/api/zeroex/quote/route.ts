import { NextResponse } from "next/server";

const NET = (process.env.NEXT_PUBLIC_NETWORK || "").toLowerCase();
const DEMO = (process.env.NEXT_PUBLIC_DEMO_QUOTES || "false").toLowerCase() === "true";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const buyToken = searchParams.get("buyToken");
  const sellToken = searchParams.get("sellToken");
  const sellAmount = searchParams.get("sellAmount");

  if (!buyToken || !sellToken || !sellAmount) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Fallback DEMO para Sepolia (sin 0x)
  if (NET === "sepolia" || DEMO) {
    // Simulación muy simple: 1 USDC => 0.00025 WETH (demo)
    // buyAmount = sellAmount * rate * (10^buyDecimals / 10^sellDecimals)
    // Para demo asumimos decimales 6 -> 18 si sellToken es USDC -> WETH,
    // y 18 -> 6 si WETH -> USDC. Lo dejamos fijo para la UI.

    const rate = 0.00025; // WETH por USDC (ejemplo)
    const isUSDCtoWETH =
      sellToken.toLowerCase().includes("usdc") || sellToken === "" ? true : false;

    let buyAmountBigInt: bigint;

    try {
      if (isUSDCtoWETH) {
        // 6 -> 18
        // sellAmount (6 dec) * rate * 1e12 => (18 dec)
        const sell = BigInt(sellAmount);
        const scaled = Number(sell) * rate * 1e12;
        buyAmountBigInt = BigInt(Math.floor(scaled));
      } else {
        // WETH -> USDC (18 -> 6)
        // sellAmount (18 dec) / rate / 1e12 => (6 dec)
        const sell = BigInt(sellAmount);
        const scaled = Number(sell) / rate / 1e12;
        buyAmountBigInt = BigInt(Math.floor(scaled));
      }
    } catch (e) {
      return NextResponse.json({ error: "Demo math error" }, { status: 500 });
    }

    return NextResponse.json({
      // Estructura aproximada a 0x (solo campos básicos para la UI)
      price: isUSDCtoWETH ? rate.toString() : (1 / rate).toString(),
      buyAmount: buyAmountBigInt.toString(),
      sellAmount,
      sources: [{ name: "demo", proportion: "1" }],
      chainId: 11155111, // Sepolia
      note: "Demo quote in Sepolia (0x no disponible).",
    });
  }

  // --- Camino real (mainnet con 0x v2) ---
  try {
    const base = (process.env.NEXT_PUBLIC_ZEROX_API_BASE || "").replace(/\/+$/, "");
    const url = `${base}/swap/permit2/price?chainId=1&buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${sellAmount}`;

    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "0x-version": "v2",
        "0x-api-key": process.env.ZEROX_API_KEY || "",
      },
    });

    const contentType = res.headers.get("content-type") || "application/json";
    const text = await res.text();
    if (!res.ok) {
      return new NextResponse(text, { status: res.status, headers: { "content-type": contentType } });
    }
    return new NextResponse(text, { status: 200, headers: { "content-type": contentType } });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch price" }, { status: 500 });
  }
}