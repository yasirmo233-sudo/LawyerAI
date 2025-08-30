"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Trash2, User, Bell, Shield, Download, Upload, X } from "lucide-react"
import { useAuth } from "@/lib/store/useAuthStore"
import { useChatActions } from "@/lib/store/useChatStore"
import { useToast } from "@/hooks/use-toast"

interface SettingsModalProps {
  onClose: () => void
}

function DeleteConfirmationModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-semibold mb-2">Clear your chat history - are you sure?</h3>
        <p className="text-sm text-muted-foreground mb-6">
          This will permanently delete all your conversations. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm deletion
          </Button>
        </div>
      </div>
    </div>
  )
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { user } = useAuth()
  const { clearAllChats } = useChatActions()
  const { toast } = useToast()

  const [displayName, setDisplayName] = useState(user?.name || "")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    darkMode: false,
    compactMode: false,
  })

  const handleDeleteAllChats = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDeleteAllChats = () => {
    clearAllChats()
    setShowDeleteConfirm(false)
    toast({
      title: "All chats deleted",
      description: "Your chat history has been cleared.",
    })
  }

  const cancelDeleteAllChats = () => {
    setShowDeleteConfirm(false)
  }

  const handleExportData = () => {
    // Mock export functionality
    toast({
      title: "Export started",
      description: "Your data export will be ready shortly.",
    })
  }

  const handleImportData = () => {
    // Mock import functionality
    toast({
      title: "Import feature",
      description: "Data import functionality coming soon.",
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Settings</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Account Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <h3 className="text-lg font-medium">Account</h3>
              </div>

              <div className="space-y-3 pl-7">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email || ""} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Preferences Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h3 className="text-lg font-medium">Preferences</h3>
              </div>

              <div className="space-y-4 pl-7">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about updates and features</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, notifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save chats</Label>
                    <p className="text-sm text-muted-foreground">Automatically save your conversations</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoSave: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact mode</Label>
                    <p className="text-sm text-muted-foreground">Use a more compact interface layout</p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, compactMode: checked }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Data & Privacy Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <h3 className="text-lg font-medium">Data & Privacy</h3>
              </div>

              <div className="space-y-3 pl-7">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Export data</Label>
                    <p className="text-sm text-muted-foreground">Download a copy of your chat history and settings</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Import data</Label>
                    <p className="text-sm text-muted-foreground">Import chat history from a backup file</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleImportData}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>

                <div className="border border-destructive/20 rounded-lg p-4 bg-destructive/5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <Label className="text-destructive">Delete all chats</Label>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete all your chat history. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleDeleteAllChats}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onClose}>Save Changes</Button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmationModal onConfirm={confirmDeleteAllChats} onCancel={cancelDeleteAllChats} />
      )}
    </>
  )
}
