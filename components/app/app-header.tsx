"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SettingsDialog } from "@/components/app/settings-dialog"
import { JurisdictionSelect } from "@/components/jurisdiction-select"
import { UserMenu } from "@/components/app/user-menu"
import { AuthModal } from "@/components/auth/auth-modal"
import { Menu, Plus, PanelRight } from "lucide-react"
import { useLocalSettings } from "@/hooks/use-local-settings"
import { useChatActions, useCurrentSession } from "@/lib/store/useChatStore"
import { useAuth } from "@/lib/store/useAuthStore"
import { useState } from "react"

interface AppHeaderProps {
  onNewSession: () => void
  onToggleSidebar: () => void
  onToggleRightPanel: () => void
  rightPanelOpen: boolean
}

export function AppHeader({ onNewSession, onToggleSidebar, onToggleRightPanel, rightPanelOpen }: AppHeaderProps) {
  const { isAdminUnlocked } = useLocalSettings()
  const currentSession = useCurrentSession()
  const { setJurisdiction } = useChatActions()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleJurisdictionChange = (jurisdiction: string) => {
    if (currentSession) {
      setJurisdiction(currentSession.id, jurisdiction)
    }
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6" role="banner">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={!rightPanelOpen}
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </Button>

        <Link href="/" className="flex items-center space-x-2 ml-2" aria-label="Psalm home">
          <span className="text-lg font-bold">Psalm</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <JurisdictionSelect
          value={currentSession?.jurisdiction}
          onValueChange={handleJurisdictionChange}
          variant="compact"
        />
      </div>

      <nav className="flex items-center gap-2" role="navigation" aria-label="App navigation">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleRightPanel}
          className={rightPanelOpen ? "bg-muted" : ""}
          aria-label={rightPanelOpen ? "Hide right panel" : "Show right panel"}
          aria-pressed={rightPanelOpen}
        >
          <PanelRight className="h-4 w-4" aria-hidden="true" />
        </Button>

        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)}>
            Sign in
          </Button>
        )}
      </nav>

      {isAdminUnlocked() && <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </header>
  )
}
