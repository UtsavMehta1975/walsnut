import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/auth-context'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ServiceWorkerRegistration } from '@/components/service-worker-registration'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'Walnut - Where Timeless Design is Naturally Crafted',
    template: '%s | Walnut'
  },
  description: 'Discover precision-crafted homage timepieces, rooted in the legacy of iconic design. Walnut brings you accessible luxury with organic precision for the modern Indian gentleman.',
  keywords: ['homage watches', 'precision crafted timepieces', 'accessible luxury watches', 'Walnut watches', 'Indian luxury watches', 'organic design watches'],
  authors: [{ name: 'Walnut' }],
  creator: 'Walnut',
  publisher: 'Walnut',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Walnut - Where Timeless Design is Naturally Crafted',
    description: 'Discover precision-crafted homage timepieces, rooted in the legacy of iconic design.',
    siteName: 'Walnut',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Walnut - Where Timeless Design is Naturally Crafted',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Walnut - Where Timeless Design is Naturally Crafted',
    description: 'Discover precision-crafted homage timepieces, rooted in the legacy of iconic design.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#fbbf24" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <ServiceWorkerRegistration />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

