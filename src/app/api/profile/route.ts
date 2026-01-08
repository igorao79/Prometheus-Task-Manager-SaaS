import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// GET - получить профиль пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// PUT - обновить профиль пользователя
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }

    const { name, currentPassword, newPassword, image } = await request.json()

    // Валидация данных
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Имя обязательно" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      )
    }

    // Если меняется пароль, проверить текущий пароль
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Текущий пароль обязателен для смены пароля" },
          { status: 400 }
        )
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password || "")
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: "Текущий пароль неверный" },
          { status: 400 }
        )
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Новый пароль должен содержать минимум 6 символов" },
          { status: 400 }
        )
      }
    }

    // Подготовка данных для обновления
    const updateData: {
      name: string
      image?: string | null
      password?: string
    } = {
      name: name.trim(),
    }

    if (image !== undefined) {
      updateData.image = image
    }

    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    // Обновление пользователя
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      message: "Профиль успешно обновлен",
      user: updatedUser
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
