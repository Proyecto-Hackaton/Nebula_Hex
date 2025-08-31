// apps/web/lib/tokens.ts
export const TOKENS_SEPOLIA = {
  // 🔁 Rellena con las direcciones REALES en Sepolia que vayas a usar
  // (WETH suele tener 18 decimales; USDC y USDT 6 decimales; DAI 18)
  WETH: { address: "0xWETH_SEPOLIA_ADDRESS",  decimals: 18, label: "WETH" },
  USDC: { address: "0xUSDC_SEPOLIA_ADDRESS",  decimals: 6,  label: "USDC" },
  DAI:  { address: "0xDAI_SEPOLIA_ADDRESS",   decimals: 18, label: "DAI"  },
  // agrega los que necesites...
} as const;

export type SepoliaTokenSymbol = keyof typeof TOKENS_SEPOLIA;