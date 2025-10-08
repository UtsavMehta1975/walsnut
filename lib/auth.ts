import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
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
      console.log('🟢 [SIGNIN CALLBACK] Started')
      console.log('🟢 [SIGNIN CALLBACK] User:', { email: user?.email, name: user?.name, id: user?.id })
      console.log('🟢 [SIGNIN CALLBACK] Account:', { provider: account?.provider, type: account?.type })
      
      // For Google OAuth - create/update user in database
      if (account?.provider === "google") {
        console.log('🟢 [SIGNIN CALLBACK] Google provider detected')
        try {
          console.log('🟢 [SIGNIN CALLBACK] Checking if user exists in database...')
          const existingUser = await db.user.findUnique({
            where: { email: user.email! }
          })
          
          if (existingUser) {
            console.log('🟢 [SIGNIN CALLBACK] User found:', existingUser.id)
            console.log('🟢 [SIGNIN CALLBACK] Updating user with Google data...')
            await db.user.update({
              where: { email: user.email! },
              data: {
                name: user.name || existingUser.name,
                image: user.image,
                emailVerified: new Date()
              }
            })
            console.log('🟢 [SIGNIN CALLBACK] User updated successfully')
          } else {
            console.log('🟢 [SIGNIN CALLBACK] User not found, creating new user...')
            const newUser = await db.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                emailVerified: new Date(),
                role: 'CUSTOMER'
              }
            })
            console.log('🟢 [SIGNIN CALLBACK] New user created:', newUser.id)
          }
          
          console.log('🟢 [SIGNIN CALLBACK] Returning true (sign in allowed)')
          return true
        } catch (error) {
          console.error('🔴 [SIGNIN CALLBACK] Error:', error)
          return false
        }
      }
      
      console.log('🟢 [SIGNIN CALLBACK] Non-Google provider, allowing sign in')
      return true
    },
    
    async jwt({ token, user, account, profile }) {
      console.log('🟡 [JWT CALLBACK] Started')
      console.log('🟡 [JWT CALLBACK] Has user?', !!user)
      console.log('🟡 [JWT CALLBACK] Has account?', !!account)
      
      // On initial sign in, add user data to token
      if (user) {
        console.log('🟡 [JWT CALLBACK] Initial sign in detected')
        try {
          if (account?.provider === "google") {
            console.log('🟡 [JWT CALLBACK] Google provider - fetching user from database...')
            const dbUser = await db.user.findUnique({
              where: { email: user.email! }
            })
            
            if (dbUser) {
              console.log('🟡 [JWT CALLBACK] Database user found:', dbUser.id)
              token.role = dbUser.role
              token.id = dbUser.id
              token.image = dbUser.image
              console.log('🟡 [JWT CALLBACK] Token populated with DB data')
            } else {
              console.log('🟡 [JWT CALLBACK] Database user not found, using defaults')
              token.role = 'CUSTOMER'
              token.id = user.id || user.email
              token.image = user.image || null
            }
          } else {
            console.log('🟡 [JWT CALLBACK] Credentials provider - using user object data')
            token.role = user.role || 'CUSTOMER'
            token.id = user.id || user.email
            token.image = user.image || null
          }
          console.log('🟡 [JWT CALLBACK] Final token:', { role: token.role, id: token.id, hasImage: !!token.image })
        } catch (error) {
          console.error('🔴 [JWT CALLBACK] Error:', error)
          token.role = 'CUSTOMER'
          token.id = user.email
          token.image = null
        }
      } else {
        console.log('🟡 [JWT CALLBACK] No user - token refresh')
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

