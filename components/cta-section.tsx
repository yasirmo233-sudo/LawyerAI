import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">Ready to try Psalm AI legal assistant?</h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Try Psalm for free — jurisdiction-aware legal research, drafting, and compliance assistance built for
            legal professionals.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild className="text-base">
              <Link href="/app">
                Start now for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
