"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { ProjectGrid } from "@/components/dashboard/project-grid"
import { AnalyticsCards } from "@/components/dashboard/analytics-cards"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [projectsWithTasks, setProjectsWithTasks] = useState([])
  const [projectsUpdated, setProjectsUpdated] = useState(0) // Trigger for re-fetching

  const fetchProjects = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/dashboard/projects')
      if (response.ok) {
        const projects = await response.json()
        setProjectsWithTasks(projects)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }, [session?.user?.id])

  const refreshAllData = useCallback(() => {
    fetchProjects()
    setProjectsUpdated(prev => prev + 1) // Trigger ProjectGrid to refresh
  }, [fetchProjects])

  useEffect(() => {
    if (status === "loading") return
    if (!session?.user) {
      redirect("/")
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects()
  }, [session, status, fetchProjects])

  // Автоматическое обновление для приглашенных пользователей
  useEffect(() => {
    if (!session?.user?.id) return

    const handleFocus = () => {
      fetchProjects() // Обновляем при фокусе окна
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProjects() // Обновляем при возвращении на вкладку
      }
    }

    // Обновление каждые 30 секунд
    const interval = setInterval(() => {
      if (!document.hidden) { // Только если вкладка активна
        fetchProjects()
      }
    }, 30000)

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(interval)
    }
  }, [session?.user?.id, fetchProjects])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-4"></div>
            <div className="h-4 bg-muted rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading text-foreground mb-2">
            Добро пожаловать, {session.user.name}!
          </h1>
          <p className="text-muted-foreground font-sans">
            Управляйте своими проектами и задачами
          </p>
        </div>

        <AnalyticsCards projects={projectsWithTasks} onTasksUpdate={refreshAllData} />

        <ProjectGrid userId={session.user.id} refreshTrigger={projectsUpdated} />
      </main>
    </div>
  )
}
