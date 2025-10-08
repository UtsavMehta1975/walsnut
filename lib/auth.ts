import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
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
      // For OAuth providers (like Google)
      if (account?.provider === "google") {
        try {
          if (!process.env.MYSQL_URL) {
            console.error('Database not configured for OAuth')
            return false
          }

          // Check if user already exists
          let existingUser = await db.user.findUnique({
            where: { email: user.email! }
          })

          if (existingUser) {
            // Update user with Google profile data
            await db.user.update({
              where: { email: user.email! },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
                emailVerified: new Date()
              }
            })
          } else {
            // Create new user from Google profile
            existingUser = await db.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                emailVerified: new Date(),
                role: 'CUSTOMER'
              }
            })
          }

          // Create or update account link
          const existingAccount = await db.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId
              }
            }
          })

          if (!existingAccount) {
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                expires_at: account.expires_at,
                refresh_token: account.refresh_token,
                session_state: account.session_state as string | null
              }
            })
          }
          
          return true
        } catch (error) {
          console.error('Google sign-in error:', error)
          return false
        }
      }
      
      return true
    },
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (user) {
        if (account?.provider === "google") {
          // For Google OAuth - fetch user data from database
          try {
            const dbUser = await db.user.findUnique({
              where: { email: user.email! },
              select: {
                id: true,
                role: true,
                image: true,
                name: true,
                email: true
              }
            })
            
            if (dbUser) {
              token.role = dbUser.role
              token.id = dbUser.id
              token.image = dbUser.image
            } else {
              token.role = 'CUSTOMER'
              token.id = user.id || user.email
              token.image = user.image
            }
          } catch (error) {
            console.error('JWT callback error:', error)
            token.role = 'CUSTOMER'
            token.id = user.id || user.email
            token.image = user.image
          }
        } else {
          // For credentials provider, user object already has the data
          token.role = user.role
          token.id = user.id
          token.image = user.image
        }
      }
      
      return token
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          session.user.role = token.role
          session.user.id = token.id
          session.user.image = token.image as string
        }
        return session
      } catch (error) {
        console.error('Session callback error:', error)
        return session
      }
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

