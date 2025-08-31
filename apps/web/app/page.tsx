import dynamic from "next/dynamic";
import Link from "next/link";

const Chart = dynamic(() => import("@/components/Chart"), { ssr: false });

export default function Page() {
  return (
    <div className="grid gap-6">
      {/* Grid de charts */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 p-3 bg-neutral-900/40">
          <h3 className="mb-2 text-sm text-neutral-300">ETH/USD</h3>
          <div className="h-[340px]">
            <Chart />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 p-3 bg-neutral-900/40">
          <h3 className="mb-2 text-sm text-neutral-300">Otro</h3>
          <div className="h-[340px]">
            <Chart />
          </div>
        </div>
      </section>

      {/* Tarjetas de navegación */}
      <section className="grid md:grid-cols-4 gap-6">
        <Link href="/swap" className="rounded-2xl border border-white/10 p-5 bg-neutral-900/40 hover:bg-neutral-900/60 transition">
          Swap
        </Link>
        <Link href="/lending" className="rounded-2xl border border-white/10 p-5 bg-neutral-900/40 hover:bg-neutral-900/60 transition">
          Lending
        </Link>
        <Link href="/agents/dca" className="rounded-2xl border border-white/10 p-5 bg-neutral-900/40 hover:bg-neutral-900/60 transition">
          Agentes Expertos (DCA)
        </Link>
        <Link href="/vaults" className="rounded-2xl border border-white/10 p-5 bg-neutral-900/40 hover:bg-neutral-900/60 transition">
          Vaults
        </Link>
      </section>
    </div>
  );
}