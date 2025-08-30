import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/hero"
import { FeatureGrid } from "@/components/feature-grid"
import { UseCases } from "@/components/use-cases"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { CTASection } from "@/components/cta-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <FeatureGrid />
        <UseCases />
        <Pricing />
        <FAQ />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  )
}
