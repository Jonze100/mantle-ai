import { createConfig, http } from 'wagmi'
import { getDefaultConfig } from 'connectkit'

export const mantle = {
  id: 5000,
  name: 'Mantle',
  nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.mantle.xyz'] } },
  blockExplorers: { default: { name: 'Mantle Explorer', url: 'https://explorer.mantle.xyz' } },
} as const

export const config = createConfig(
  getDefaultConfig({
    chains: [mantle],
    transports: { [mantle.id]: http('https://rpc.mantle.xyz') },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: 'MantleAI Yield Strategist',
    appUrl: 'http://localhost:3000',
  })
)
