import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sellToken = searchParams.get('sellToken') ?? 'USDC'
  const buyToken = searchParams.get('buyToken') ?? 'WETH'
  const sellAmount = searchParams.get('sellAmount') ?? '100'

  // Nota: para demo convertimos cantidad "humana" a base 6 si USDC
  const amount = sellToken.toUpperCase()==='USDC'
    ? (Number(sellAmount) * 1e6).toFixed(0)
    : sellAmount

  const url = `${process.env.NEXT_PUBLIC_ZEROX_API_BASE}swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${amount}`
  const r = await fetch(url, { headers: { '0x-api-key': '' } })
  const j = await r.json()
  return NextResponse.json(j)
}