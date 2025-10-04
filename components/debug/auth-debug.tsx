'use client'

import { useAuth } from '@/contexts/auth-context'
import { getUserSession } from '@/lib/session-persistence'

export function AuthDebug() {
  const sessionUser = getUserSession()
  
  // Only show in development and when we have session data
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  // Try to get auth context, but handle errors gracefully
  let user = null
  let isAuthenticated = false
  let isLoading = false
  
  try {
    const authContext = useAuth()
    user = authContext.user
    isAuthenticated = authContext.isAuthenticated
    isLoading = authContext.isLoading
  } catch (error) {
    // Auth context not available, use session data only
    user = sessionUser
    isAuthenticated = !!sessionUser
    isLoading = false
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>Context User: {user ? `${user.email} (${user.role})` : 'null'}</div>
        <div>Context Auth: {isAuthenticated ? 'true' : 'false'}</div>
        <div>Context Loading: {isLoading ? 'true' : 'false'}</div>
        <div>Session User: {sessionUser ? `${sessionUser.email} (${sessionUser.role})` : 'null'}</div>
        <div>LocalStorage: {typeof window !== 'undefined' ? (localStorage.getItem('user') ? 'has data' : 'no data') : 'SSR'}</div>
      </div>
    </div>
  )
}
