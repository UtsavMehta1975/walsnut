// Smart navigation and redirection utilities

export const REDIRECT_KEY = 'walnut_redirect_after_login'

// Store the current page for redirection after login
export const setRedirectUrl = (url: string) => {
  if (typeof window !== 'undefined') {
    // Don't store auth pages or dashboard as redirect
    if (!url.includes('/auth/') && !url.includes('/dashboard') && url !== '/') {
      sessionStorage.setItem(REDIRECT_KEY, url)
    }
  }
}

// Get and clear the redirect URL
export const getAndClearRedirectUrl = (): string | null => {
  if (typeof window !== 'undefined') {
    const redirectUrl = sessionStorage.getItem(REDIRECT_KEY)
    if (redirectUrl) {
      sessionStorage.removeItem(REDIRECT_KEY)
      return redirectUrl
    }
  }
  return null
}

// Smart redirection based on user role
export const getSmartRedirectUrl = (userRole: 'ADMIN' | 'CUSTOMER', defaultUrl?: string): string => {
  // Check if there's a stored redirect URL
  const storedRedirect = getAndClearRedirectUrl()
  if (storedRedirect) {
    return storedRedirect
  }

  // Default redirects based on role
  if (userRole === 'ADMIN') {
    return '/admin'
  } else {
    // For regular users, redirect to watches page or previous page
    return defaultUrl || '/watches'
  }
}

// Check if a route requires authentication
export const isProtectedRoute = (pathname: string): boolean => {
  const protectedRoutes = [
    '/dashboard',
    '/admin',
    '/account',
    '/orders',
    '/cart',
    '/checkout',
    '/wishlist'
  ]
  
  return protectedRoutes.some(route => pathname.startsWith(route))
}

// Check if a route is admin-only
export const isAdminRoute = (pathname: string): boolean => {
  return pathname.startsWith('/admin')
}

// Get the appropriate redirect URL for guests
export const getGuestRedirectUrl = (): string => {
  return '/auth/signin'
}

// Navigation helper for role-based routing
export const navigateBasedOnRole = (userRole: 'ADMIN' | 'CUSTOMER', router: any) => {
  const redirectUrl = getSmartRedirectUrl(userRole)
  router.push(redirectUrl)
}
