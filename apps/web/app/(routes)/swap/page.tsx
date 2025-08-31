"use client";
import { useState } from "react";
import { TOKENS, type TokenSymbol } from "@/lib/tokens";

// (seguimos usando para 0x en mainnet)
function toUnits(amountStr: string, decimals: number) {
  const [i, f = ""] = amountStr.trim().split(".");
  const frac = (f + "0".repeat(decimals)).slice(0, decimals);
  const raw  = (i || "0") + frac;
  const clean = raw.replace(/^0+/, "") || "0";
  return BigInt(clean);
}

// red actual
function net() {
  return (process.env.NEXT_PUBLIC_NETWORK || "").toLowerCase();
}

// validador simple de address
function isHexAddress(addr?: string) {
  return !!addr && /^0x[a-fA-F0-9]{40}$/.test(addr);
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

      // ---- Sepolia → Uniswap v3 (QuoterV2) ----
      if (net() === "sepolia") {
        // logs de diagnóstico
        console.log("NET =", net());
        console.log("TOKENS[sell] =", sell);
        console.log("TOKENS[buy]  =", buy);

        // validación de address (evita "invalid address")
        if (!isHexAddress(sell.address) || !isHexAddress(buy.address)) {
          alert(
            "Direcciones de tokens en Sepolia no configuradas correctamente.\n" +
            "Revisa NEXT_PUBLIC_USDC_SEPOLIA y NEXT_PUBLIC_WETH_SEPOLIA en .env.local y reinicia el server."
          );
          return;
        }

        const url = new URL("/api/uniswap/price", window.location.origin);
        url.searchParams.set("tokenIn",  sell.address!);
        url.searchParams.set("tokenOut", buy.address!);
        url.searchParams.set("amountIn", amount); // humano, ej. "100"
        url.searchParams.set("fee", "500");       // si revierte, prueba 3000

        const res  = await fetch(url.toString());
        const text = await res.text();
        if (!res.ok) {
          alert("Uniswap error:\n" + text);
          return;
        }
        const data = JSON.parse(text);
        console.log("UNISWAP:", data);
        alert(`Uniswap: ~${data.formattedOut} ${buySym}`);
        return;
      }

      // ---- Mainnet → 0x (lo que ya tenías) ----
      const sellAddr = sell.address || sellSym;
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
        alert("0x error:\n" + text);
        return;
      }
      const data = JSON.parse(text);
      console.log("0x Quote:", data);
      alert(data.note ? data.note : "Cotización 0x OK (ver consola)");
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