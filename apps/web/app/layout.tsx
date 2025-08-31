import './globals.css'
import { Providers } from './providers'
import Link from 'next/link'

export const metadata = { title: 'HEX MVP', description: 'Hybrid Exchange MVP' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <header className="p-4 flex gap-4 items-center border-b border-neutral-800">
            <h1 className="text-xl font-bold">HEX</h1>
            <nav className="flex gap-3 text-sm">
              <Link href="/">Inicio</Link>
              <Link href="/swap">Swap</Link>
              <Link href="/lending">Lending</Link>
              <Link href="/agents/dca">Agentes</Link>
              <Link href="/verify">Verificar</Link>
            </nav>
          </header>
          <main className="max-w-5xl mx-auto p-6">{children}</main>
        </Providers>
      </body>
    </html>
  )
}