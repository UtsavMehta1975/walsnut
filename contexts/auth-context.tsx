'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getUserSession, saveUserSession, clearUserSession, initializeSessionPersistence } from '@/lib/session-persistence'
import { useSession } from 'next-auth/react'

interface User {
  id: string
  email: string
  name: string
  phone?: string | null
  address?: string | null
  role: 'CUSTOMER' | 'ADMIN'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>
  signup: (name: string, email: string, password: string, phone?: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  // Use NextAuth session hook to automatically detect Google OAuth sessions
  const { data: nextAuthSession, status: nextAuthStatus } = useSession()

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
    
    // Initialize session persistence
    initializeSessionPersistence()
    
    // Restore user from session persistence
    const savedUser = getUserSession()
    if (savedUser) {
      setUser(savedUser)
      console.log('✅ User restored from session persistence:', savedUser.email)
    }
  }, [])
  
  // React to NextAuth session changes (Google OAuth, etc.)
  useEffect(() => {
    if (!mounted) return
    
    if (nextAuthStatus === 'loading') {
      console.log('⏳ [AUTH CONTEXT] NextAuth session loading...')
      return
    }
    
    if (nextAuthStatus === 'authenticated' && nextAuthSession?.user) {
      console.log('✅ [AUTH CONTEXT] NextAuth session detected:', nextAuthSession.user.email)
      const userData = {
        id: nextAuthSession.user.id || nextAuthSession.user.email || '',
        email: nextAuthSession.user.email || '',
        name: nextAuthSession.user.name || '',
        phone: (nextAuthSession.user as any).phone || null,
        address: (nextAuthSession.user as any).address || null,
        role: ((nextAuthSession.user as any).role as 'CUSTOMER' | 'ADMIN') || 'CUSTOMER'
      }
      
      // Only update if different from current user
      if (!user || user.email !== userData.email) {
        console.log('🔄 [AUTH CONTEXT] Updating user from NextAuth session')
        setUser(userData)
        saveUserSession(userData)
      }
      
      setIsLoading(false)
    } else if (nextAuthStatus === 'unauthenticated') {
      console.log('ℹ️ [AUTH CONTEXT] NextAuth session: unauthenticated')
      // Only clear if we don't have a custom session
      if (!getUserSession()) {
        setIsLoading(false)
      }
    }
  }, [nextAuthSession, nextAuthStatus, mounted, user])

  // Load custom session (for credentials users) - only if no NextAuth session
  useEffect(() => {
    if (!mounted) return
    
    // Only check custom sessions if NextAuth is unauthenticated or loading
    if (nextAuthStatus === 'authenticated') {
      // NextAuth session will be handled by the hook above
      return
    }
    
    // Check custom session sources for credentials users
    const checkCustomSessions = async () => {
      try {
        // Check localStorage first (fastest)
        console.log('🔍 [AUTH CONTEXT] Checking localStorage session...')
        const savedUser = getUserSession()
        if (savedUser) {
          console.log('✅ [AUTH CONTEXT] User loaded from localStorage:', savedUser.email)
          setUser(savedUser)
          setIsLoading(false)
          return
        }
        
        // Check custom session API (for credentials users with cookie)
        console.log('🔍 [AUTH CONTEXT] Checking custom session API...')
        const customRes = await fetch('/api/session')
        if (customRes.ok) {
          const customData = await customRes.json()
          if (customData?.user) {
            console.log('✅ [AUTH CONTEXT] User loaded from custom session:', customData.user.email)
            setUser(customData.user)
            saveUserSession(customData.user)
            setIsLoading(false)
            return
          }
        }
        
        // No session found
        if (nextAuthStatus === 'unauthenticated') {
          console.log('ℹ️ [AUTH CONTEXT] No active session found')
          setIsLoading(false)
        }
      } catch (error) {
        console.error('🔴 [AUTH CONTEXT] Session check error:', error)
        setIsLoading(false)
      }
    }
    
    // Only run check if NextAuth finished loading
    if (nextAuthStatus !== 'loading') {
      checkCustomSessions()
    }
  }, [mounted, nextAuthStatus])

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    try {
      setIsLoading(true)
      
      // Use only custom API call for authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          password 
        }),
      })

      if (response.ok) {
        const userData = await response.json()
        
        // Update user state immediately
        setUser(userData)
        setIsLoading(false)
        
        // Store user data using session persistence
        saveUserSession(userData)
        
        return { success: true, user: userData }
      } else {
        setIsLoading(false)
        return { success: false }
      }
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return { success: false }
    }
  }

  const signup = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      })

      if (response.ok) {
        // After successful signup, sign in automatically
        const loginResult = await login(email, password)
        
        if (loginResult.success) {
          // Session established immediately
          return true
        }
        
        return false
      } else {
        const error = await response.json()
        console.error('Signup failed:', error.message)
        return false
      }
    } catch (error) {
      console.error('Signup error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    console.log('🚪 [AUTH CONTEXT] Logging out user')
    try {
      // Clear local state immediately for better UX
      setUser(null)
      setIsLoading(false)
      
      // Clear session data from localStorage
      clearUserSession()
      console.log('✅ [AUTH CONTEXT] Cleared localStorage session')
      
      // Sign out from NextAuth (for Google OAuth and all sessions)
      try {
        const { signOut } = await import('next-auth/react')
        console.log('🚪 [AUTH CONTEXT] Calling NextAuth signOut...')
        await signOut({ redirect: false })
        console.log('✅ [AUTH CONTEXT] NextAuth signOut successful')
      } catch (nextAuthError) {
        console.warn('⚠️ [AUTH CONTEXT] NextAuth signOut error:', nextAuthError)
      }
      
      console.log('✅ [AUTH CONTEXT] Logout complete')
      
      // Show success message
      if (typeof window !== 'undefined') {
        import('react-hot-toast').then(({ default: toast }) => {
          toast.success('Logged out successfully!')
        })
      }
      
      // Redirect to home
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/'
        }, 500)
      }
      
    } catch (error) {
      console.error('🔴 [AUTH CONTEXT] Logout error:', error)
      // Even if logout fails, clear local state and redirect
      setUser(null)
      setIsLoading(false)
      clearUserSession()
      
      // Show error message but still redirect
      if (typeof window !== 'undefined') {
        import('react-hot-toast').then(({ default: toast }) => {
          toast.error('Logged out with errors, but session cleared')
        })
        
        // Redirect anyway
        setTimeout(() => {
          window.location.href = '/'
        }, 500)
      }
    }
  }

  const value: AuthContextType = {
    user: mounted ? user : null,
    isAuthenticated: mounted ? !!user : false,
    isLoading: mounted ? isLoading : true,
    login,
    signup,
    logout
  }

  // Debug logging for production
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      console.log('🔍 Auth State:', {
        user: user ? `${user.email} (${user.role})` : 'null',
        isAuthenticated: !!user,
        isLoading,
        sessionValid: getUserSession() ? 'valid session' : 'no session'
      })
    }
  }, [user, isLoading, mounted])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // During SSR/build time, return a default context to prevent errors
    if (typeof window === 'undefined') {
      return {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login: async () => ({ success: false }),
        signup: async () => false,
        logout: () => {}
      }
    }
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
