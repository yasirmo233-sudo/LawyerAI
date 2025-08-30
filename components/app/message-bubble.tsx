"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Copy, RotateCcw, User, Bot, Check, Trash2, Edit3, X, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useChatActions } from "@/lib/store/useChatStore"
import type { Message } from "@/types/chat"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: Message
  sessionId: string
  onRegenerate?: (messageId: string) => void
}

export function MessageBubble({ message, sessionId, onRegenerate }: MessageBubbleProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const { deleteMessage, editMessage } = useChatActions()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      toast({ description: "Message copied to clipboard" })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({ description: "Failed to copy message", variant: "destructive" })
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditContent(message.content)
  }

  const handleSaveEdit = () => {
    if (editContent.trim() !== message.content) {
      editMessage(sessionId, message.id, editContent.trim())
      toast({ description: "Message updated" })
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(message.content)
  }

  const handleDelete = () => {
    deleteMessage(sessionId, message.id)
    toast({ description: "Message deleted" })
  }

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(message.id)
    }
  }

  const isUser = message.role === "user"

  return (
    <div
      className={cn("flex gap-4 w-full", isUser ? "justify-end" : "justify-start")}
      role="article"
      aria-label={`${isUser ? "Your" : "Assistant"} message`}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </div>
        </div>
      )}

      <div className={cn("flex-1 max-w-[85%] space-y-2", isUser && "flex flex-col items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 relative",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted/50 border border-border/40",
          )}
        >
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap">
                {message.content || (message.isStreaming && "...")}
                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" aria-label="Typing indicator" />
                )}
              </div>
            </div>
          )}

          {message.citations && message.citations.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="text-xs font-medium opacity-70">Sources:</div>
              <div className="flex flex-wrap gap-1" role="list" aria-label="Citations">
                {message.citations.map((citation) => (
                  <Badge key={citation.id} variant="secondary" className="text-xs" role="listitem">
                    {citation.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className={cn("flex items-center gap-1 text-xs text-muted-foreground", isUser && "flex-row-reverse")}>
            <time dateTime={message.timestamp.toISOString()}>
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </time>

            <div
              className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
              role="group"
              aria-label="Message actions"
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-muted"
                onClick={copyToClipboard}
                aria-label="Copy message to clipboard"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>

              {isUser && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-muted"
                    onClick={handleEdit}
                    aria-label="Edit message"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-destructive/10 text-destructive"
                    onClick={handleDelete}
                    aria-label="Delete message"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}

              {!isUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-muted"
                  onClick={handleRegenerate}
                  aria-label="Regenerate response"
                  disabled={message.isStreaming}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <User className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  )
}
