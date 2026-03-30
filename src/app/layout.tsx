import type { Metadata } from 'next'
import { Providers } from './providers'
import Sidebar from '@/components/Sidebar'
import './globals.css'

export const metadata: Metadata = {
  title: 'MantleAI Yield Strategist',
  description: 'AI-powered DeFi yield strategies on Mantle Network',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 min-h-screen overflow-y-auto bg-[#050a08]">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
