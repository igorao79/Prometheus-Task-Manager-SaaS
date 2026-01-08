"use client"

import { useState, useMemo } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { KanbanColumn } from "./kanban-column"
import { TaskCard } from "./task-card"
import { CreateTaskModal } from "./create-task-modal"
import { EditTaskModal } from "./edit-task-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string | null
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  deadline: Date | null
  creatorId: string
  assigneeId: string | null
  projectId: string
  createdAt: Date
  updatedAt: Date
  creator: {
    id: string
    name: string | null
    email: string
  }
  assignee: {
    id: string
    name: string | null
    email: string
  } | null
}

interface ProjectMember {
  id: string
  joinedAt: Date
  role: string
  userId: string
  projectId: string
  user: {
    id: string
    name: string | null
    email: string
  }
}

interface KanbanBoardProps {
  projectId: string
  tasks: Task[]
  members: ProjectMember[]
  userRole: string
  userId: string
}

export function KanbanBoard({
  projectId,
  tasks: initialTasks,
  members
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const columns = useMemo(() => {
    const grouped = tasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = []
      }
      acc[task.status].push(task)
      return acc
    }, {} as Record<string, Task[]>)

    return {
      TODO: grouped.TODO || [],
      IN_PROGRESS: grouped.IN_PROGRESS || [],
      REVIEW: grouped.REVIEW || [],
      DONE: grouped.DONE || [],
    }
  }, [tasks])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveTask(null)
      return
    }

    const taskId = active.id as string
    const newStatus = over.id as Task["status"]

    // Если статус не изменился, ничего не делаем
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.status === newStatus) {
      setActiveTask(null)
      return
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Обновляем локальное состояние задач
        setTasks(prevTasks =>
          prevTasks.map(t =>
            t.id === taskId
              ? { ...t, status: newStatus, updatedAt: new Date() }
              : t
          )
        )
      } else {
        console.error("Failed to update task status")
      }
    } catch (error) {
      console.error("Error updating task status:", error)
    }

    setActiveTask(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowEditModal(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту задачу?")) {
      return
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Удаляем задачу из локального состояния
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId))
      } else {
        console.error("Failed to delete task")
      }
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const handleTaskUpdated = () => {
    // В будущем здесь можно добавить логику для обновления данных без перезагрузки
    window.location.reload()
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask])
    setShowCreateModal(false)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-heading text-foreground">Kanban доска</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Создать задачу
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KanbanColumn
            id="TODO"
            title="К выполнению"
            tasks={columns.TODO}
            count={columns.TODO.length}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
          <KanbanColumn
            id="IN_PROGRESS"
            title="В работе"
            tasks={columns.IN_PROGRESS}
            count={columns.IN_PROGRESS.length}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
          <KanbanColumn
            id="REVIEW"
            title="Проверка"
            tasks={columns.REVIEW}
            count={columns.REVIEW.length}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
          <KanbanColumn
            id="DONE"
            title="Готово"
            tasks={columns.DONE}
            count={columns.DONE.length}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        projectId={projectId}
        members={members}
        onTaskCreated={handleTaskCreated}
      />

      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingTask(null)
        }}
        task={editingTask}
        members={members}
        onTaskUpdated={handleTaskUpdated}
      />
    </>
  )
}
