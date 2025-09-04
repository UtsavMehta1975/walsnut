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
    console.log('🔄 Auth context - Session user:', session?.user)
    console.log('🔄 Auth context - Session user role:', session?.user?.role)
    console.log('🔄 Auth context - Session user id:', session?.user?.id)
    
    if (status === 'loading') {
      console.log('⏳ Auth context - Session loading...')
      setIsLoading(true)
      return
    }

    if (status === 'unauthenticated') {
      console.log('❌ Auth context - No session, clearing user')
      setUser(null)
      setIsLoading(false)
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
      console.log('✅ Auth context - User data set:', userData)
      setUser(userData)
      setIsLoading(false)
    } else {
      console.log('❌ Auth context - No session user, clearing user')
      setUser(null)
      setIsLoading(false)
    }
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
        console.log('✅ Auth context - Login successful')
        
        // Wait for NextAuth to process the login
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Force a page reload to ensure session is established
        if (typeof window !== 'undefined') {
          console.log('🔄 Auth context - Reloading page to establish session...')
          window.location.reload()
          return { success: true }
        }
        
        return { success: true }
      } else {
        console.error('❌ Auth context - Login failed:', result?.error)
        setIsLoading(false)
        return { success: false, user: undefined }
      }
    } catch (error) {
      console.error('❌ Auth context - Login error:', error)
      setIsLoading(false)
      return { success: false, user: undefined }
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

  const logout = async () => {
    console.log('🚪 Auth context - Logging out user')
    try {
      // Clear local state immediately for better UX
      setUser(null)
      setIsLoading(false)
      
      // Sign out from NextAuth
      await signOut({ redirect: false })
      
      // Clear any localStorage data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('walnut_user')
        localStorage.removeItem('walnut_cart')
      }
      
      console.log('✅ Auth context - Logout successful')
      
      // Show success message
      if (typeof window !== 'undefined') {
        // Import toast dynamically to avoid SSR issues
        import('react-hot-toast').then(({ default: toast }) => {
          toast.success('Logged out successfully!')
        })
      }
      
      // Redirect to home page
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('❌ Auth context - Logout error:', error)
      // Even if NextAuth logout fails, clear local state and redirect
      setUser(null)
      setIsLoading(false)
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
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
