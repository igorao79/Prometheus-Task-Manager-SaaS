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

  useEffect(() => {
    if (status === "loading") return
    if (!session?.user) {
      redirect("/auth/signin")
      return
    }

    fetchProjects()
  }, [session, status, fetchProjects])

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

        <AnalyticsCards projects={projectsWithTasks} onTasksUpdate={fetchProjects} />

        <ProjectGrid userId={session.user.id} />
      </main>
    </div>
  )
}
