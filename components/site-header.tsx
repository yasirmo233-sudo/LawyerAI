"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between relative">
          <Link href="/" className="flex items-center space-x-2 min-w-[100px]">
            <span className="text-xl font-bold text-balance">Psalm</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 transform -translate-x-1/2">
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

          <div className="min-w-[100px] flex justify-end">
            <Button asChild>
              <Link href="/app">Start now</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
