import { NextResponse } from 'next/server'

export async function GET() {
  // Only expose boolean status, not actual values
  const envStatus = {
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not Set',
    GOOGLE_CLIENT_ID: (() => {
      const id = process.env.GOOGLE_CLIENT_ID || ''
      if (!id) return 'Missing'
      if (id.includes('your-google-client-id')) return 'Placeholder (Invalid)'
      if (!id.includes('.apps.googleusercontent.com')) return 'Invalid Format'
      return 'Valid ✅'
    })(),
    GOOGLE_CLIENT_SECRET: (() => {
      const secret = process.env.GOOGLE_CLIENT_SECRET || ''
      if (!secret) return 'Missing'
      if (secret.includes('your-google-client-secret')) return 'Placeholder (Invalid)'
      if (!secret.startsWith('GOCSPX-') && secret.length < 20) return 'Invalid Format'
      return 'Valid ✅'
    })(),
    MYSQL_URL: !!process.env.MYSQL_URL ? 'Connected ✅' : 'Missing',
    NODE_ENV: process.env.NODE_ENV || 'development',
  }

  return NextResponse.json(envStatus)
}

