import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

// Log configuration on startup
console.log('NextAuth Config:', {
  hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
  hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
  hasDatabase: !!process.env.MYSQL_URL,
})

export const authOptions: NextAuthOptions = {
  providers: [
    // Only add Google provider if credentials are present
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ] : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Check if database is configured
          if (!process.env.MYSQL_URL) {
            console.error('Database not configured for authentication')
            return null
          }

          // Optimized query - only select necessary fields
          const user = await db.user.findUnique({
            where: {
              email: credentials.email.toLowerCase()
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              hashedPassword: true,
              image: true
            }
          })

          if (!user) {
            return null
          }

          // Fast password validation
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.hashedPassword || ""
          )

          if (!isPasswordValid) {
            return null
          }

          // Return user data without password
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Always allow sign in - we'll handle user creation in background
      return true
    },
    async jwt({ token, user, account, profile }) {
      // On initial sign in, add user data to token
      if (user) {
        try {
          token.role = user.role || 'CUSTOMER'
          token.id = user.id || user.email
          token.image = user.image || null
        } catch (error) {
          console.error('JWT callback error:', error)
          token.role = 'CUSTOMER'
          token.id = user.email
          token.image = null
        }
      }
      return token
    },
    async session({ session, token }) {
      // Add token data to session - wrapped in try-catch for safety
      try {
        if (session?.user) {
          session.user.role = (token.role as string) || 'CUSTOMER'
          session.user.id = (token.id as string) || ''
          session.user.image = (token.image as string) || null
        }
      } catch (error) {
        console.error('Session callback error:', error)
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', // Custom error page
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
    updateAge: 60 * 60, // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET || 'a6l15TQlu9p8qpFB+wLMj35R583D1df6Wu71+fyw+PU=',
  debug: process.env.NODE_ENV === 'development', // Enable debug only in development
}

