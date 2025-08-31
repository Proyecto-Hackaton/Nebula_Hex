// apps/web/lib/tokens.ts
const NET = (process.env.NEXT_PUBLIC_NETWORK || "").toLowerCase();

export const TOKENS_MAINNET = {
  USDC: { address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: 6,  label: "USDC" },
  WETH: { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18, label: "WETH" },
  DAI:  { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18, label: "DAI"  },
} as const;

// ⚠️ Mantén UNA sola export de TOKENS_SEPOLIA
export const TOKENS_SEPOLIA = {
  // Cuando confirmemos direcciones reales, reemplaza "" o usa envs:
  USDC: { address: process.env.NEXT_PUBLIC_USDC_SEPOLIA ?? "", decimals: 6,  label: "USDC (Sepolia)" },
  WETH: { address: process.env.NEXT_PUBLIC_WETH_SEPOLIA ?? "", decimals: 18, label: "WETH (Sepolia)" },
  // Si no usarás DAI en Sepolia, puedes omitirlo
} as const;

export type MainnetTokenSymbol  = keyof typeof TOKENS_MAINNET;
export type SepoliaTokenSymbol  = keyof typeof TOKENS_SEPOLIA;

export const TOKENS =
  NET === "sepolia" ? TOKENS_SEPOLIA : TOKENS_MAINNET;

export type TokenSymbol = keyof typeof TOKENS;

const isAddr = (a?: string) => typeof a === "string" && /^0x[a-fA-F0-9]{40}$/.test(a);

if (NET === "sepolia") {
  const usdc = process.env.NEXT_PUBLIC_USDC_SEPOLIA ?? "";
  const weth = process.env.NEXT_PUBLIC_WETH_SEPOLIA ?? "";
  if (!isAddr(usdc) || !isAddr(weth)) {
    alert("Direcciones de tokens en Sepolia no configuradas correctamente.\n" +
          "Revisa NEXT_PUBLIC_USDC_SEPOLIA y NEXT_PUBLIC_WETH_SEPOLIA en .env.local y reinicia el server.");
  }
}