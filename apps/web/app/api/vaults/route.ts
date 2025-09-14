// apps/web/app/api/vaults/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // evita cache dura en Vercel

// Datos demo para fallback
const DEMO_VAULTS = [
  {
    id: "eth-vault-demo",
    name: "ETH Vault",
    symbol: "ETH",
    chainId: 11155111, // Sepolia
    apy: 0.021, // 2.1% demo
    tvlUSD: 125000, // USD bloqueados
    status: "active",
    strategy: "Estrategia delta-neutral (demo)",
    asset: { symbol: "ETH" },
  },
];

export async function GET() {
  const demo =
    process.env.NEXT_PUBLIC_VAULTS_DEMO === "true" ||
    !process.env.NEXT_PUBLIC_VAULTS_API_BASE;

  // --- Modo demo ---
  if (demo) {
    return NextResponse.json({ demo: true, vaults: DEMO_VAULTS });
  }

  // --- Modo backend real ---
  const base = process.env.NEXT_PUBLIC_VAULTS_API_BASE!;
  const path = process.env.NEXT_PUBLIC_VAULTS_API_PATH || "/v1/vaults";
  const url = new URL(path, base).toString();

  try {
    const r = await fetch(url, { next: { revalidate: 5 } });
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
