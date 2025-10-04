import { NextResponse } from 'next/server'
import { getUserSession } from '@/lib/session-persistence'

export async function GET() {
  try {
    // Get user from session persistence
    const user = getUserSession()
    
    if (user) {
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
    }
    
    return NextResponse.json({
      user: null,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  } catch (error) {
    console.error('Session API error:', error)
    return NextResponse.json({
      user: null,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  }
}