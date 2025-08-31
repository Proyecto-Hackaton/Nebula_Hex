import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('@/components/Chart'), { ssr: false })

export default function Page() {
  return (
    <div className="grid gap-6">
      <section className="card">
        <h2 className="text-lg font-semibold mb-3">ETH/USD</h2>
        <Chart />
      </section>
      <section className="grid md:grid-cols-3 gap-6">
        <a href="/swap" className="card">Swap</a>
        <a href="/lending" className="card">Lending</a>
        <a href="/agents/dca" className="card">Agentes Expertos (DCA)</a>
      </section>
    </div>
  )
}