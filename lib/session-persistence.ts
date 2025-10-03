// Session persistence utilities for production
'use client'

interface User {
  id: string
  email: string
  name: string
  phone?: string | null
  address?: string | null
  role: 'CUSTOMER' | 'ADMIN'
}

export const SESSION_KEY = 'walnut_session'
export const USER_KEY = 'user'

// Save user session to localStorage
export const saveUserSession = (user: User): void => {
  if (typeof window === 'undefined') return
  
  try {
    const sessionData = {
      user,
      timestamp: Date.now(),
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
    }
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    
    console.log('✅ Session saved for user:', user.email)
  } catch (error) {
    console.error('❌ Failed to save session:', error)
  }
}

// Get user session from localStorage
export const getUserSession = (): User | null => {
  if (typeof window === 'undefined') return null
  
  try {
    // First try the new session format
    const sessionData = localStorage.getItem(SESSION_KEY)
    if (sessionData) {
      const parsed = JSON.parse(sessionData)
      
      // Check if session is expired
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        clearUserSession()
        return null
      }
      
      if (parsed.user) {
        console.log('✅ Session restored from session data:', parsed.user.email)
        return parsed.user
      }
    }
    
    // Fallback to old user format
    const userData = localStorage.getItem(USER_KEY)
    if (userData) {
      const user = JSON.parse(userData)
      console.log('✅ User restored from legacy format:', user.email)
      
      // Migrate to new format
      saveUserSession(user)
      return user
    }
    
    return null
  } catch (error) {
    console.error('❌ Failed to restore session:', error)
    clearUserSession()
    return null
  }
}

// Clear user session
export const clearUserSession = (): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem('walnut_cart')
    localStorage.removeItem('walnut_wishlist')
    
    console.log('✅ Session cleared')
  } catch (error) {
    console.error('❌ Failed to clear session:', error)
  }
}

// Check if session is valid
export const isSessionValid = (): boolean => {
  const user = getUserSession()
  return user !== null
}

// Refresh session timestamp
export const refreshSession = (): void => {
  const user = getUserSession()
  if (user) {
    saveUserSession(user)
  }
}

// Auto-refresh session on page load
export const initializeSessionPersistence = (): void => {
  if (typeof window === 'undefined') return
  
  // Refresh session on page load
  refreshSession()
  
  // Refresh session every 5 minutes
  setInterval(() => {
    if (isSessionValid()) {
      refreshSession()
    }
  }, 5 * 60 * 1000)
  
  // Clear session on page unload if needed
  window.addEventListener('beforeunload', () => {
    // Don't clear session on page unload - let it persist
  })
  
  console.log('✅ Session persistence initialized')
}
