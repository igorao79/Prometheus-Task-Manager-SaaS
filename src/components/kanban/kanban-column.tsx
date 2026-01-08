"use client"

import { useDroppable } from "@dnd-kit/core"
import { TaskCard } from "./task-card"
import { Badge } from "@/components/ui/badge"

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

interface KanbanColumnProps {
  id: string
  title: string
  tasks: Task[]
  count: number
  onEditTask?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
}

const getColumnColor = (status: string) => {
  switch (status) {
    case "TODO":
      return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
    case "IN_PROGRESS":
      return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
    case "REVIEW":
      return "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950"
    case "DONE":
      return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
    default:
      return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
  }
}

const getHeaderColor = (status: string) => {
  switch (status) {
    case "TODO":
      return "text-blue-700 dark:text-blue-300"
    case "IN_PROGRESS":
      return "text-yellow-700 dark:text-yellow-300"
    case "REVIEW":
      return "text-purple-700 dark:text-purple-300"
    case "DONE":
      return "text-green-700 dark:text-green-300"
    default:
      return "text-gray-700 dark:text-gray-300"
  }
}

export function KanbanColumn({ id, title, tasks, count, onEditTask, onDeleteTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col min-h-[600px] border-2 rounded-lg p-4 transition-colors
        ${getColumnColor(id)}
        ${isOver ? "ring-2 ring-primary ring-opacity-50" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-heading text-lg ${getHeaderColor(id)}`}>
          {title}
        </h3>
        <Badge variant="secondary" className="font-medium">
          {count}
        </Badge>
      </div>

      <div className="flex-1 space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  )
}
