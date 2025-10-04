'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
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
  const { data: session, status } = useSession()
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

  // Sync NextAuth session with our user state
  useEffect(() => {
    if (!mounted) return
    
    if (status === 'loading') {
      setIsLoading(true)
      return
    }

    if (status === 'unauthenticated') {
      setUser(null)
      setIsLoading(false)
      return
    }

    if (session?.user) {
      try {
        // Convert NextAuth session to our User format with safe parsing
        const userData: User = {
          id: String(session.user.id || ''),
          email: String(session.user.email || ''),
          name: String(session.user.name || ''),
          phone: (session.user as any).phone || null,
          address: (session.user as any).address || null,
          role: (session.user.role as 'CUSTOMER' | 'ADMIN') || 'CUSTOMER'
        }
        setUser(userData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error parsing session user data:', error)
        setUser(null)
        setIsLoading(false)
      }
    } else {
      setUser(null)
      setIsLoading(false)
    }
  }, [session, status, mounted])

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
        const loginResult = await signIn('credentials', {
          email,
          password,
          redirect: false
        })
        
        if (loginResult?.ok) {
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
    console.log('🚪 Auth context - Logging out user')
    try {
      // Clear local state immediately for better UX
      setUser(null)
      setIsLoading(false)
      
      // Sign out from NextAuth
      await signOut({ redirect: false })
      
      // Clear session data
      clearUserSession()
      
      console.log('✅ Auth context - Logout successful')
      
      // Show success message
      if (typeof window !== 'undefined') {
        import('react-hot-toast').then(({ default: toast }) => {
          toast.success('Logged out successfully!')
        })
      }
      
      // Instant redirect for account switching
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
      
    } catch (error) {
      console.error('❌ Auth context - Logout error:', error)
      // Even if NextAuth logout fails, clear local state and redirect
      setUser(null)
      setIsLoading(false)
      
      // Show error message but still redirect
      if (typeof window !== 'undefined') {
        import('react-hot-toast').then(({ default: toast }) => {
          toast.error('Logout completed with issues, but you have been signed out')
        })
        
        // Instant redirect even on error
        window.location.href = '/'
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
