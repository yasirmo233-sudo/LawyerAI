"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { MessageBubble } from "@/components/app/message-bubble"
import { Composer, type ComposerRef } from "@/components/app/composer"
import { EmptyState } from "@/components/app/empty-state"
import { useChatActions } from "@/lib/store/useChatStore"
import { Square } from "lucide-react"
import type { ChatSession, Message, UploadRef } from "@/types/chat"
import type { LawyerAIClient } from "@/lib/client"

interface ChatCanvasProps {
  session: ChatSession | null
  client: LawyerAIClient | null
  composerRef?: React.RefObject<ComposerRef>
}

export function ChatCanvas({ session, client, composerRef }: ChatCanvasProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { addMessage, updateSession } = useChatActions()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [session?.messages])

  const handleStopGeneration = () => {
    if (client && isStreaming) {
      client.abort()
      setIsStreaming(false)
      setStreamingMessageId(null)

      // Update the streaming message to indicate it was stopped
      if (session && streamingMessageId) {
        updateSession(session.id, {
          messages: session.messages.map((msg) =>
            msg.id === streamingMessageId
              ? { ...msg, isStreaming: false, content: msg.content + "\n\n[Generation stopped]" }
              : msg,
          ),
        })
      }
    }
  }

  const handleSendMessage = async (content: string, attachments: UploadRef[] = []) => {
    if (!client || !session) return

    const currentMessages = [...session.messages]

    // Add user message
    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 15),
      role: "user",
      content,
      timestamp: new Date(),
    }
    addMessage(session.id, userMessage)

    // Add assistant message placeholder
    const assistantMessageId = Math.random().toString(36).substring(2, 15)
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    }
    addMessage(session.id, assistantMessage)

    setIsStreaming(true)
    setStreamingMessageId(assistantMessageId)

    try {
      const stream = await client.sendChat({
        messages: [...currentMessages, userMessage],
        jurisdiction: session.jurisdiction,
        attachments,
      })

      const reader = stream.getReader()
      let fullContent = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        fullContent += value

        updateSession(session.id, {
          messages: session.messages.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: fullContent, isStreaming: true } : msg,
          ),
        })
      }

      updateSession(session.id, {
        messages: session.messages.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, content: fullContent, isStreaming: false } : msg,
        ),
      })
    } catch (error) {
      console.error("Chat error:", error)

      const errorMessage =
        error.name === "AbortError"
          ? "Generation stopped by user."
          : "Sorry, I encountered an error. Please check your connection and try again."

      updateSession(session.id, {
        messages: session.messages.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: errorMessage,
                isStreaming: false,
              }
            : msg,
        ),
      })
    } finally {
      setIsStreaming(false)
      setStreamingMessageId(null)
    }
  }

  const handleRegenerate = async (messageId: string) => {
    if (!client || !session) return

    const messageIndex = session.messages.findIndex((msg) => msg.id === messageId)
    if (messageIndex === -1) return

    // Get messages up to the one being regenerated (excluding it)
    const messagesUpToRegenerate = session.messages.slice(0, messageIndex)

    // Mark the message as streaming
    updateSession(session.id, {
      messages: session.messages.map((msg) =>
        msg.id === messageId ? { ...msg, content: "", isStreaming: true } : msg,
      ),
    })

    setIsStreaming(true)
    setStreamingMessageId(messageId)

    try {
      const stream = await client.sendChat({
        messages: messagesUpToRegenerate,
        jurisdiction: session.jurisdiction,
      })

      const reader = stream.getReader()
      let fullContent = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        fullContent += value

        updateSession(session.id, {
          messages: session.messages.map((msg) =>
            msg.id === messageId ? { ...msg, content: fullContent, isStreaming: true } : msg,
          ),
        })
      }

      updateSession(session.id, {
        messages: session.messages.map((msg) =>
          msg.id === messageId ? { ...msg, content: fullContent, isStreaming: false } : msg,
        ),
      })
    } catch (error) {
      console.error("Regenerate error:", error)

      const errorMessage =
        error.name === "AbortError"
          ? "Regeneration stopped by user."
          : "Sorry, I encountered an error while regenerating. Please try again."

      updateSession(session.id, {
        messages: session.messages.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: errorMessage,
                isStreaming: false,
              }
            : msg,
        ),
      })
    } finally {
      setIsStreaming(false)
      setStreamingMessageId(null)
    }
  }

  const handleFileUpload = async (file: File): Promise<UploadRef> => {
    if (!client) throw new Error("Client not available")
    return await client.uploadFile(file)
  }

  const handleTranscribe = async (blob: Blob): Promise<string> => {
    if (!client) throw new Error("Client not available")
    return await client.transcribeAudio(blob)
  }

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <EmptyState onNewSession={() => {}} />
      </div>
    )
  }

  if (session.messages.filter((m) => m.role !== "system").length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            onNewSession={() => {}}
            jurisdiction={session.jurisdiction === "US" ? "United States" : session.jurisdiction}
          />
        </div>

        <div className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <Composer
              ref={composerRef}
              onSendMessage={handleSendMessage}
              onFileUpload={handleFileUpload}
              onTranscribe={handleTranscribe}
              sessionId={session.id}
              disabled={isStreaming}
              prefillContent={session.prefillContent}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-background" role="main" aria-label="Chat conversation">
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8" role="log" aria-live="polite" aria-label="Chat messages">
          {session.messages
            .filter((message) => message.role !== "system")
            .map((message) => (
              <div key={message.id} className="group">
                <MessageBubble message={message} sessionId={session.id} onRegenerate={handleRegenerate} />
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {isStreaming && (
            <div className="flex justify-center mb-4">
              <Button variant="outline" size="sm" onClick={handleStopGeneration} className="gap-2 bg-transparent">
                <Square className="h-3 w-3" />
                Stop generating
              </Button>
            </div>
          )}

          <Composer
            ref={composerRef}
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            onTranscribe={handleTranscribe}
            sessionId={session.id}
            disabled={isStreaming}
            prefillContent={session.prefillContent}
          />
        </div>
      </div>
    </main>
  )
}
