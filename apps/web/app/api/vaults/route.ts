import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.VAULTS_API_BASE || "";
  const path = process.env.VAULTS_API_PATH || "/vaults";

  // Si hay backend configurado, proxyea
  if (base) {
    try {
      const res = await fetch(`${base}${path}`, { headers: { "accept": "application/json" } });
      const text = await res.text();
      if (!res.ok) return NextResponse.json({ error: text || "Vaults backend error" }, { status: res.status });
      // Devolver tal cual venga del backend (asumiendo { vaults: [...] })
      return new NextResponse(text, { status: 200, headers: { "content-type": "application/json" } });
    } catch (e: any) {
      return NextResponse.json({ error: e?.message || String(e) }, { status: 502 });
    }
  }

  // ⚠️ Demo local (mientras el backend sale)
  return NextResponse.json({
    demo: true,
    vaults: [
      {
        id: "usdc-stable",
        name: "USDC Stable Vault",
        symbol: "USDC",
        chainId: 11155111,
        asset: { symbol: "USDC", address: "0xDemoUSDC...", decimals: 6 },
        apy: 0.0725,
        tvlUSD: 125_000,
        status: "active",
        strategy: "Lending + MM"
      },
      {
        id: "weth-yield",
        name: "WETH Strategy Vault",
        symbol: "WETH",
        chainId: 11155111,
        asset: { symbol: "WETH", address: "0xDemoWETH...", decimals: 18 },
        apy: 0.1231,
        tvlUSD: 87_540,
        status: "active",
        strategy: "UniV3 fees"
      },
      {
        id: "eth-delta",
        name: "ETH Delta-Neutral",
        symbol: "ETH",
        chainId: 11155111,
        asset: { symbol: "ETH", address: "0xDemoETH...", decimals: 18 },
        apy: 0.031,
        tvlUSD: 15_320,
        status: "paused",
        strategy: "Hedge perp"
      }
    ]
  });
}