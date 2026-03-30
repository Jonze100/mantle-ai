'use client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { config } from '@/lib/wagmi'
import { StrategyProvider } from '@/context/StrategyContext'
import { useEffect } from 'react'

const queryClient = new QueryClient()

function AaveErrorSuppressor() {
  useEffect(() => {
    const originalError = console.error
    console.error = (...args: unknown[]) => {
      const msg = args[0]?.toString() ?? ''
      if (
        msg.includes('Aave Account') ||
        msg.includes('AaveAccountSdk') ||
        msg.includes('EIP1193 provider connection timeout') ||
        msg.includes('Failed to establish lazy connection')
      ) return
      originalError(...args)
    }
    return () => { console.error = originalError }
  }, [])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="midnight"
          customTheme={{
            '--ck-accent-color': '#00c853',
            '--ck-accent-text-color': '#000000',
            '--ck-body-background': '#030f07',
            '--ck-border-radius': '10px',
          }}
        >
          <StrategyProvider>
            <AaveErrorSuppressor />
            {children}
          </StrategyProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
