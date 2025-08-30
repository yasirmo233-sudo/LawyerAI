import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container max-w-screen-xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">Ready to try LawyerAI?</h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Join thousands of legal professionals who trust LawyerAI for faster, smarter legal work.
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
