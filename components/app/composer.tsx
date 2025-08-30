"use client"

import type React from "react"
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { VoiceRecorder } from "@/components/voice-recorder"
import { Send, Paperclip } from "lucide-react"
import { useChatActions } from "@/lib/store/useChatStore"
import type { UploadRef } from "@/types/chat"

interface ComposerProps {
  onSendMessage: (content: string, attachments?: UploadRef[]) => void
  onFileUpload: (file: File) => Promise<UploadRef>
  onTranscribe: (blob: Blob) => Promise<string>
  sessionId?: string
  disabled?: boolean
  prefillContent?: string
}

export interface ComposerRef {
  focus: () => void
  sendMessage: () => void
}

export const Composer = forwardRef<ComposerRef, ComposerProps>(
  ({ onSendMessage, onFileUpload, onTranscribe, sessionId, disabled, prefillContent }, ref) => {
    const [message, setMessage] = useState("")
    const [showFileUpload, setShowFileUpload] = useState(false)
    const [attachments, setAttachments] = useState<UploadRef[]>([])
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { updateSession } = useChatActions()

    const maxChars = 4000

    useEffect(() => {
      if (prefillContent && prefillContent.trim()) {
        console.log("[v0] Setting prefill content:", prefillContent)
        setMessage(prefillContent)

        // Focus the textarea and position cursor at end
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus()
            const length = textareaRef.current.value.length
            textareaRef.current.setSelectionRange(length, length)
          }
        }, 100)
      }
    }, [prefillContent, sessionId, updateSession])

    useEffect(() => {
      if (sessionId && !prefillContent && !message) {
        console.log("[v0] Resetting message for session:", sessionId)
        setMessage("")
        setAttachments([])
      }
    }, [sessionId, prefillContent, message])

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus()
      },
      sendMessage: () => {
        if (message.trim() && !disabled) {
          handleSubmit(new Event("submit") as any)
        }
      },
    }))

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (message.trim() && !disabled) {
        onSendMessage(message.trim(), attachments)
        setMessage("")
        setAttachments([])
        textareaRef.current?.focus()
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e)
      }
    }

    const handleFileUploadComplete = async (file: File): Promise<UploadRef> => {
      const uploadRef = await onFileUpload(file)
      setAttachments((prev) => [...prev, uploadRef])
      return uploadRef
    }

    const handleRemoveAttachment = (id: string) => {
      setAttachments((prev) => prev.filter((att) => att.id !== id))
    }

    const handleTranscription = (text: string) => {
      setMessage((prev) => (prev ? prev + " " + text : text))
      textareaRef.current?.focus()
    }

    return (
      <div className="space-y-3">
        {/* File Upload Area */}
        {showFileUpload && (
          <FileUpload
            onFileUpload={handleFileUploadComplete}
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachment}
            disabled={disabled}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative rounded-xl border border-border/40 bg-background shadow-sm focus-within:border-primary/40 focus-within:shadow-md transition-all">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about legal matters..."
              className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent px-4 py-3 pr-20 focus-visible:ring-0 placeholder:text-muted-foreground/60"
              disabled={disabled}
              maxLength={maxChars}
              aria-label="Message input"
            />

            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setShowFileUpload(!showFileUpload)}
                disabled={disabled}
                aria-label="Toggle file upload"
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              <VoiceRecorder onTranscription={handleTranscription} onTranscribe={onTranscribe} disabled={disabled} />

              <Button
                type="submit"
                disabled={!message.trim() || disabled}
                size="sm"
                className="h-8 px-3"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {!disabled && (
            <div className="text-xs text-muted-foreground text-center px-4 py-2">
              <strong>Reminder:</strong> Psalm provides information and assistance but does not constitute legal advice.
              Always consult with qualified legal professionals for specific legal matters.
            </div>
          )}
        </form>
      </div>
    )
  },
)

Composer.displayName = "Composer"
