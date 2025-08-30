"use client"

import { useEffect } from "react"

interface KeyboardShortcutsProps {
  onFocusComposer?: () => void
  onNewChat?: () => void
  onSendMessage?: () => void
  onToggleSettings?: () => void
  onDeleteChat?: () => void
}

export function useKeyboardShortcuts({
  onFocusComposer,
  onNewChat,
  onSendMessage,
  onToggleSettings,
  onDeleteChat,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        // Allow Cmd/Ctrl+Enter to send message from textarea
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && onSendMessage) {
          event.preventDefault()
          onSendMessage()
          return
        }
        return
      }

      // Focus composer with "/"
      if (event.key === "/" && onFocusComposer) {
        event.preventDefault()
        onFocusComposer()
        return
      }

      // New chat with Cmd/Ctrl+K
      if ((event.metaKey || event.ctrlKey) && event.key === "k" && onNewChat) {
        event.preventDefault()
        onNewChat()
        return
      }

      // Delete chat with Delete key
      if (event.key === "Delete" && onDeleteChat) {
        event.preventDefault()
        onDeleteChat()
        return
      }

      // Toggle settings with Cmd/Ctrl+,
      if ((event.metaKey || event.ctrlKey) && event.key === "," && onToggleSettings) {
        event.preventDefault()
        onToggleSettings()
        return
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onFocusComposer, onNewChat, onSendMessage, onToggleSettings, onDeleteChat])
}
