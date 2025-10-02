import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Return a simple session response to prevent NextAuth errors
    return NextResponse.json({
      user: null,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    })
  } catch (error) {
    console.error('Session API error:', error)
    return NextResponse.json({
      user: null,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Return a simple response for POST requests
    return NextResponse.json({
      message: 'Session API working'
    })
  } catch (error) {
    console.error('Session API POST error:', error)
    return NextResponse.json({
      error: 'Session service temporarily unavailable'
    }, { status: 503 })
  }
}
