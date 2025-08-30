"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useLocalSettings } from "@/hooks/use-local-settings"
import { LawyerAIClient } from "@/lib/client"
import { useToast } from "@/hooks/use-toast"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings, updateSettings, resetSettings } = useLocalSettings()
  const { toast } = useToast()
  const [testing, setTesting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "error">("disconnected")

  const testConnection = async () => {
    if (!settings.baseUrl || !settings.apiKey) {
      toast({ description: "Please provide both Base URL and API Key", variant: "destructive" })
      return
    }

    setTesting(true)
    try {
      const client = new LawyerAIClient(settings)
      const result = await client.health()

      if (result.status === "ok") {
        setConnectionStatus("connected")
        toast({ description: "Connection successful!" })
      } else {
        setConnectionStatus("error")
        toast({ description: result.message || "Connection failed", variant: "destructive" })
      }
    } catch (error) {
      setConnectionStatus("error")
      toast({ description: "Connection test failed", variant: "destructive" })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure your AI backend connection and model parameters.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <Label>Connection Status</Label>
            <Badge
              variant={
                connectionStatus === "connected"
                  ? "default"
                  : connectionStatus === "error"
                    ? "destructive"
                    : "secondary"
              }
            >
              {connectionStatus === "connected"
                ? "Connected"
                : connectionStatus === "error"
                  ? "Error"
                  : "Not Connected"}
            </Badge>
          </div>

          {/* Backend Configuration */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseUrl">Backend Base URL</Label>
              <Input
                id="baseUrl"
                placeholder="https://api.example.com"
                value={settings.baseUrl}
                onChange={(e) => updateSettings({ baseUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={settings.apiKey}
                onChange={(e) => updateSettings({ apiKey: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model Name</Label>
              <Input
                id="model"
                placeholder="gpt-4"
                value={settings.model}
                onChange={(e) => updateSettings({ model: e.target.value })}
              />
            </div>
          </div>

          {/* Model Parameters */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Temperature</Label>
                <span className="text-sm text-muted-foreground">{settings.temperature}</span>
              </div>
              <Slider
                value={[settings.temperature]}
                onValueChange={([value]) => updateSettings({ temperature: value })}
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Max Tokens</Label>
                <span className="text-sm text-muted-foreground">{settings.maxTokens}</span>
              </div>
              <Slider
                value={[settings.maxTokens]}
                onValueChange={([value]) => updateSettings({ maxTokens: value })}
                max={4096}
                min={256}
                step={256}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Timeout (seconds)</Label>
                <span className="text-sm text-muted-foreground">{settings.timeout / 1000}</span>
              </div>
              <Slider
                value={[settings.timeout / 1000]}
                onValueChange={([value]) => updateSettings({ timeout: value * 1000 })}
                max={120}
                min={10}
                step={10}
                className="w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={resetSettings}>
              Reset to Defaults
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={testConnection} disabled={testing}>
                {testing ? "Testing..." : "Test Connection"}
              </Button>
              <Button onClick={() => onOpenChange(false)}>Save</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
