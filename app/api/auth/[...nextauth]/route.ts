import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = 'force-dynamic'

// Check environment variables on startup
console.log('🚀 [NEXTAUTH ROUTE] Initializing NextAuth')
console.log('🚀 [NEXTAUTH ROUTE] Environment check:', {
  hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
  hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
  hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  hasDatabase: !!process.env.MYSQL_URL,
})

if (!process.env.NEXTAUTH_SECRET) {
  console.error('🔴 CRITICAL: NEXTAUTH_SECRET is not set!')
}
if (!process.env.NEXTAUTH_URL) {
  console.error('🔴 WARNING: NEXTAUTH_URL is not set!')
}

const handler = NextAuth(authOptions)

// Wrap handlers to add request logging
export async function GET(req: Request) {
  const url = new URL(req.url)
  console.log('📥 [NEXTAUTH GET]', url.pathname + url.search)
  const response = await handler(req)
  console.log('📤 [NEXTAUTH GET] Response status:', response.status)
  return response
}

export async function POST(req: Request) {
  const url = new URL(req.url)
  console.log('📥 [NEXTAUTH POST]', url.pathname + url.search)
  const response = await handler(req)
  console.log('📤 [NEXTAUTH POST] Response status:', response.status)
  return response
}
