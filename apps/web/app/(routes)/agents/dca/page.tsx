'use client'
import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import ABI from '@/abis/DCAAgent.json'

export default function DCAAgentsPage() {
  const [amount, setAmount] = useState('1000000') // 1 USDC con 6 dec
  const [interval, setInterval] = useState('900')
  const [slippage, setSlippage] = useState('50')
  const [recipient, setRecipient] = useState('0x')
  const { writeContract, isPending } = useWriteContract()

  function create() {
    writeContract({
      abi: ABI as any,
      address: process.env.NEXT_PUBLIC_DCA_AGENT_ADDRESS as `0x${string}`,
      functionName: 'createPosition',
      args: [
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
        BigInt(amount), BigInt(interval), Number(slippage),
        recipient as `0x${string}`
      ]
    })
  }

  return (
    <div className="card grid gap-3 max-w-lg">
      <h2 className="text-lg font-semibold">Agente DCA — Crear posición</h2>
      <label className="grid gap-1"><span>AmountPerBuy (6 dec)</span>
        <input className="input" value={amount} onChange={e=>setAmount(e.target.value)} />
      </label>
      <label className="grid gap-1"><span>Interval (seg)</span>
        <input className="input" value={interval} onChange={e=>setInterval(e.target.value)} />
      </label>
      <label className="grid gap-1"><span>Max Slippage (bps)</span>
        <input className="input" value={slippage} onChange={e=>setSlippage(e.target.value)} />
      </label>
      <label className="grid gap-1"><span>Recipient</span>
        <input className="input" value={recipient} onChange={e=>setRecipient(e.target.value)} />
      </label>
      <button className="btn" onClick={create} disabled={isPending}>
        {isPending ? 'Enviando...' : 'Crear posición'}
      </button>
    </div>
  )
}