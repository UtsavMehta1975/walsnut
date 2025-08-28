'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
      setIsAuthenticated(false)
    } else if (status === 'authenticated' && session) {
      setIsAuthenticated(true)
      setIsLoading(false)
    } else {
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }, [session, status])

  return {
    session,
    status,
    isAuthenticated,
    isLoading,
    user: session?.user
  }
}
