"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, AlertTriangle, BarChart3, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface AnalyticsCardsProps {
  projects: Array<{
    id: string
    name: string
    tasks: Array<{
      id: string
      status: string
      deadline: Date | null
    }>
  }>
  onTasksUpdate?: () => void
}

export function AnalyticsCards({ projects, onTasksUpdate }: AnalyticsCardsProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)

  // Получаем задачи по статусу
  const getTasksByStatus = (status: string) => {
    const allTasks: Array<{
      id: string
      title: string
      status: string
      projectName: string
      projectId: string
    }> = []

    projects.forEach(project => {
      project.tasks.forEach(task => {
        // Нормализуем статусы для сравнения
        const normalizedTaskStatus = task.status.replace('_', '_')
        const normalizedFilterStatus = status.replace('_', '_')
        if (normalizedTaskStatus === normalizedFilterStatus) {
          allTasks.push({
            id: task.id,
            title: `Задача ${task.id.slice(0, 8)}`,
            status: task.status,
            projectName: project.name,
            projectId: project.id
          })
        }
      })
    })

    return allTasks
  }

  const handleCardClick = (status: string) => {
    setSelectedStatus(status)
    setShowTaskModal(true)
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        onTasksUpdate?.() // Обновляем данные
      }
    } catch (error) {
      console.error("Error updating task status:", error)
    }
  }
  // Подсчитываем статистику по всем проектам пользователя
  const stats = projects.reduce((acc, project) => {
    project.tasks.forEach(task => {
      acc.total++

      switch (task.status) {
        case "TODO":
          acc.todo++
          break
        case "IN_PROGRESS":
          acc.inProgress++
          break
        case "REVIEW":
          acc.review++
          break
        case "DONE":
          acc.done++
          break
      }

      // Проверяем просроченные задачи
      if (task.deadline && new Date(task.deadline) < new Date() && task.status !== "DONE") {
        acc.overdue++
      }
    })
    return acc
  }, {
    total: 0,
    todo: 0,
    inProgress: 0,
    review: 0,
    done: 0,
    overdue: 0
  })

  const cards = [
    {
      title: "Всего задач",
      value: stats.total,
      icon: BarChart3,
      color: "text-primary",
      bgColor: "bg-primary/5"
    },
    {
      title: "К выполнению",
      value: stats.todo,
      icon: Clock,
      color: "text-muted-foreground",
      bgColor: "bg-muted/30"
    },
    {
      title: "В работе",
      value: stats.inProgress,
      icon: AlertTriangle,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950"
    },
    {
      title: "Проверка",
      value: stats.review,
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950"
    },
    {
      title: "Готово",
      value: stats.done,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card) => {
        const IconComponent = card.icon
        return (
          <Card
            key={card.title}
            className={`${card.bgColor} border-0 ${card.title !== "Всего задач" ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
            onClick={() => {
              const trimmedTitle = card.title.trim()

              if (trimmedTitle !== "Всего задач") {
                let status = ""
                if (trimmedTitle === "К выполнению") status = "TODO"
                else if (trimmedTitle === "В работе") status = "IN_PROGRESS"
                else if (trimmedTitle === "Проверка") status = "REVIEW"
                else if (trimmedTitle === "Готово") status = "DONE"
                else {
                  return
                }

                if (status) {
                handleCardClick(status)
              }
            }
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {card.value}
              </div>
              {card.value > 0 && card.title !== "Всего задач" && (
                <div className="text-xs text-muted-foreground mt-1">
                  {card.title === "К выполнению" ? "Нажмите для просмотра" : "Нажмите для управления"}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      {/* Отдельная карточка для просроченных задач */}
      {stats.overdue > 0 && (
        <Card className="bg-destructive/5 border-destructive/20 md:col-span-2 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">
              Просроченные задачи
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.overdue}
            </div>
            <p className="text-xs text-destructive/80 mt-1">
              Требуют немедленного внимания
            </p>
          </CardContent>
        </Card>
      )}

      {/* Task Management Modal */}
      <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Управление задачами - {
                selectedStatus === "IN_PROGRESS" ? "В работе" :
                selectedStatus === "REVIEW" ? "Проверка" :
                selectedStatus === "DONE" ? "Готово" : ""
              }
            </DialogTitle>
            <DialogDescription>
              Выберите задачу для изменения статуса
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {(() => {
              const tasks = selectedStatus ? getTasksByStatus(selectedStatus) : []
              return tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">{task.projectName}</p>
                </div>
                <div className="flex gap-2">
                  {selectedStatus === "TODO" && (
                    <span className="text-xs text-muted-foreground italic">
                      Задачи в статусе &quot;К выполнению&quot; нельзя переместить
                    </span>
                  )}
                  {selectedStatus === "IN_PROGRESS" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(task.id, "TODO")}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        К выполнению
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(task.id, "REVIEW")}
                      >
                        Проверка
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </>
                  )}
                  {selectedStatus === "REVIEW" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(task.id, "IN_PROGRESS")}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        В работе
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(task.id, "DONE")}
                      >
                        Готово
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </>
                  )}
                  {selectedStatus === "DONE" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(task.id, "REVIEW")}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Вернуть в проверку
                    </Button>
                  )}
                </div>
              </div>
            ))
            })()}
            {selectedStatus && getTasksByStatus(selectedStatus).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Нет задач в этом статусе
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
