import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [ME API] GET request received')
    
    // Get authenticated user from NextAuth session or custom session
    let userId: string | null = null
    let userEmail: string | null = null
    
    // Try NextAuth session first (for OAuth users)
    try {
      const session = await getServerSession(authOptions)
      if (session?.user) {
        userId = session.user.id
        userEmail = session.user.email
        
        // If ID is missing, try to find user by email
        if (!userId && userEmail) {
          const dbUser = await db.user.findUnique({
            where: { email: userEmail }
          })
          if (dbUser) {
            userId = dbUser.id
          }
        }
      }
    } catch (error) {
      console.error('⚠️ [ME API] NextAuth session check failed:', error)
    }
    
    // Check custom session from cookie if no NextAuth session
    if (!userId) {
      const cookies = request.headers.get('cookie')
      if (cookies && cookies.includes('user=')) {
        try {
          const userCookie = cookies.split('user=')[1]?.split(';')[0]
          if (userCookie) {
            const userData = JSON.parse(decodeURIComponent(userCookie))
            userId = userData.id
            userEmail = userData.email
          }
        } catch (error) {
          console.warn('⚠️ [ME API] Cookie parsing failed:', error)
        }
      }
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Fetch fresh user data from database
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        image: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    console.log('✅ [ME API] User profile fetched:', user.email)
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('🔴 [ME API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

