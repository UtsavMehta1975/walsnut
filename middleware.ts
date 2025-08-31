import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Middleware disabled - using custom auth system instead of NextAuth
  // Admin authentication is handled in the admin page component itself
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Disabled admin route protection for now
    // '/admin/:path*',
    // '/api/admin/:path*'
  ]
}
