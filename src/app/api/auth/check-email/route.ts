import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email обязателен" },
        { status: 400 }
      )
    }

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true }, // Выбираем только ID для проверки существования
    })

    return NextResponse.json({
      exists: !!existingUser,
      message: existingUser ? "Email уже зарегистрирован" : "Email доступен"
    })
  } catch (_error) {
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
