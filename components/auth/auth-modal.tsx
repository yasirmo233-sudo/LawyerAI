"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"

interface AuthModalProps {
  onClose: () => void
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login")

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            {mode === "login" ? "Sign in to Psalm" : "Create your account"}
          </h2>

          {mode === "login" ? (
            <LoginForm onSuccess={onClose} onToggleMode={() => setMode("register")} />
          ) : (
            <RegisterForm onSuccess={onClose} onToggleMode={() => setMode("login")} />
          )}

          <div className="flex justify-center mt-4">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
