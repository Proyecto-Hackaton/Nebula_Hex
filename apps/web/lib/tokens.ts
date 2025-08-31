const NET = (process.env.NEXT_PUBLIC_NETWORK || "").toLowerCase();

export const TOKENS_MAINNET = {
  USDC: { address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: 6,  label: "USDC" },
  WETH: { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18, label: "WETH" },
  DAI:  { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18, label: "DAI"  },
} as const;

export const TOKENS_SEPOLIA = {
  // ⚠️ PENDIENTES: pon direcciones reales SOLO si vas a usar Quoter/Router
  // Por ahora sirven para poblar la UI (demo).
  USDC: { address: "", decimals: 6,  label: "USDC (Sepolia)" },
  WETH: { address: "", decimals: 18, label: "WETH (Sepolia)" },
  DAI:  { address: "", decimals: 18, label: "DAI (Sepolia)" },
} as const;

export type MainnetTokenSymbol = keyof typeof TOKENS_MAINNET;
export type SepoliaTokenSymbol = keyof typeof TOKENS_SEPOLIA;

export const TOKENS =
  NET === "sepolia" ? TOKENS_SEPOLIA : TOKENS_MAINNET;

export type TokenSymbol = keyof typeof TOKENS;