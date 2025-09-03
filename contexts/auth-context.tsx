'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

interface User {
  id: string
  email: string
  name: string
  role: 'CUSTOMER' | 'ADMIN'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Sync NextAuth session with our user state
  useEffect(() => {
    console.log('🔄 Auth context - Session status:', status)
    console.log('🔄 Auth context - Session data:', session)
    
    if (status === 'loading') {
      setIsLoading(true)
      return
    }

    if (session?.user) {
      console.log('✅ Auth context - Setting user from session:', session.user)
      // Convert NextAuth session to our User format
      const userData: User = {
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: (session.user.role as 'CUSTOMER' | 'ADMIN') || 'CUSTOMER'
      }
      setUser(userData)
    } else {
      console.log('❌ Auth context - No session, clearing user')
      setUser(null)
    }
    
    setIsLoading(false)
  }, [session, status])

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    try {
      console.log('🔐 Auth context - Login attempt for:', email)
      setIsLoading(true)
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      console.log('🔐 Auth context - SignIn result:', result)

      if (result?.ok) {
        console.log('✅ Auth context - Login successful, waiting for session update...')
        
        // Wait for the session to update
        return new Promise((resolve) => {
          const checkSession = () => {
            if (session?.user) {
              console.log('✅ Session updated, resolving login')
              resolve({ success: true })
            } else {
              console.log('⏳ Session not yet updated, waiting...')
              setTimeout(checkSession, 100)
            }
          }
          
          // Start checking after a short delay
          setTimeout(checkSession, 200)
        })
      } else {
        console.error('❌ Auth context - Login failed:', result?.error)
        return { success: false, user: undefined }
      }
    } catch (error) {
      console.error('❌ Auth context - Login error:', error)
      return { success: false, user: undefined }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        // After successful signup, sign in automatically
        const loginResult = await signIn('credentials', {
          email,
          password,
          redirect: false
        })
        
        return loginResult?.ok || false
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

  const logout = () => {
    console.log('🚪 Auth context - Logging out user')
    signOut({ redirect: false })
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
