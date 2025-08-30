"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, HelpCircle, LogOut, Crown } from "lucide-react"
import { useAuth } from "@/lib/store/useAuthStore"
import { SettingsModal } from "./settings-modal"

export function UserMenu() {
  const { user, logout } = useAuth()
  const [showSettings, setShowSettings] = useState(false)

  if (!user) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 rounded-full hover:bg-accent transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-2">
          <div className="px-2 py-3 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.name || user.email?.split("@")[0] || "User"}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>
          </div>

          <div className="py-1">
            <DropdownMenuItem className="cursor-pointer">
              <Crown className="mr-2 h-4 w-4 text-amber-500" />
              <div className="flex-1">
                <div className="text-sm">Upgrade plan</div>
                <div className="text-xs text-muted-foreground">Get Psalm Plus</div>
              </div>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator />

          <div className="py-1">
            <DropdownMenuItem onClick={() => setShowSettings(true)} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              <div className="flex-1 flex items-center justify-between">
                Help
                <span className="text-xs text-muted-foreground">→</span>
              </div>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator />

          <div className="py-1">
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </div>

          <div className="px-2 py-2 border-t mt-1">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-muted">
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{user.name || user.email?.split("@")[0] || "User"}</div>
                <div className="text-xs text-muted-foreground">Free</div>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}
