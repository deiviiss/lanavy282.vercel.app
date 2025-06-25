import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'
import { Toaster } from 'sonner'
import { ToogleDarkMode } from '@/components/dark-mode/toogle-dark-mode/ToogleDarkMode'
import { Providers } from '@/components/providers/Providers'
import ScrollToTop from '@/components/scroll-to-top/ScrollToTop'
import './globals.css'

const inter = Quicksand({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'La Navy 282',
  description: 'La Navy 282 es un menú digital moderno, diseñado para ofrecer una experiencia interactiva y sencilla a nuestros clientes.',
  keywords: [
    'menú digital',
    'hamburgueserías',
    'burgers',
    'la navy 282',
    'menú interactivo',
    'experiencia del cliente',
    'digital menu',
    'restaurant menu',
    'food delivery'
  ],
  authors: [
    {
      name: 'David Hilera',
      url: 'https://davidhilera.dev'
    }
  ]
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={inter.className}>
        <Providers>
          {children}
          <ToogleDarkMode />
          <ScrollToTop />
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  )
}
