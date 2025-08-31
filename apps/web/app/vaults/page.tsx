"use client";

import { useEffect, useState, useCallback } from "react";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import VaultCard, { type Vault } from "@/components/VaultCard";
import { VAULT_ABI, VAULT_ADDRESS } from "@/abis/vaultAbi";

type VaultsResponse = { demo?: boolean; vaults?: Vault[]; error?: string };

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function VaultsPage() {
  const [data, setData] = useState<VaultsResponse>({});
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [userBalance, setUserBalance] = useState("0");

  // ---- carga lista de vaults desde backend ----
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

  const getContract = useCallback(async () => {
    if (!window.ethereum) throw new Error("MetaMask no detectada");
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return new Contract(VAULT_ADDRESS, VAULT_ABI, signer);
  }, []);

  const fetchUserBalance = useCallback(async () => {
    try {
      const c = await getContract();
      const addr =
        // @ts-ignore: runner only exists en v6 recientes
        c.runner?.address ?? (await c.signer.getAddress());
      const bal = await c.balanceOf(addr);
      setUserBalance(formatEther(bal));
    } catch (e) {
      console.warn("Balance:", e);
    }
  }, [getContract]);

  useEffect(() => {
    fetchUserBalance();

    // refresca balance ante cambios de cuenta/red
    if (!window.ethereum) return;
    const onAccounts = () => fetchUserBalance();
    const onChain = () => fetchUserBalance();
    window.ethereum.on?.("accountsChanged", onAccounts);
    window.ethereum.on?.("chainChanged", onChain);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", onAccounts);
      window.ethereum?.removeListener?.("chainChanged", onChain);
    };
  }, [fetchUserBalance]);

  const handleDeposit = async () => {
    try {
      const c = await getContract();
      const tx = await c.depositEth({ value: parseEther(depositAmount || "0") });
      alert("Confirmando transacción…");
      await tx.wait();
      setDepositAmount("");
      await fetchUserBalance();
      alert("¡Depósito exitoso!");
    } catch (error: any) {
      const msg =
        error?.reason || error?.shortMessage || error?.message || "Transacción rechazada";
      alert(`Error: ${msg}`);
      console.error(error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const c = await getContract();
      const tx = await c.withdrawEth(parseEther(withdrawAmount || "0"));
      alert("Confirmando transacción…");
      await tx.wait();
      setWithdrawAmount("");
      await fetchUserBalance();
      alert("¡Retiro exitoso!");
    } catch (error: any) {
      const msg =
        error?.reason || error?.shortMessage || error?.message || "Transacción rechazada";
      alert(`Error: ${msg}`);
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold">Vaults</h2>
        {data?.demo && (
          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
            demo
          </span>
        )}
      </div>

      <p className="text-zinc-400 mt-1">
        Estrategias administradas; datos en vivo desde backend.
      </p>

      <div className="mt-8 grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h3 className="text-white text-xl font-semibold mb-4">Depositar ETH</h3>
          <p className="text-white/70 mb-4">Tu balance en el contrato: {userBalance} ETH</p>
          <input
            type="number"
            placeholder="Cantidad de ETH"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-white/10"
          />
          <button
            onClick={handleDeposit}
            className="mt-4 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Depositar
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h3 className="text-white text-xl font-semibold mb-4">Retirar ETH</h3>
          <p className="text-white/70 mb-4">Tu balance en el contrato: {userBalance} ETH</p>
          <input
            type="number"
            placeholder="Cantidad de ETH"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-white/10"
          />
          <button
            onClick={handleWithdraw}
            className="mt-4 w-full py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Retirar
          </button>
        </div>
      </div>

      {loading && <div className="mt-6 text-sm text-zinc-400">Cargando vaults…</div>}
      {!loading && data?.error && (
        <div className="mt-6 text-sm text-red-300">Error: {data.error}</div>
      )}
      {!loading && !data?.error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {(data.vaults ?? []).map((v) => (
            <VaultCard key={v.id} v={v} />
          ))}
        </div>
      )}
    </div>
  );
}
