"use client"

import { useState, useEffect } from "react"
import type { ChatSettings } from "@/types/chat"

const DEFAULT_SETTINGS: ChatSettings = {
  baseUrl: "",
  apiKey: "",
  model: "gpt-4",
  temperature: 0.7,
  maxTokens: 2048,
  timeout: 30000,
  capabilities: {
    chat: true,
    files: false,
    voice: false,
  },
}

const STORAGE_KEY = "psalm_settings_v1"

export function useLocalSettings() {
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const updateSettings = (newSettings: Partial<ChatSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error("Failed to save settings to localStorage:", error)
    }
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error("Failed to remove settings from localStorage:", error)
    }
  }

  const isAdminUnlocked = () => {
    if (typeof window === "undefined") return false
    return localStorage.getItem("adminUnlocked") === "true"
  }

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoaded,
    isAdminUnlocked,
  }
}
