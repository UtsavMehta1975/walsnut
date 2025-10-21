import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    let userId: string | null = null
    let userEmail: string | null = null

    try {
      const session = await getServerSession(authOptions)
      if (session?.user) {
        userId = session.user.id
        userEmail = session.user.email
        if (!userId && userEmail) {
          const dbUser = await db.user.findUnique({ where: { email: userEmail } })
          if (dbUser) userId = dbUser.id
        }
      }
    } catch {}

    if (!userId) {
      const cookiesHeader = request.headers.get('cookie')
      if (cookiesHeader && cookiesHeader.includes('user=')) {
        try {
          const raw = cookiesHeader.split('user=')[1]?.split(';')[0]
          if (raw) {
            const parsed = JSON.parse(decodeURIComponent(raw))
            userId = parsed.id
            userEmail = parsed.email
          }
        } catch {}
      }
    }

    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, phone: true, address: true, role: true, image: true, emailVerified: true, phoneVerified: true, createdAt: true }
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

