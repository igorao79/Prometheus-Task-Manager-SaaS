import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("=== Fetching user tarif ===")
    const session = await getServerSession(authOptions)
    console.log("Session exists:", !!session)
    console.log("Session user:", session?.user)

    if (!session?.user?.id) {
      console.log("No session or user ID - returning 401")
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }

    console.log("User ID from session:", session.user.id)

    console.log("Connecting to database...")
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tarif: true }
    })

    console.log("Database query completed")
    console.log("User found:", !!user)

    if (!user) {
      console.log("User not found in database - returning 404")
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      )
    }

    console.log("User tarif:", user.tarif)
    console.log("=== Success - returning tarif ===")

    return NextResponse.json({ tarif: user.tarif })
  } catch (error) {
    console.error("=== Error fetching user tarif ===")
    console.error("Error:", error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    console.log("=== Updating user tarif ===")
    const session = await getServerSession(authOptions)
    console.log("Session exists:", !!session)
    console.log("Session user:", session?.user)

    if (!session?.user?.id) {
      console.log("No session or user ID - returning 401")
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { tarif } = body

    if (!tarif || !['free', 'prof', 'corp'].includes(tarif)) {
      return NextResponse.json(
        { error: "Неверный тариф" },
        { status: 400 }
      )
    }

    console.log("User ID from session:", session.user.id)
    console.log("New tarif:", tarif)

    console.log("Updating user tarif in database...")
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { tarif },
      select: { tarif: true }
    })

    console.log("Database update completed")
    console.log("Updated user tarif:", updatedUser.tarif)
    console.log("=== Success - tarif updated ===")

    return NextResponse.json({ tarif: updatedUser.tarif })
  } catch (error) {
    console.error("=== Error updating user tarif ===")
    console.error("Error:", error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}