import Link from "next/link";

export type Vault = {
  id: string;
  name: string;
  symbol: string;
  chainId: number;
  apy?: number;          // 0.075 = 7.5%
  tvlUSD?: number;       // 125000
  status?: "active" | "paused" | "retired";
  strategy?: string;
  asset?: { symbol: string; address?: string; decimals?: number };
};

function pct(x?: number) { return x == null ? "—" : (x * 100).toFixed(2) + "%"; }
function usd(x?: number) { return x == null ? "—" : x.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }); }

export default function VaultCard({ v }: { v: Vault }) {
  const badge =
    v.status === "active" ? "bg-emerald-500/20 text-emerald-300" :
    v.status === "paused" ? "bg-amber-500/20 text-amber-300" :
    "bg-zinc-600/30 text-zinc-200";

  return (
    <div className="rounded-2xl border border-zinc-700/60 bg-zinc-900 p-4 hover:border-zinc-500 transition">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{v.name}</h3>
        <span className={`px-2 py-0.5 text-xs rounded ${badge}`}>{v.status ?? "unknown"}</span>
      </div>
      <p className="text-sm text-zinc-400 mt-1">{v.strategy || "—"}</p>

      <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
        <div><div className="text-zinc-400">Asset</div><div className="font-medium">{v.symbol}</div></div>
        <div><div className="text-zinc-400">APY</div><div className="font-medium">{pct(v.apy)}</div></div>
        <div><div className="text-zinc-400">TVL</div><div className="font-medium">{usd(v.tvlUSD)}</div></div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={`/vaults/${encodeURIComponent(v.id)}`} className="px-3 py-1.5 rounded-xl bg-white text-black text-sm">Ver</Link>
        <button className="px-3 py-1.5 rounded-xl border border-zinc-600 text-sm">Depositar</button>
      </div>
    </div>
  );
}