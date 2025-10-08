import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = 'force-dynamic'

// Check environment variables on startup
if (!process.env.NEXTAUTH_SECRET) {
  console.error('CRITICAL: NEXTAUTH_SECRET is not set!')
}
if (!process.env.NEXTAUTH_URL) {
  console.error('WARNING: NEXTAUTH_URL is not set!')
}

const handler = NextAuth(authOptions)

// Export both GET and POST using the correct params structure for App Router
export { handler as GET, handler as POST }
