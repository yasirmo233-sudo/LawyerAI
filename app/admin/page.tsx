"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SettingsDialog } from "@/components/app/settings-dialog"
import { Shield, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Check if admin is enabled via environment variable
const isAdminEnabled = process.env.NEXT_PUBLIC_ENABLE_ADMIN === "true"
const adminPassHash = process.env.NEXT_PUBLIC_ADMIN_PASSHASH

export default function AdminPage() {
  const [passphrase, setPassphrase] = useState("")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { toast } = useToast()

  // Check if already unlocked on mount
  useEffect(() => {
    const unlocked = localStorage.getItem("adminUnlocked")
    if (unlocked === "true") {
      setIsUnlocked(true)
    }
  }, [])

  // If admin is not enabled, return 404
  if (!isAdminEnabled) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-muted-foreground mt-2">Page not found</p>
        </div>
      </div>
    )
  }

  const handleUnlock = async () => {
    if (!passphrase.trim()) {
      toast({
        title: "Error",
        description: "Please enter a passphrase",
        variant: "destructive",
      })
      return
    }

    try {
      // Hash the entered passphrase using SHA-256
      const encoder = new TextEncoder()
      const data = encoder.encode(passphrase)
      const hashBuffer = await crypto.subtle.digest("SHA-256", data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

      if (hashHex === adminPassHash) {
        localStorage.setItem("adminUnlocked", "true")
        setIsUnlocked(true)
        toast({
          title: "Success",
          description: "Admin access granted",
        })
      } else {
        toast({
          title: "Error",
          description: "Invalid passphrase",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify passphrase",
        variant: "destructive",
      })
    }

    setPassphrase("")
  }

  const handleLock = () => {
    localStorage.removeItem("adminUnlocked")
    setIsUnlocked(false)
    setSettingsOpen(false)
  }

  if (!isUnlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter the admin passphrase to access Psalm settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passphrase">Passphrase</Label>
              <Input
                id="passphrase"
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                placeholder="Enter admin passphrase"
                autoFocus
              />
            </div>
            <Button onClick={handleUnlock} className="w-full">
              Unlock Admin Panel
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Psalm Admin</CardTitle>
          <CardDescription>Configure backend settings and system capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setSettingsOpen(true)} className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Open Settings
          </Button>
          <Button onClick={handleLock} variant="outline" className="w-full bg-transparent">
            Lock Admin Panel
          </Button>
        </CardContent>
      </Card>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}
