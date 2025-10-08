import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

// Check environment variables on startup
if (!process.env.NEXTAUTH_SECRET) {
  console.error('CRITICAL: NEXTAUTH_SECRET is not set!')
}
if (!process.env.NEXTAUTH_URL) {
  console.error('WARNING: NEXTAUTH_URL is not set!')
}

const handler = NextAuth(authOptions)

// Wrap with error handling
export async function GET(request: Request) {
  try {
    return await handler(request)
  } catch (error) {
    console.error('NextAuth GET error:', error)
    // Return a valid JSON response instead of crashing
    return NextResponse.json({ 
      error: 'Authentication service error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    return await handler(request)
  } catch (error) {
    console.error('NextAuth POST error:', error)
    return NextResponse.json({ 
      error: 'Authentication service error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
