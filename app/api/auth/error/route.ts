import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const error = searchParams.get('error')
  
  console.error('NextAuth Error:', error)
  
  // Handle different error types
  switch (error) {
    case 'Configuration':
      return NextResponse.json(
        { error: 'There is a problem with the server configuration.' },
        { status: 500 }
      )
    case 'AccessDenied':
      return NextResponse.json(
        { error: 'Access denied. You do not have permission to sign in.' },
        { status: 403 }
      )
    case 'Verification':
      return NextResponse.json(
        { error: 'The verification token has expired or has already been used.' },
        { status: 400 }
      )
    case 'Default':
    default:
      return NextResponse.json(
        { error: 'An error occurred during authentication.' },
        { status: 500 }
      )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
