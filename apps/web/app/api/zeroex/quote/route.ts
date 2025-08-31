import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const buyToken = searchParams.get("buyToken");
  const sellToken = searchParams.get("sellToken");
  const sellAmount = searchParams.get("sellAmount");

  if (!buyToken || !sellToken || !sellAmount) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const base = (process.env.NEXT_PUBLIC_ZEROX_API_BASE || "").replace(/\/+$/, "");
    const url =
      `${base}/swap/v1/quote?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${sellAmount}`;

    const res = await fetch(url, { headers: { "accept": "application/json" } });

    // Propaga el error con detalle
    if (!res.ok) {
      const text = await res.text(); // puede venir JSON o texto
      return new NextResponse(text, { status: res.status, headers: { "content-type": res.headers.get("content-type") || "application/json" }});
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch 0x quote" }, { status: 500 });
  }
}