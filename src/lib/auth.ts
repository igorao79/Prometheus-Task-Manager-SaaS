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
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user?.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                tarif: user.tarif,
              }
        } catch (error) {
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
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        // При логине - устанавливаем данные из user
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.tarif = user.tarif
      }

      // При update() - обновляем токен новыми данными
      if (trigger === "update" && session?.user) {
        token.name = session.user.name
        token.email = session.user.email
        // Обновляем тариф из БД при update
        try {
          const freshUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { name: true, email: true, tarif: true, image: true }
          })
          if (freshUser) {
            token.name = freshUser.name
            token.email = freshUser.email
            token.tarif = freshUser.tarif
            token.picture = freshUser.image
          }
        } catch (error) {
        }
      }

      return token
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string

        // Всегда получаем свежий тариф из базы данных для консистентности
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { name: true, email: true, tarif: true, image: true }
          })
          if (user) {
            session.user.name = user.name
            session.user.email = user.email
            session.user.tarif = user.tarif
            session.user.image = user.image
          }
        } catch (error) {
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
