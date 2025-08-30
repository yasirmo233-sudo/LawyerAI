"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Sparkles } from "lucide-react"
import { LEGAL_PRESETS, applyJurisdictionToPreset } from "@/lib/presets"
import { useChatActions } from "@/lib/store/useChatStore"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  onNewSession?: (preset?: { system?: string; prefill?: string; jurisdiction?: string }) => void
  jurisdiction?: string
  onSessionSelect?: (session: any) => void
}

export function EmptyState({ onNewSession, jurisdiction = "United States", onSessionSelect }: EmptyStateProps) {
  const { createChat, setCurrentSession } = useChatActions()
  const { updateSession } = useChatActions()

  const presetCards = LEGAL_PRESETS.slice(0, 3)

  const handlePresetClick = (presetId: string) => {
    const preset = LEGAL_PRESETS.find((p) => p.id === presetId)
    if (!preset) return

    // Use full country name in the prefill string
    const appliedPreset = applyJurisdictionToPreset(preset, jurisdiction)
    const prefill = appliedPreset.prefill.replace("— {{jurisdiction}}", `— ${jurisdiction}`)

    // If a parent provided an onNewSession handler, call it with the applied preset
    if (onNewSession) {
      onNewSession({
        system: appliedPreset.system,
        prefill: prefill,
        jurisdiction: jurisdiction === "United States" ? "US" : jurisdiction,
      })
      return
    }

    // Fallback to local creation when no external handler is provided
    const newChatId = createChat({
      system: appliedPreset.system,
      prefill: prefill,
      jurisdiction: jurisdiction === "United States" ? "US" : jurisdiction,
    })

    setCurrentSession(newChatId)

    // Trigger session selection if callback is provided
    if (onSessionSelect) {
      setTimeout(() => {
        // Create a mock session object for the callback
        const newSession = {
          id: newChatId,
          title: "New Chat",
          jurisdiction: jurisdiction === "United States" ? "US" : jurisdiction,
          messages: [],
          systemPrompt: appliedPreset.system,
          prefillContent: appliedPreset.prefill,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        onSessionSelect(newSession)
      }, 100)
    }

    console.log("[v0] Created new chat with preset:", presetId, "ID:", newChatId)
  }

  const handleStartNewChat = () => {
    console.log("[v0] Start New Chat clicked from empty state")

    // Always create empty chat with no preset when clicking New Chat button
    if (onNewSession) {
      onNewSession() // Parent handler will create empty chat
      return
    }

  // Create an explicit empty chat to avoid reusing a system-only session
  const newChatId = createChat({}) // Create empty chat with no preset
  // Ensure it's empty
  updateSession(newChatId, { prefillContent: undefined, systemPrompt: undefined })
  setCurrentSession(newChatId)
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-balance">Welcome to Psalm Lawyer AI</h1>
          <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
            Your AI legal assistant is ready to help with research, contract analysis, compliance questions, and more.
            Choose an example below or start a new conversation.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {presetCards.map((preset) => (
            <Card
              key={preset.id}
              className={cn(
                "cursor-pointer transition-all duration-200 text-left",
                "hover:border-blue-500 hover:shadow-md hover:bg-blue-50/30 dark:hover:bg-blue-950/20",
              )}
              onClick={() => handlePresetClick(preset.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <preset.icon className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">{preset.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{preset.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>


      </div>
    </div>
  )
}
