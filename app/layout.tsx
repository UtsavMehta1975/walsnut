import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { StickyWhatsApp } from '@/components/ui/sticky-whatsapp'
import AuthSessionProvider from '@/components/providers/session-provider'
import { Toaster } from 'react-hot-toast'

// Force dynamic rendering for entire app to prevent SSR issues
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
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}

