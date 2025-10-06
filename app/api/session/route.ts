import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Simple session API that doesn't use headers during build
  return NextResponse.json({
    user: null,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  })
}