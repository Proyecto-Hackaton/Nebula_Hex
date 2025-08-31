"use client";

import { WagmiProvider, cookieStorage, createStorage, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!;
const rpcUrl = process.env.NEXT_PUBLIC_PUBLIC_CLIENT_RPC!;

const config = getDefaultConfig({
  appName: "HEX",
  projectId,
  chains: [sepolia],
  transports: { [sepolia.id]: http(rpcUrl) },
  ssr: true, // App Router
  // 👇 Forzamos storage compatible con SSR (evita indexedDB/localStorage)
  storage: createStorage({ storage: cookieStorage }),
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}