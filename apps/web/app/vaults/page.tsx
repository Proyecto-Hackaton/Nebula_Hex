"use client";
import { useEffect, useState } from "react";
import VaultCard, { type Vault } from "@/components/VaultCard";

type VaultsResponse = { demo?: boolean; vaults?: Vault[]; error?: string };

export default function VaultsPage() {
  const [data, setData] = useState<VaultsResponse>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/vaults", { cache: "no-store" });
        const j = await r.json();
        setData(j);
      } catch (e: any) {
        setData({ error: e?.message || String(e) });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold">Vaults</h2>
        {data?.demo && <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">demo</span>}
      </div>
      <p className="text-zinc-400 mt-1">Estrategias administradas; datos en vivo desde backend.</p>

      {loading && <div className="mt-6 text-sm text-zinc-400">Cargando vaults…</div>}
      {!loading && data?.error && (
        <div className="mt-6 text-sm text-red-300">Error: {data.error}</div>
      )}
      {!loading && !data?.error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {(data.vaults ?? []).map(v => <VaultCard key={v.id} v={v} />)}
        </div>
      )}
    </div>
  );
}