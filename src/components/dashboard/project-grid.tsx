"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Filter } from "lucide-react"
import { ProjectCard } from "./project-card"
import { CreateProjectModal } from "./create-project-modal"

interface Project {
  id: string
  name: string
  description: string | null
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED"
  createdAt: string
  creatorId: string
  creator: {
    name: string | null
    email: string
  }
  _count: {
    members: number
    tasks: number
  }
}

interface ProjectGridProps {
  userId: string
}

export function ProjectGrid({ userId }: ProjectGridProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  // Фильтруем проекты по статусу
  const filteredProjects = useMemo(() => {
    if (statusFilter === "ALL") return projects
    return projects.filter(project => project.status === statusFilter)
  }, [projects, statusFilter])

  useEffect(() => {
    fetchProjects()
  }, [userId])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const projectsData = await response.json()
        setProjects(projectsData)
      } else {
        console.error("Failed to fetch projects")
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Plus className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-heading text-foreground mb-2">
          Нет проектов
        </h2>
        <p className="text-muted-foreground mb-6">
          Создайте свой первый проект для начала работы с задачами
        </p>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Создать проект
        </Button>
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          userId={userId}
          onProjectCreated={(newProject) => {
            // Transform to full Project type
            const fullProject: Project = {
              ...newProject,
              status: "ACTIVE", // New projects are active by default
              creatorId: userId, // Current user is the creator
              creator: {
                name: "Вы", // Current user is the creator
                email: "", // We don't need email here
              },
            }
            setProjects(prev => [...prev, fullProject])
            setShowCreateModal(false)
          }}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
          <h2 className="text-xl font-heading text-foreground">Мои проекты</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Все проекты</SelectItem>
                <SelectItem value="ACTIVE">Активные</SelectItem>
                <SelectItem value="COMPLETED">Завершенные</SelectItem>
                <SelectItem value="ARCHIVED">Архивированные</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Создать проект
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            userId={userId}
            onUpdate={fetchProjects}
          />
        ))}
      </div>
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userId={userId}
        onProjectCreated={(newProject) => {
          // Transform to full Project type
          const fullProject: Project = {
            ...newProject,
            status: "ACTIVE", // New projects are active by default
            creatorId: userId, // Current user is the creator
            creator: {
              name: "Вы", // Current user is the creator
              email: "", // We don't need email here
            },
          }
          setProjects(prev => [...prev, fullProject])
          setShowCreateModal(false)
        }}
      />
    </div>
  )
}
