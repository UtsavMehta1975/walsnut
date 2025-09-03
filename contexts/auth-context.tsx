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
    if (status === 'loading') {
      setIsLoading(true)
      return
    }

    if (session?.user) {
      // Convert NextAuth session to our User format
      const userData: User = {
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: (session.user.role as 'CUSTOMER' | 'ADMIN') || 'CUSTOMER'
      }
      setUser(userData)
    } else {
      setUser(null)
    }
    
    setIsLoading(false)
  }, [session, status])

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    try {
      setIsLoading(true)
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.ok) {
        // The session will be updated automatically by NextAuth
        return { success: true }
      } else {
        console.error('Login failed:', result?.error)
        return { success: false, user: undefined }
      }
    } catch (error) {
      console.error('Login error:', error)
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
