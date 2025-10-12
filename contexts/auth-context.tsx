'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getUserSession, saveUserSession, clearUserSession, initializeSessionPersistence } from '@/lib/session-persistence'

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

  // Load user session on mount
  useEffect(() => {
    if (!mounted) return
    
    // Check both session sources
    const checkSessions = async () => {
      try {
        // First check NextAuth session (for Google OAuth users)
        console.log('🔍 [AUTH CONTEXT] Checking NextAuth session...')
        const nextAuthRes = await fetch('/api/auth/session')
        if (nextAuthRes.ok) {
          const nextAuthData = await nextAuthRes.json()
          if (nextAuthData?.user?.email) {
            console.log('✅ [AUTH CONTEXT] User loaded from NextAuth:', nextAuthData.user.email)
            const userData = {
              id: nextAuthData.user.id,
              email: nextAuthData.user.email,
              name: nextAuthData.user.name || '',
              phone: nextAuthData.user.phone || null,
              address: nextAuthData.user.address || null,
              role: nextAuthData.user.role as 'CUSTOMER' | 'ADMIN'
            }
            setUser(userData)
            saveUserSession(userData)
            setIsLoading(false)
            return
          }
        }
        
        // If no NextAuth session, check localStorage (for credentials users)
        console.log('🔍 [AUTH CONTEXT] Checking localStorage session...')
        const savedUser = getUserSession()
        if (savedUser) {
          console.log('✅ [AUTH CONTEXT] User loaded from localStorage:', savedUser.email)
          setUser(savedUser)
          setIsLoading(false)
          return
        }
        
        // Finally check custom session API (for credentials users)
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
        
        console.log('ℹ️ [AUTH CONTEXT] No active session found')
        setIsLoading(false)
      } catch (error) {
        console.error('🔴 [AUTH CONTEXT] Session check error:', error)
        setIsLoading(false)
      }
    }
    
    checkSessions()
  }, [mounted])

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
