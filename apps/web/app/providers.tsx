'use client'
import { WagmiProvider, http } from 'wagmi'
import { mainnet, arbitrumSepolia } from 'wagmi/chains'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

const config = getDefaultConfig({
  appName: 'HEX MVP',
  projectId: 'hex-mvp', // si usas WalletConnect, reemplaza por tu key
  chains: [mainnet, arbitrumSepolia],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_PUBLIC_CLIENT_RPC),
    [arbitrumSepolia.id]: http()
  },
  ssr: true
})

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}