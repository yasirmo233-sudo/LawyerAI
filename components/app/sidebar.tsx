"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MessageSquare, Search, Trash2, MoreHorizontal, Edit3, Copy } from "lucide-react"
import { LEGAL_PRESETS, applyJurisdictionToPreset } from "@/lib/presets"
import { useChatActions } from "@/lib/store/useChatStore"
import { useToast } from "@/hooks/use-toast"
import type { ChatSession } from "@/types/chat"
import { cn } from "@/lib/utils"

interface SidebarProps {
  sessions: ChatSession[]
  currentSession: ChatSession | null
  selectedChatId?: string | null
  onSessionSelect: (session: ChatSession) => void
  onNewSession: () => void
  onDeleteSession: (sessionId: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({
  sessions,
  currentSession,
  selectedChatId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  isOpen,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const { createChat, setCurrentSession, renameChat, addMessage } = useChatActions()
  const { toast } = useToast()

  const filteredSessions = sessions.filter((session) => session.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handlePresetClick = (presetId: string) => {
    const preset = LEGAL_PRESETS.find((p) => p.id === presetId)
    if (!preset) return

    // Use current session's jurisdiction or default to US
    const jurisdiction = currentSession?.jurisdiction || "US"
    const jurisdictionName = jurisdiction === "US" ? "United States" : jurisdiction

    const appliedPreset = applyJurisdictionToPreset(preset, jurisdictionName)

    console.log("[v0] Creating new chat with preset:", presetId)

    const newChatId = createChat({
      system: appliedPreset.system,
      prefill: appliedPreset.prefill,
      jurisdiction,
    })

    console.log("[v0] Created new chat with preset:", presetId, "ID:", newChatId)
    console.log("[v0] Setting prefill content:", appliedPreset.prefill)

    // Immediately set as current session
    setCurrentSession(newChatId)

    // Trigger navigation callback with a slight delay to ensure state is updated
    setTimeout(() => {
      const newSession = sessions.find((s) => s.id === newChatId)
      if (newSession) {
        console.log("[v0] Navigating to new session:", newChatId)
        onSessionSelect(newSession)
      }
    }, 50)
  }

  const handleNewChatClick = () => {
    console.log("[v0] New chat button clicked from sidebar")
    const newChatId = createChat()
    setCurrentSession(newChatId)
    console.log("[v0] Created new chat with ID:", newChatId)
  }

  const handleStartRename = (session: ChatSession) => {
    setEditingId(session.id)
    setEditTitle(session.title)
  }

  const handleSaveRename = (sessionId: string) => {
    if (editTitle.trim() && editTitle.trim() !== sessions.find((s) => s.id === sessionId)?.title) {
      renameChat(sessionId, editTitle.trim())
      toast({ description: "Chat renamed" })
    }
    setEditingId(null)
    setEditTitle("")
  }

  const handleCancelRename = () => {
    setEditingId(null)
    setEditTitle("")
  }

  const handleDuplicateChat = (session: ChatSession) => {
    const newChatId = createChat({
      system: session.systemPrompt,
      jurisdiction: session.jurisdiction,
    })

    // Copy all non-system messages to the new chat
    session.messages
      .filter((msg) => msg.role !== "system")
      .forEach((msg) => {
        addMessage(newChatId, {
          ...msg,
          id: Math.random().toString(36).substring(2, 15),
          timestamp: new Date(),
        })
      })

    setCurrentSession(newChatId)
    toast({ description: "Chat duplicated" })
  }

  if (!isOpen) {
    return (
      <div className="w-12 border-r bg-muted/30 flex flex-col items-center py-4 gap-2">
        <Button variant="ghost" size="sm" onClick={handleNewChatClick} aria-label="New chat">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-80 border-r bg-muted/30 flex flex-col">
      <div className="p-4 space-y-4">
        <Button onClick={handleNewChatClick} className="w-full justify-start">
          <MessageSquare className="h-4 w-4 mr-2" />
          New Chat
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Search chats"
          />
        </div>
      </div>

      <Separator />

      <div className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Legal Presets</h3>
        <div className="space-y-2">
          {LEGAL_PRESETS.slice(0, 3).map((preset) => (
            <Button
              key={preset.id}
              variant="ghost"
              className={cn(
                "w-full justify-start h-auto p-3 text-left transition-all duration-200",
                "hover:border hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/30",
                "focus:border-blue-500 focus:bg-blue-50/30 dark:focus:bg-blue-950/30",
              )}
              onClick={() => handlePresetClick(preset.id)}
            >
              <preset.icon className="h-4 w-4 mr-3 flex-shrink-0 text-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">{preset.label}</div>
                <div className="text-xs text-muted-foreground">{preset.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">Chats</h3>
          </div>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 pb-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/60 cursor-pointer transition-colors text-sm",
                  currentSession?.id === session.id && "bg-muted/80",
                )}
                onClick={() => editingId !== session.id && onSessionSelect(session)}
                role="button"
                tabIndex={0}
                aria-label={`Select chat: ${session.title}`}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && editingId !== session.id) {
                    e.preventDefault()
                    onSessionSelect(session)
                  }
                }}
              >
                <div className="flex-1 min-w-0">
                  {editingId === session.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveRename(session.id)
                          } else if (e.key === "Escape") {
                            handleCancelRename()
                          }
                        }}
                        onBlur={() => handleSaveRename(session.id)}
                        className="text-sm h-7 bg-background"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <>
                      <div className="text-sm font-normal truncate text-foreground group-hover:text-foreground transition-colors">
                        {session.title}
                      </div>
                    </>
                  )}
                </div>

                {editingId !== session.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 focus:opacity-100 hover:bg-muted transition-all"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Chat actions for: ${session.title}`}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStartRename(session)
                        }}
                      >
                        <Edit3 className="h-3 w-3 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDuplicateChat(session)
                        }}
                      >
                        <Copy className="h-3 w-3 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteSession(session.id)
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}

            {filteredSessions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {searchQuery ? "No chats found" : "No chats yet"}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
