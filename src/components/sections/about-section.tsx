"use client"

import { Card } from "@/components/ui/card"

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            О проекте Gorex
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Современный инструмент для управления задачами, созданный разработчиками для разработчиков
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Наша миссия</h3>
            <p className="text-muted-foreground mb-6">
              Упростить процесс управления задачами в командах разработчиков.
              Мы верим, что отличный продукт рождается из эффективной коммуникации
              и четкого планирования работы.
            </p>
            <p className="text-muted-foreground">
              Gorex создан для того, чтобы каждая команда могла сосредоточиться
              на написании кода, а не на управлении процессом разработки.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-muted-foreground">Активных команд</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">10k+</div>
              <div className="text-muted-foreground">Завершенных задач</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-muted-foreground">Время работы</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-muted-foreground">Поддержка</div>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-8">Технологии</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-muted px-4 py-2 rounded-lg text-muted-foreground font-medium">
              Next.js 16
            </div>
            <div className="bg-muted px-4 py-2 rounded-lg text-muted-foreground font-medium">
              TypeScript
            </div>
            <div className="bg-muted px-4 py-2 rounded-lg text-muted-foreground font-medium">
              PostgreSQL
            </div>
            <div className="bg-muted px-4 py-2 rounded-lg text-muted-foreground font-medium">
              Prisma ORM
            </div>
            <div className="bg-muted px-4 py-2 rounded-lg text-muted-foreground font-medium">
              NextAuth.js
            </div>
            <div className="bg-muted px-4 py-2 rounded-lg text-muted-foreground font-medium">
              Tailwind CSS
            </div>
            <div className="bg-muted px-4 py-2 rounded-lg text-muted-foreground font-medium">
              Shadcn/ui
            </div>
            <div className="bg-muted px-4 py-2 rounded-lg text-muted-foreground font-medium">
              Render (Hosting)
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
