"use client";
import { useState } from "react";
import { TOKENS, type TokenSymbol } from "@/lib/tokens";

function toUnits(amountStr: string, decimals: number) {
  const [i, f = ""] = amountStr.trim().split(".");
  const frac = (f + "0".repeat(decimals)).slice(0, decimals);
  const raw  = (i || "0") + frac;
  const clean = raw.replace(/^0+/, "") || "0";
  return BigInt(clean);
}

export default function SwapPage() {
  const symbols = Object.keys(TOKENS) as TokenSymbol[];
  const [sellSym, setSellSym] = useState<TokenSymbol>(symbols[0]);
  const [buySym,  setBuySym]  = useState<TokenSymbol>(symbols[1] || symbols[0]);
  const [amount,  setAmount]  = useState("100");

  async function quote() {
    try {
      const sell = TOKENS[sellSym];
      const buy  = TOKENS[buySym];

      const sellAddr = sell.address || sellSym; // en demo vale con el label
      const buyAddr  = buy.address || buySym;

      const sellAmount = toUnits(amount, sell.decimals);

      const params = new URLSearchParams({
        buyToken:  buyAddr,
        sellToken: sellAddr,
        sellAmount: sellAmount.toString(),
      });

      const res  = await fetch("/api/zeroex/quote?" + params.toString());
      const text = await res.text();
      if (!res.ok) {
        alert("Error:\n" + text);
        return;
      }
      const data = JSON.parse(text);
      console.log("Quote:", data);
      alert(data.note ? data.note : "Cotización OK (ver consola)");
    } catch (e: any) {
      alert("Error: " + (e?.message || e));
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-xl mb-4">Swap</h2>

      <label>Sell Token</label>
      <select
        className="w-full mb-3"
        value={sellSym}
        onChange={(e) => setSellSym(e.target.value as TokenSymbol)}
      >
        {symbols.map((sym) => (
          <option key={sym} value={sym}>{TOKENS[sym].label}</option>
        ))}
      </select>

      <label>Buy Token</label>
      <select
        className="w-full mb-3"
        value={buySym}
        onChange={(e) => setBuySym(e.target.value as TokenSymbol)}
      >
        {symbols.map((sym) => (
          <option key={sym} value={sym}>{TOKENS[sym].label}</option>
        ))}
      </select>

      <label>Amount</label>
      <input
        className="w-full mb-4"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="100"
      />

      <button onClick={quote} className="px-4 py-2 rounded bg-white text-black">
        Cotizar
      </button>
    </div>
  );
}