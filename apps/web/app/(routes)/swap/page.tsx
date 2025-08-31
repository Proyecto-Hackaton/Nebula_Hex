"use client";
import { useState } from "react";
import { TOKENS_SEPOLIA, type SepoliaTokenSymbol } from "@/lib/tokens";

function toUnits(amountStr: string, decimals: number) {
  // convierte "100.5" -> entero según decimales (BigInt)
  const [intPart, fracPart = ""] = amountStr.trim().split(".");
  const frac = (fracPart + "0".repeat(decimals)).slice(0, decimals);
  const raw = (intPart || "0") + frac;
  // elimina ceros a la izquierda
  const clean = raw.replace(/^0+/, "") || "0";
  return BigInt(clean);
}

export default function SwapPage() {
  const [sellSym, setSellSym] = useState<SepoliaTokenSymbol>("USDC");
  const [buySym, setBuySym]   = useState<SepoliaTokenSymbol>("WETH");
  const [amount, setAmount]   = useState("100"); // en humano

  async function quote0x() {
    try {
      const sell = TOKENS_SEPOLIA[sellSym];
      const buy  = TOKENS_SEPOLIA[buySym];

      const sellAmount = toUnits(amount, sell.decimals); // BigInt

      const params = new URLSearchParams({
        buyToken:  buy.address,       // ➜ DIRECCIÓN
        sellToken: sell.address,      // ➜ DIRECCIÓN
        sellAmount: sellAmount.toString(), // entero según decimales
      });

      const res = await fetch(`/api/zeroex/quote?` + params.toString());
      const text = await res.text(); // deja pasar errores crudos de 0x
      if (!res.ok) {
        alert(`0x error:\n${text}`);
        return;
      }
      // si es OK, será JSON
      const data = JSON.parse(text);
      console.log("0x quote:", data);
      alert("Cotización OK (ver consola).");
    } catch (e: any) {
      alert(`Error: ${e?.message || e}`);
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-xl mb-4">Swap</h2>

      <label>Sell Token</label>
      <select
        className="w-full mb-3"
        value={sellSym}
        onChange={(e) => setSellSym(e.target.value as SepoliaTokenSymbol)}
      >
        {Object.entries(TOKENS_SEPOLIA).map(([sym, t]) => (
          <option key={sym} value={sym}>{t.label}</option>
        ))}
      </select>

      <label>Buy Token</label>
      <select
        className="w-full mb-3"
        value={buySym}
        onChange={(e) => setBuySym(e.target.value as SepoliaTokenSymbol)}
      >
        {Object.entries(TOKENS_SEPOLIA).map(([sym, t]) => (
          <option key={sym} value={sym}>{t.label}</option>
        ))}
      </select>

      <label>Amount</label>
      <input
        className="w-full mb-4"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="100"
      />

      <button onClick={quote0x} className="px-4 py-2 rounded bg-white text-black">
        Cotizar (0x)
      </button>
    </div>
  );
}