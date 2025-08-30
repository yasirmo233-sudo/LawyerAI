"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 sm:py-32">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            AI legal assistant tuned to your jurisdiction
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            <span className="text-primary">AI legal assistant</span> tuned to your jurisdiction
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground text-pretty">
            Research, drafting, and compliance answers adapted to your country or state. Not legal advice.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="text-base">
              <Link href="/app">
                Start now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
              <Link href="#pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Subtle background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-20">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary to-accent" />
        </div>
      </div>
    </section>
  )
}
