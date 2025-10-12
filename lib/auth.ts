import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  // Use Prisma Adapter for proper OAuth flow
  adapter: PrismaAdapter(db),
  
  providers: [
    // Google OAuth - only if credentials are set
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
        },
        // Allow account linking by email
        allowDangerousEmailAccountLinking: true,
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
      console.log('🟢 [SIGNIN CALLBACK] Started')
      console.log('🟢 [SIGNIN CALLBACK] User:', { email: user?.email, name: user?.name, id: user?.id })
      console.log('🟢 [SIGNIN CALLBACK] Account:', { provider: account?.provider, type: account?.type })
      
      // PrismaAdapter handles user creation automatically for OAuth
      // We just need to ensure role is set correctly for new Google users
      if (account?.provider === "google") {
        console.log('🟢 [SIGNIN CALLBACK] Google provider detected')
        try {
          // Check if this is a new user and set default role
          const existingUser = await db.user.findUnique({
            where: { email: user.email! }
          })
          
          if (existingUser) {
            console.log('🟢 [SIGNIN CALLBACK] Existing user, allowing sign in:', existingUser.id)
          } else {
            console.log('🟢 [SIGNIN CALLBACK] New Google user will be created by PrismaAdapter')
          }
          
          return true
        } catch (error) {
          console.error('🔴 [SIGNIN CALLBACK] Error:', error)
          return false
        }
      }
      
      console.log('🟢 [SIGNIN CALLBACK] Non-Google provider, allowing sign in')
      return true
    },
    
    async jwt({ token, user, account, profile, trigger }) {
      console.log('🟡 [JWT CALLBACK] Started', { trigger, hasUser: !!user, hasAccount: !!account })
      
      // On initial sign in or when user data is present
      if (user) {
        console.log('🟡 [JWT CALLBACK] Initial sign in detected')
        try {
          // Fetch fresh user data from database to get role and image
          const dbUser = await db.user.findUnique({
            where: { email: user.email! }
          })
          
          if (dbUser) {
            console.log('🟡 [JWT CALLBACK] Database user found:', dbUser.id)
            token.role = dbUser.role
            token.id = dbUser.id
            token.email = dbUser.email
            token.name = dbUser.name
            token.image = dbUser.image
            console.log('🟡 [JWT CALLBACK] Token populated with DB data:', { role: token.role, id: token.id })
          } else {
            // Fallback for new users (shouldn't happen with PrismaAdapter)
            console.log('🟡 [JWT CALLBACK] Database user not found, using defaults')
            token.role = user.role || 'CUSTOMER'
            token.id = user.id || user.email
            token.email = user.email
            token.name = user.name
            token.image = user.image || null
          }
        } catch (error) {
          console.error('🔴 [JWT CALLBACK] Error:', error)
          token.role = user.role || 'CUSTOMER'
          token.id = user.id || user.email
          token.email = user.email
          token.name = user.name
          token.image = user.image || null
        }
      }
      
      // Refresh user data on token update
      if (trigger === "update" && token.email) {
        try {
          const dbUser = await db.user.findUnique({
            where: { email: token.email as string }
          })
          if (dbUser) {
            token.role = dbUser.role
            token.image = dbUser.image
            token.name = dbUser.name
            console.log('🟡 [JWT CALLBACK] Token refreshed with latest DB data')
          }
        } catch (error) {
          console.error('🔴 [JWT CALLBACK] Error refreshing token:', error)
        }
      }
      
      console.log('🟡 [JWT CALLBACK] Returning token')
      return token
    },
    
    async session({ session, token }) {
      console.log('🔵 [SESSION CALLBACK] Started')
      console.log('🔵 [SESSION CALLBACK] Token:', { role: token.role, id: token.id, hasImage: !!token.image })
      
      // Add token data to session - wrapped in try-catch for safety
      try {
        if (session?.user) {
          session.user.role = (token.role as string) || 'CUSTOMER'
          session.user.id = (token.id as string) || ''
          session.user.image = (token.image as string) || null
          console.log('🔵 [SESSION CALLBACK] Session populated:', { 
            email: session.user.email, 
            role: session.user.role,
            id: session.user.id 
          })
        }
      } catch (error) {
        console.error('🔴 [SESSION CALLBACK] Error:', error)
      }
      
      console.log('🔵 [SESSION CALLBACK] Returning session')
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt", // Using JWT for both OAuth and credentials
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'a6l15TQlu9p8qpFB+wLMj35R583D1df6Wu71+fyw+PU=',
  debug: process.env.NODE_ENV === 'development',
  // Events for debugging
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('✅ [EVENT] User signed in:', { 
        email: user.email, 
        provider: account?.provider,
        isNewUser 
      })
      
      // Set default role for new Google users
      if (isNewUser && account?.provider === "google") {
        try {
          await db.user.update({
            where: { email: user.email! },
            data: { role: 'CUSTOMER' }
          })
          console.log('✅ [EVENT] Set default CUSTOMER role for new Google user')
        } catch (error) {
          console.error('🔴 [EVENT] Failed to set role:', error)
        }
      }
    },
    async signOut({ token }) {
      console.log('✅ [EVENT] User signed out:', token?.email)
    },
  },
}

