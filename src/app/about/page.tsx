import { Header } from "@/components/layout/header"
import { AboutSection } from "@/components/sections/about-section"
import { AnimatedBackground } from "@/components/ui/animated-background"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted relative">
      <AnimatedBackground />
      <Header />
      <main>
        <AboutSection />
      </main>
    </div>
  )
}
