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
    
    // Check localStorage first for user data
    const savedUser = getUserSession()
    if (savedUser) {
      setUser(savedUser)
      setIsLoading(false)
      console.log('✅ User loaded from session persistence:', savedUser.email)
      return
    }
    
    // If no localStorage data, check our session API
    fetch('/api/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          saveUserSession(data.user)
        }
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Session API error:', error)
        setIsLoading(false)
      })
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
    console.log('🚪 Auth context - Logging out user')
    try {
      // Clear local state immediately for better UX
      setUser(null)
      setIsLoading(false)
      
      // Clear session data (no NextAuth signOut needed)
      
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
