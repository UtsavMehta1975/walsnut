import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Create response
  const response = NextResponse.next()
  
  // Enable CSP with Cashfree SDK support
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.cashfree.com https://*.cashfree.com; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https://api.cashfree.com https://sdk.cashfree.com https://*.cashfree.com; frame-src 'self' https://sdk.cashfree.com https://*.cashfree.com;"
  )
  
  // Add CORS headers for Cashfree
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Temporarily disable authentication middleware to fix jose module issues
  // TODO: Re-enable after fixing jose module bundling
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/admin', '/account', '/orders', '/checkout']
  const adminRoutes = ['/admin']
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    // For now, just allow access - authentication will be handled by individual pages
    // const token = await getToken({ req: request })
    
    // if (!token) {
    //   // Store the current URL for redirection after login
    //   const signInUrl = new URL('/auth/signin', request.url)
    //   signInUrl.searchParams.set('redirect', pathname)
    //   return NextResponse.redirect(signInUrl)
    // }
    
    // // Check admin access for admin routes
    // if (isAdminRoute && token.role !== 'ADMIN') {
    //   return NextResponse.redirect(new URL('/watches', request.url))
    // }
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
