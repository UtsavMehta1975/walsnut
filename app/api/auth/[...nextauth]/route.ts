import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = 'force-dynamic'

// Check environment variables on startup with detailed validation
const googleClientId = process.env.GOOGLE_CLIENT_ID || ''
const googleSecret = process.env.GOOGLE_CLIENT_SECRET || ''

// Check if values are placeholder/invalid
const isGoogleClientIdValid = googleClientId && 
  !googleClientId.includes('your-google-client-id') && 
  googleClientId.includes('.apps.googleusercontent.com')

const isGoogleSecretValid = googleSecret && 
  !googleSecret.includes('your-google-client-secret') && 
  (googleSecret.startsWith('GOCSPX-') || googleSecret.length > 20)

console.log('🚀 [NEXTAUTH] Initializing NextAuth with environment check...')
console.log('📋 [NEXTAUTH] Environment Variables Status:')
console.log('  ✓ NEXTAUTH_SECRET:', !!process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing')
console.log('  ✓ NEXTAUTH_URL:', !!process.env.NEXTAUTH_URL ? `✅ ${process.env.NEXTAUTH_URL}` : '❌ Missing')
console.log('  ✓ GOOGLE_CLIENT_ID:', !!process.env.GOOGLE_CLIENT_ID ? (isGoogleClientIdValid ? '✅ Valid' : '⚠️ Placeholder/Invalid') : '❌ Missing')
console.log('  ✓ GOOGLE_CLIENT_SECRET:', !!process.env.GOOGLE_CLIENT_SECRET ? (isGoogleSecretValid ? '✅ Valid' : '⚠️ Placeholder/Invalid') : '❌ Missing')
console.log('  ✓ MYSQL_URL:', !!process.env.MYSQL_URL ? '✅ Connected' : '❌ Missing')

if (!isGoogleClientIdValid || !isGoogleSecretValid) {
  console.log('')
  console.log('⚠️  [NEXTAUTH] WARNING: Google OAuth credentials are not configured!')
  console.log('⚠️  [NEXTAUTH] Google Sign-In will NOT work until you:')
  console.log('    1. Go to https://console.cloud.google.com/')
  console.log('    2. Create OAuth 2.0 credentials')
  console.log('    3. Update .env.local with real credentials')
  console.log('    4. Restart the server')
  console.log('    5. Visit http://localhost:3000/debug-oauth to verify')
  console.log('')
}

const handler = NextAuth(authOptions)

// Export directly without wrapping - wrapping breaks NextAuth's internal routing
export { handler as GET, handler as POST }
