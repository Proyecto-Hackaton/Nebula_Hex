'use client'
import { useState } from 'react'

export default function SwapPage() {
  const [sellToken, setSellToken] = useState('USDC')
  const [buyToken, setBuyToken] = useState('WETH')
  const [amount, setAmount] = useState('100') // en unidades “humanas”

  async function quote() {
    const res = await fetch(`/api/zeroex/quote?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${amount}`)
    const j = await res.json()
    alert(j.buyAmount ? `Cotización OK. buyAmount: ${j.buyAmount}` : `Error: ${j.error ?? 'desconocido'}`)
  }

  return (
    <div className="card grid gap-4 max-w-md">
      <h2 className="text-lg font-semibold">Swap</h2>
      <label className="grid gap-1"><span>Sell Token</span>
        <input className="input" value={sellToken} onChange={e=>setSellToken(e.target.value)} />
      </label>
      <label className="grid gap-1"><span>Buy Token</span>
        <input className="input" value={buyToken} onChange={e=>setBuyToken(e.target.value)} />
      </label>
      <label className="grid gap-1"><span>Amount</span>
        <input className="input" value={amount} onChange={e=>setAmount(e.target.value)} />
      </label>
      <button className="btn" onClick={quote}>Cotizar (0x)</button>
    </div>
  )
}