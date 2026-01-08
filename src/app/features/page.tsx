import { Header } from "@/components/layout/header"
import { FeaturesSection } from "@/components/sections/features-section"
import { AnimatedBackground } from "@/components/ui/animated-background"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted relative">
      <AnimatedBackground />
      <Header />
      <main>
        <FeaturesSection />
      </main>
    </div>
  )
}
