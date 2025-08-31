"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// --- Paleta de marca (Manual de Marca) ---
const COLORS = {
  nebulaBg: "#121c37", // fondo principal
  tealDeep: "#11a593",
  tealLight: "#73d8a0",
  white: "#ffffff",
  gray: "#E0E0E0",
  blueAccent: "#4A90E2",
};

// --- Datos demo (con la misma forma que luego pueden reemplazar por su feed real) ---
function useDemoSeries(base: number) {
  return useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        t: `${i}:00`,
        p: +(base + (Math.sin(i / 2) * base) / 60 + (i % 5 === 0 ? 12 : 0)).toFixed(2),
      })),
    [base]
  );
}

function ChartCard({ title, data }: { title: string; data: { t: string; p: number }[] }) {
  return (
    <div className="rounded-2xl bg-[#0e1730] border border-white/10 p-4 md:p-6 shadow-xl">
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-white/90 font-semibold tracking-wide">{title}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">en vivo</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <XAxis dataKey="t" tick={{ fill: "#8ea0c9" }} tickMargin={10} hide />
            <YAxis tick={{ fill: "#8ea0c9" }} domain={["dataMin - 20", "dataMax + 20"]} />
            <Tooltip
              contentStyle={{ background: "#0b1226", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
              labelStyle={{ color: "#8ea0c9" }}
              formatter={(v: number) => [`$${v.toFixed(2)}`, "Precio"]}
            />
            <Line type="monotone" dataKey="p" stroke={COLORS.tealLight} dot={false} strokeWidth={2.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function GradientButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center justify-center rounded-2xl px-5 py-3 font-medium text-white"
      style={{
        background: `linear-gradient(135deg, ${COLORS.tealDeep}, ${COLORS.tealLight})`,
      }}
    >
      <span className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
      <span className="relative">{children}</span>
    </Link>
  );
}

export default function LandingNebulaHEX() {
  const ethSeries = useDemoSeries(2965);
  const btcSeries = useDemoSeries(58750);

  return (
    <main className="min-h-screen w-full" style={{ backgroundColor: COLORS.nebulaBg }}>
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[#121c37]/70 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex h-16 items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {/* Logo correcto desde /public */}
              <Image src="/NebulaHEX.png" alt="Nebula HEX" width={36} height={36} className="rounded-lg" />
              <div className="leading-tight">
                <div className="text-white font-semibold tracking-wide">Nebula HEX</div>
                <div className="text-xs text-white/60 -mt-1">Hybrid Exchange</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-white/80">
              <Link href="#features" className="hover:text-white transition">Características</Link>
              <Link href="#about" className="hover:text-white transition">Sobre nosotros</Link>
              <Link href="#products" className="hover:text-white transition">Productos</Link>
            </nav>
            <div className="flex items-center gap-3">
              <GradientButton href="/app">Ir a la App</GradientButton>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{
          background: `radial-gradient(60% 60% at 10% 10%, ${COLORS.tealLight}22 0%, transparent 60%), radial-gradient(60% 60% at 90% 20%, ${COLORS.blueAccent}22 0%, transparent 60%)`,
        }} />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-24 pb-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Liquidez híbrida, <span style={{ color: COLORS.tealLight }}>seguridad total</span>.
              </h1>
              <p className="mt-4 text-white/80 text-lg">
                Nebula HEX es una solución financiera para personas y para instituciones: un <span className="font-semibold">Hybrid Exchange</span> que combina
                la experiencia de un CEX con la transparencia del DeFi. Compra, intercambia y gestiona activos con costos optimizados y alta disponibilidad.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <GradientButton href="/swap">Comenzar a tradear</GradientButton>
                <Link href="#about" className="inline-flex items-center rounded-2xl px-5 py-3 border border-white/20 text-white/90 hover:bg-white/5">
                  Conoce Nebula HEX
                </Link>
              </div>
              <div id="features" className="mt-6 grid grid-cols-2 gap-3 text-white/70 text-sm">
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">Custodia flexible</div>
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">Enrutamiento inteligente</div>
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">Transparencia on‑chain</div>
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">APIs para instituciones</div>
              </div>
            </div>
            {/* Charts */}
            <div className="grid grid-cols-1 gap-6">
              <ChartCard title="ETH/USD" data={ethSeries} />
              <ChartCard title="BTC/USD" data={btcSeries} />
            </div>
          </div>
        </div>
      </section>

      {/* Sección de productos */}
      <section id="products" className="relative py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-white text-2xl font-semibold mb-4">Productos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/swap" className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
              <div className="text-white font-semibold">Swap</div>
              <p className="text-white/70 text-sm mt-1">Cotizaciones inteligentes y mejor ejecución.</p>
            </Link>
            <Link href="/lending" className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
              <div className="text-white font-semibold">Lending</div>
              <p className="text-white/70 text-sm mt-1">Rendimientos con colateral seguro.</p>
            </Link>
            <Link href="/agentes" className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
              <div className="text-white font-semibold">Agentes Expertos (DCA)</div>
              <p className="text-white/70 text-sm mt-1">Automatiza compras periódicas con control total.</p>
            </Link>
            <Link href="/vaults" className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
              <div className="text-white font-semibold">Vaults</div>
              <p className="text-white/70 text-sm mt-1">Estrategias diversificadas y métricas claras.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre nosotros */}
      <section id="about" className="relative py-12 md:py-16 border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 md:px-6 text-white/85">
          <h2 className="text-2xl font-semibold">Sobre Nebula HEX</h2>
          <p className="mt-3">
            Construimos infraestructura financiera para que tanto <span className="font-semibold">personas naturales</span> como
            <span className="font-semibold"> instituciones financieras</span> accedan a productos de intercambio, liquidez y
            gestión de activos en un solo lugar. Nuestro enfoque híbrido entrega experiencia de usuario tipo CEX con transparencia
            y verificabilidad DeFi.
          </p>
          <ul className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
            <li className="rounded-xl bg-white/5 p-4 border border-white/10">On‑ramp/Off‑ramp (según región)</li>
            <li className="rounded-xl bg-white/5 p-4 border border-white/10">KYC/AML para cuentas institucionales</li>
            <li className="rounded-xl bg-white/5 p-4 border border-white/10">Panel de control con métricas en tiempo real</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 text-white/60 text-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/NebulaHEX.png" alt="Nebula HEX" width={20} height={20} className="rounded" />
            <span>© {new Date().getFullYear()} Nebula HEX — Hybrid Exchange</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/legal/terms" className="hover:text-white">Términos</Link>
            <Link href="/legal/privacy" className="hover:text-white">Privacidad</Link>
            <Link href="/status" className="hover:text-white">Status</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
