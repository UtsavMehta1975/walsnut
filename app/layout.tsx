import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { StickyWhatsApp } from '@/components/ui/sticky-whatsapp'
import AuthSessionProvider from '@/components/providers/session-provider'

// Force dynamic rendering to prevent SSR issues with auth context
export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Walnut Store - Premium Inspired Timepieces',
  description: 'Premium inspired timepieces for the discerning collector. Quality craftsmanship meets timeless elegance.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthSessionProvider>
          <AuthProvider>
            {children}
            <StickyWhatsApp />
          </AuthProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}

