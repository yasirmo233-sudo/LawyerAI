"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { AppHeader } from "@/components/app/app-header"
import { Sidebar } from "@/components/app/sidebar"
import { ChatCanvas } from "@/components/app/chat-canvas"
import { RightPanel } from "@/components/app/right-panel"
import { AuthModal } from "@/components/auth/auth-modal"
import { useLocalSettings } from "@/hooks/use-local-settings"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useAuth } from "@/lib/store/useAuthStore"
import { LawyerAIClient, MockLawyerAIClient } from "@/lib/client"
import { useCurrentSession, useSessions, useChatActions } from "@/lib/store/useChatStore"
import type { ComposerRef } from "@/components/app/composer"

export default function AppPage() {
  const { settings, isLoaded } = useLocalSettings()
  const { isAuthenticated } = useAuth()
  const currentSession = useCurrentSession()
  const sessions = useSessions()
  const { createChat, deleteChat, setCurrentSession } = useChatActions()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [client, setClient] = useState<LawyerAIClient | null>(null)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const composerRef = useRef<ComposerRef>(null)

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      setShowAuthModal(true)
    }
  }, [isLoaded, isAuthenticated])

  useEffect(() => {
    if (currentSession) {
      setSelectedChatId(currentSession.id)
    }
  }, [currentSession])

  const handleDeleteSession = useCallback(
    (sessionId: string) => {
      deleteChat(sessionId)
      setSelectedChatId(null)
    },
    [deleteChat],
  )

  const createNewSession = useCallback(() => {
    console.log("[v0] Creating new session")
    const newId = createChat()
    setCurrentSession(newId)
    setSelectedChatId(newId)
    console.log("[v0] New session created with ID:", newId)
  }, [createChat, setCurrentSession])

  const handleSessionSelect = useCallback(
    (session: any) => {
      console.log("[v0] Selecting session:", session.id)
      setCurrentSession(session.id)
      setSelectedChatId(session.id)
    },
    [setCurrentSession],
  )

  const keyboardShortcuts = useMemo(
    () => ({
      onFocusComposer: () => composerRef.current?.focus(),
      onNewChat: createNewSession,
      onSendMessage: () => composerRef.current?.sendMessage(),
      onDeleteChat: selectedChatId ? () => handleDeleteSession(selectedChatId) : undefined,
    }),
    [createNewSession, selectedChatId, handleDeleteSession],
  )

  useKeyboardShortcuts(keyboardShortcuts)

  // Initialize client when settings are loaded
  useEffect(() => {
    if (!isLoaded) return

    if (settings.baseUrl && settings.apiKey) {
      setClient(new LawyerAIClient(settings))
    } else {
      setClient(new MockLawyerAIClient(settings))
    }
  }, [settings, isLoaded])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }

      // Delete selected chat with Delete key
      if (event.key === "Delete" && selectedChatId) {
        event.preventDefault()
        handleDeleteSession(selectedChatId)
        return
      }

      // Navigate chats with arrow keys
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault()
        const currentIndex = sessions.findIndex((s) => s.id === selectedChatId)
        let newIndex = currentIndex

        if (event.key === "ArrowUp") {
          newIndex = currentIndex > 0 ? currentIndex - 1 : sessions.length - 1
        } else {
          newIndex = currentIndex < sessions.length - 1 ? currentIndex + 1 : 0
        }

        if (sessions[newIndex]) {
          setSelectedChatId(sessions[newIndex].id)
          setCurrentSession(sessions[newIndex].id)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedChatId, sessions, setCurrentSession, handleDeleteSession])

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center" role="status" aria-live="polite">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <AuthModal onClose={() => setShowAuthModal(false)} />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        sessions={sessions}
        currentSession={currentSession}
        selectedChatId={selectedChatId}
        onSessionSelect={handleSessionSelect}
        onNewSession={createNewSession}
        onDeleteSession={handleDeleteSession}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader
          onNewSession={createNewSession}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
          rightPanelOpen={rightPanelOpen}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex justify-center items-stretch">
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
              <ChatCanvas session={currentSession} client={client} composerRef={composerRef} />
            </div>
          </div>

          {rightPanelOpen && <RightPanel session={currentSession} />}
        </div>
      </div>
    </div>
  )
}
