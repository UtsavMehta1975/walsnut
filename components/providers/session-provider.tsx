'use client'

import { SessionProvider } from 'next-auth/react'

export default function AuthSessionProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <SessionProvider 
      refetchInterval={5 * 60} // Refetch every 5 minutes
      refetchOnWindowFocus={true} // Refetch on window focus
      refetchWhenOffline={false} // Disable refetch when offline
    >
      {children}
    </SessionProvider>
  )
}
