"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, X, FileText, File, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { UploadRef } from "@/types/chat"

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<UploadRef>
  attachments: UploadRef[]
  onRemoveAttachment: (id: string) => void
  disabled?: boolean
}

const ACCEPTED_TYPES = [".pdf", ".docx", ".txt", ".png", ".jpg", ".jpeg"]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function FileUpload({ onFileUpload, attachments, onRemoveAttachment, disabled }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const getFileIcon = (mime: string) => {
    if (mime.startsWith("image/")) return ImageIcon
    if (mime.includes("pdf")) return FileText
    if (mime.includes("word") || mime.includes("document")) return FileText
    return File
  }

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB"
    }

    const extension = "." + file.name.split(".").pop()?.toLowerCase()
    if (!ACCEPTED_TYPES.includes(extension)) {
      return `File type not supported. Accepted types: ${ACCEPTED_TYPES.join(", ")}`
    }

    return null
  }

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files)

      for (const file of fileArray) {
        const error = validateFile(file)
        if (error) {
          toast({
            title: "Upload Error",
            description: error,
            variant: "destructive",
          })
          continue
        }

        const uploadId = Math.random().toString(36).substring(2, 15)
        setUploading((prev) => [...prev, uploadId])

        try {
          await onFileUpload(file)
          toast({
            title: "Upload Complete",
            description: `${file.name} uploaded successfully`,
          })
        } catch (error) {
          toast({
            title: "Upload Failed",
            description: error instanceof Error ? error.message : "Failed to upload file",
            variant: "destructive",
          })
        } finally {
          setUploading((prev) => prev.filter((id) => id !== uploadId))
        }
      }
    },
    [onFileUpload, toast],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (disabled) return

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileUpload(files)
      }
    },
    [disabled, handleFileUpload],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFileUpload(files)
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [handleFileUpload],
  )

  return (
    <div className="space-y-3">
      {/* File attachments display */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => {
            const IconComponent = getFileIcon(attachment.mime)
            return (
              <Badge key={attachment.id} variant="secondary" className="flex items-center gap-2 pr-1">
                <IconComponent className="h-3 w-3" />
                <span className="text-xs truncate max-w-[120px]">{attachment.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => onRemoveAttachment(attachment.id)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}
        </div>
      )}

      {/* Upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-1">
          {uploading.length > 0 ? "Uploading..." : "Drop files here or click to upload"}
        </p>
        <p className="text-xs text-muted-foreground">Supports: PDF, DOCX, TXT, PNG, JPG (max 10MB)</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}
