"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  title: string
  level: number
}

interface LegalPageProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  const [sections, setSections] = useState<Section[]>([])
  const [activeSection, setActiveSection] = useState<string>("")

  useEffect(() => {
    // Extract headings from the content
    const headings = document.querySelectorAll("h2, h3, h4")
    const sectionList: Section[] = Array.from(headings).map((heading) => ({
      id: heading.id,
      title: heading.textContent || "",
      level: Number.parseInt(heading.tagName.charAt(1)),
    }))
    setSections(sectionList)

    // Set up intersection observer for active section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0% -80% 0%" },
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [children])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="container max-w-screen-xl py-8">
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Table of Contents - Desktop */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Contents</h3>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start text-left h-auto py-2 px-3",
                        section.level === 3 && "pl-6",
                        section.level === 4 && "pl-9",
                        activeSection === section.id && "bg-muted text-foreground",
                      )}
                      onClick={() => scrollToSection(section.id)}
                    >
                      <span className="text-xs leading-relaxed">{section.title}</span>
                    </Button>
                  ))}
                </nav>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="max-w-3xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-balance mb-2">{title}</h1>
              <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
            </div>

            <div className="prose prose-gray max-w-none">{children}</div>
          </div>
        </div>
      </div>

      {/* Mobile Table of Contents */}
      <div className="lg:hidden mt-8 border-t pt-8">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <h3 className="text-sm font-semibold">Table of Contents</h3>
            <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
          </summary>
          <nav className="mt-4 space-y-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-left h-auto py-2",
                  section.level === 3 && "pl-4",
                  section.level === 4 && "pl-6",
                )}
                onClick={() => scrollToSection(section.id)}
              >
                <span className="text-xs">{section.title}</span>
              </Button>
            ))}
          </nav>
        </details>
      </div>
    </div>
  )
}
