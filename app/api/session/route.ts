import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = cookies()
    const raw = cookieStore.get('user')?.value
    if (raw) {
      const user = JSON.parse(raw)
      return NextResponse.json({ user, expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() })
    }
  } catch {}
  return NextResponse.json({ user: null, expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() })
}