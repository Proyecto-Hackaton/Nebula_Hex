// apps/web/app/api/vaults/route.ts
import { NextResponse } from "next/server";

// Revalidación ISR para toda la ruta (cada 5s)
export const revalidate = 5;

// Datos demo para fallback
const DEMO_VAULTS = [
  {
    id: "eth-vault-demo",
    name: "ETH Vault",
    symbol: "ETH",
    chainId: 11155111, // Sepolia
    apy: 0.021, // 2.1% demo
    tvlUSD: 125000,
    status: "active",
    strategy: "Estrategia delta-neutral (demo)",
    asset: { symbol: "ETH" },
  },
];

export async function GET() {
  const demo =
    process.env.NEXT_PUBLIC_VAULTS_DEMO === "true" ||
    !process.env.NEXT_PUBLIC_VAULTS_API_BASE;

  if (demo) {
    return NextResponse.json({ demo: true, vaults: DEMO_VAULTS });
  }

  const base = process.env.NEXT_PUBLIC_VAULTS_API_BASE!;
  const path = process.env.NEXT_PUBLIC_VAULTS_API_PATH || "/v1/vaults";
  const url = new URL(path, base).toString();

  try {
    // Sin opciones 'next' para evitar el error de tipos
    const r = await fetch(url);
    if (!r.ok) {
      const text = await r.text();
      return NextResponse.json(
        { demo: true, vaults: DEMO_VAULTS, error: `Upstream ${r.status}: ${text}` },
        { status: 200 }
      );
    }
    const data = await r.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { demo: true, vaults: DEMO_VAULTS, error: e?.message || String(e) },
      { status: 200 }
    );
  }
}