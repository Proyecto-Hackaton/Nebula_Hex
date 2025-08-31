// apps/web/app/api/vaults/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";        // explícito
export const dynamic = "force-dynamic"; // sin SSG
export const revalidate = 0;            // sin ISR

const BASE = (process.env.VAULTS_API_BASE || "").replace(/\/$/, "");
const PATH = process.env.VAULTS_API_PATH || "/v1/vaults";
const API_KEY = process.env.VAULTS_API_KEY || "";

// helper para construir URL sin “doble slash”
function joinTarget(req: NextRequest) {
  const qs = new URL(req.url).search; // preserva ?page=... etc.
  if (!BASE) return ""; // modo demo si no hay backend
  return `${BASE}${PATH}${qs}`;
}

async function passThrough(res: Response) {
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "application/json";
  return new NextResponse(text, {
    status: res.status,
    headers: { "content-type": contentType },
  });
}

export async function GET(req: NextRequest) {
  if (!BASE) {
    // ⚠️ Demo local mientras sale el backend
    return NextResponse.json({
      demo: true,
      vaults: [
        { id: "usdc-stable", name: "USDC Stable Vault", apy: 0.0725, tvlUSD: 125000, status: "active" },
        { id: "weth-yield",  name: "WETH Strategy Vault", apy: 0.1231, tvlUSD: 87540,  status: "active" },
        { id: "eth-delta",   name: "ETH Delta-Neutral",  apy: 0.031,  tvlUSD: 15320,  status: "paused" },
      ],
    });
  }

  try {
    const target = joinTarget(req);
    const res = await fetch(target, {
      headers: {
        accept: "application/json",
        ...(API_KEY ? { "x-api-key": API_KEY } : {}),
      },
      cache: "no-store",
    });
    return await passThrough(res);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  if (!BASE) return NextResponse.json({ error: "Vaults backend no configurado" }, { status: 500 });

  try {
    const target = joinTarget(req);
    const body = await req.text();
    const res = await fetch(target, {
      method: "POST",
      headers: {
        "content-type": req.headers.get("content-type") || "application/json",
        accept: "application/json",
        ...(API_KEY ? { "x-api-key": API_KEY } : {}),
      },
      body,
      cache: "no-store",
    });
    return await passThrough(res);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 502 });
  }
}
