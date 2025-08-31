'use client'
import { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'

export default function Chart() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const chart = createChart(ref.current, { height: 300 })
    const line = chart.addLineSeries()
    const now = Math.floor(Date.now()/1000)
    const data = Array.from({length:120}, (_,i)=>({
      time: (now - (120-i)*60) as any,
      value: 3000 + Math.sin(i/5)*50 + Math.random()*10
    }))
    line.setData(data)
    const ro = new ResizeObserver(()=>chart.applyOptions({ width: ref.current!.clientWidth }))
    ro.observe(ref.current)
    return()=>ro.disconnect()
  }, [])
  return <div ref={ref} />
}