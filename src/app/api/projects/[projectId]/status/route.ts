import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProjectStatus } from "@prisma/client"
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }

    const { projectId } = await params
    const body = await request.json()
    const { status } = body

    const validStatuses = ["ACTIVE", "COMPLETED", "ARCHIVED"]
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Неверный статус проекта" },
        { status: 400 }
      )
    }

    // Проверяем, что пользователь является участником проекта
    const membership = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: session.user.id,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: "Доступ запрещен" },
        { status: 403 }
      )
    }

    // Обновляем статус проекта
    try {
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: { status: status as ProjectStatus },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            members: true,
            tasks: true,
          },
        },
      },
      })

      return NextResponse.json(updatedProject)
    } catch (dbError) {
      return NextResponse.json(
        { error: "Ошибка базы данных" },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
