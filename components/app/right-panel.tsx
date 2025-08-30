"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, Lightbulb, BookOpen, X, File, ImageIcon } from "lucide-react"
import type { ChatSession } from "@/types/chat"
import { useChatActions } from "@/lib/store/useChatStore"

interface RightPanelProps {
  session: ChatSession | null
}

export function RightPanel({ session }: RightPanelProps) {
  const { updateSession } = useChatActions()

  const tips = [
    "Be specific about jurisdiction and legal context",
    "Ask for citations and sources when needed",
    "Request step-by-step analysis for complex issues",
    "Upload documents for detailed review",
  ]

  const getFileIcon = (mime: string) => {
    if (mime.startsWith("image/")) return ImageIcon
    if (mime.includes("pdf") || mime.includes("document")) return FileText
    return File
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    if (!session) return

    const updatedAttachments = session.attachments?.filter((att) => att.id !== attachmentId) || []
    updateSession(session.id, { attachments: updatedAttachments })
  }

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-sm font-semibold">Context & References</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Uploaded Documents */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <CardTitle className="text-sm">Documents</CardTitle>
                {session?.attachments && session.attachments.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {session.attachments.length}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {session?.attachments && session.attachments.length > 0 ? (
                <div className="space-y-2">
                  {session.attachments.map((attachment) => {
                    const IconComponent = getFileIcon(attachment.mime)
                    return (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-2 rounded-lg border bg-background"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <IconComponent className="h-4 w-4 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">{(attachment.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleRemoveAttachment(attachment.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <CardDescription className="text-xs">
                  No documents uploaded yet. Upload PDFs, Word docs, or text files for analysis.
                </CardDescription>
              )}
            </CardContent>
          </Card>

          {/* Citations */}
          {session && session.messages.some((m) => m.citations?.length) && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <CardTitle className="text-sm">Citations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {session.messages
                  .flatMap((m) => m.citations || [])
                  .map((citation) => (
                    <Badge key={citation.id} variant="outline" className="text-xs">
                      {citation.title}
                    </Badge>
                  ))}
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Tips */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <CardTitle className="text-sm">Tips</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
