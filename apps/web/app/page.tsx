import dynamic from "next/dynamic";
const Chart = dynamic(() => import("@/components/Chart"), { ssr: false });

export default function Page() {
  return (
    <div className="grid gap-6">
      {/* Grid de charts */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 p-3 bg-neutral-900/40">
          <h3 className="mb-2 text-sm text-neutral-300">ETH/USD</h3>
          {/* Altura controlada: el Chart llenará este div */}
          <div className="h-[340px]">
            <Chart />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 p-3 bg-neutral-900/40">
          <h3 className="mb-2 text-sm text-neutral-300">Otro</h3>
          <div className="h-[340px]">
            {/* Si aún no tienes otro chart, deja un placeholder o reutiliza */}
            <Chart />
          </div>
        </div>
      </section>

      {/* Tarjetas de navegación */}
      <section className="grid md:grid-cols-3 gap-6">
        <a href="/swap" className="rounded-2xl border border-white/10 p-5 bg-neutral-900/40 hover:bg-neutral-900/60 transition">Swap</a>
        <a href="/lending" className="rounded-2xl border border-white/10 p-5 bg-neutral-900/40 hover:bg-neutral-900/60 transition">Lending</a>
        <a href="/agents/dca" className="rounded-2xl border border-white/10 p-5 bg-neutral-900/40 hover:bg-neutral-900/60 transition">Agentes Expertos (DCA)</a>
      </section>
    </div>
  );
}