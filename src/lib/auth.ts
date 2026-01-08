import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface User {
    id: string
    tarif?: string
  }
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      tarif?: string
    }
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize called with:", credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          console.log("Attempting to connect to database...")
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          console.log("User found:", user ? "yes" : "no")

          if (!user?.password) {
            console.log("User has no password")
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log("Password valid:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("Invalid password")
            return null
          }

              console.log("Auth successful for user:", user.email)
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                tarif: user.tarif,
              }
        } catch (error) {
          console.error("Auth error:", error)
          console.error("Error details:", error instanceof Error ? error.message : "Unknown error")
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 минут
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log("JWT callback:", { token, user })
      if (user) {
        token.id = user.id
        token.tarif = user.tarif
      }
      return token
    },
    session: async ({ session, token }) => {
      console.log("Session callback:", { session, token })
      if (token && session.user) {
        session.user.id = token.id as string

        // Всегда получаем свежий тариф из базы данных
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { tarif: true }
          })
          session.user.tarif = user?.tarif || 'free'
          console.log("Fresh tarif from DB:", session.user.tarif)
        } catch (error) {
          console.error("Error fetching fresh tarif:", error)
          session.user.tarif = token.tarif as string || 'free'
        }
      }
      return session
    }
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
}
