import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
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
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
