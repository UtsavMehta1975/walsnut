import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔐 NextAuth authorize called with:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        try {
          const user = await db.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            console.log('❌ User not found:', credentials.email)
            return null
          }

          console.log('✅ User found:', user.email, user.role)

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          )

          if (!isPasswordValid) {
            console.log('❌ Invalid password for user:', credentials.email)
            return null
          }

          console.log('✅ Password validated for user:', credentials.email)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('❌ Error in authorize:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('🔄 JWT callback - user:', user?.email, 'role:', user?.role, 'token exists:', !!token, 'account:', account?.type)
      if (user) {
        token.role = user.role
        token.id = user.id
        console.log('✅ JWT callback - Updated token with user data:', { role: user.role, id: user.id })
      }
      console.log('🔄 JWT callback - Final token:', { role: token.role, id: token.id })
      return token
    },
    async session({ session, token }) {
      console.log('🔄 Session callback - token role:', token.role, 'session exists:', !!session, 'token id:', token.id)
      console.log('🔄 Session callback - Full token:', token)
      console.log('🔄 Session callback - Full session before update:', session)
      
      if (token) {
        session.user.role = token.role
        session.user.id = token.id
        console.log('✅ Session callback - Updated session with token data:', { role: token.role, id: token.id })
      }
      console.log('🔄 Session callback - Final session:', session)
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', // Custom error page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  debug: process.env.NODE_ENV === 'development',
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('✅ User signed in:', user.email)
    },
    async signOut({ session, token }) {
      console.log('🚪 User signed out:', session?.user?.email || token?.email)
    }
  }
}

