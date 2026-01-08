import { Header } from "@/components/layout/header"
import { PricingSection } from "@/components/sections/pricing-section"
import { AnimatedBackground } from "@/components/ui/animated-background"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted relative">
      <AnimatedBackground />
      <Header />
      <main>
        <PricingSection />
      </main>
    </div>
  )
}
