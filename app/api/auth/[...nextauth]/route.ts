import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

const handler = NextAuth(authOptions)

// Wrap the handler to catch errors
export async function GET(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.MYSQL_URL) {
      console.error('NextAuth: Database not configured')
      return NextResponse.json({ 
        user: null, 
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() 
      })
    }
    
    return await handler(request)
  } catch (error) {
    console.error('NextAuth GET error:', error)
    // Return a simple response to prevent 500 errors
    return NextResponse.json({ 
      user: null, 
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() 
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.MYSQL_URL) {
      console.error('NextAuth: Database not configured')
      return NextResponse.json({ 
        error: 'Authentication service temporarily unavailable' 
      }, { status: 503 })
    }
    
    return await handler(request)
  } catch (error) {
    console.error('NextAuth POST error:', error)
    // Return a simple response to prevent 500 errors
    return NextResponse.json({ 
      error: 'Authentication service temporarily unavailable' 
    }, { status: 503 })
  }
}


