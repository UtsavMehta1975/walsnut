import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = 'force-dynamic'

// Check environment variables on startup
console.log('🚀 [NEXTAUTH] Initializing with environment:', {
  hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
  hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
  hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  hasDatabase: !!process.env.MYSQL_URL,
})

const handler = NextAuth(authOptions)

// Export directly without wrapping - wrapping breaks NextAuth's internal routing
export { handler as GET, handler as POST }
