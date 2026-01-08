import getServerSession from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/sections/hero-section"
import { AnimatedBackground } from "@/components/ui/animated-background"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted relative">
      <AnimatedBackground />
      <Header />
      <main>
        <HeroSection />
      </main>
    </div>
  )
}
