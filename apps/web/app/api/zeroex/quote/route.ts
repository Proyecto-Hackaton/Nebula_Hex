import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sellToken = (searchParams.get('sellToken') ?? 'USDC').toUpperCase()
    const buyToken  = (searchParams.get('buyToken')  ?? 'WETH').toUpperCase()
    const sellHuman = searchParams.get('sellAmount') ?? '100'

    // si USDC → 6 decimales
    const sellAmount =
      sellToken === 'USDC'
        ? (Math.max(Number(sellHuman), 0) * 1e6).toFixed(0)
        : sellHuman

    const base = process.env.NEXT_PUBLIC_ZEROX_API_BASE ?? 'https://api.0x.org/'
    const url  = `${base}swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}`

    const r = await fetch(url, { headers: {
      // '0x-api-key': process.env.ZEROX_API_KEY ?? ''  // opcional si tienes key
    }})

    const text = await r.text()
    let body: any
    try { body = JSON.parse(text) } catch { body = { raw: text } }

    if (!r.ok) {
      // devolvemos el error tal cual para verlo en el alert
      return NextResponse.json({ error: body?.validationErrors ?? body?.reason ?? body?.message ?? body?.raw ?? 'quote failed' }, { status: r.status })
    }

    return NextResponse.json(body) // debe traer buyAmount, price, etc.
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'unexpected' }, { status: 500 })
  }
}