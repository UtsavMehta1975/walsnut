'use client'

import { SessionProvider } from 'next-auth/react'

export default function AuthSessionProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <SessionProvider 
      refetchInterval={0} // Disable automatic refetch to prevent serialization issues
      refetchOnWindowFocus={false} // Disable refetch on window focus
      refetchWhenOffline={false} // Disable refetch when offline
    >
      {children}
    </SessionProvider>
  )
}
