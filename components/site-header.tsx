"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2 ml-2">
          <span className="text-xl font-bold text-balance">Psalm</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="#use-cases" className="text-foreground/60 hover:text-foreground transition-colors">
            Use Cases
          </Link>
          <Link href="#pricing" className="text-foreground/60 hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="text-foreground/60 hover:text-foreground transition-colors">
            FAQ
          </Link>
        </nav>

        <Button asChild>
          <Link href="/app">Start now</Link>
        </Button>
      </div>
    </header>
  )
}
