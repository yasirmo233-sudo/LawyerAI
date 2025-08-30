import { create } from "zustand"
import { persist } from "zustand/middleware"
import { shallow } from "zustand/shallow"
import type { ChatSession, Message } from "@/types/chat"

interface ChatStore {
  // State
  sessions: ChatSession[]
  currentSessionId: string | null

  // Actions
  createChat: (preset?: { system?: string; prefill?: string; jurisdiction?: string }) => string
  deleteChat: (id: string) => void
  renameChat: (id: string, title: string) => void
  addMessage: (id: string, message: Message) => void
  clearMessages: (id: string) => void
  setJurisdiction: (id: string, code: string) => void
  setCurrentSession: (id: string | null) => void
  deleteMessage: (sessionId: string, messageId: string) => void
  editMessage: (sessionId: string, messageId: string, newContent: string) => void
  regenerateMessage: (sessionId: string, messageId: string) => void
  clearAllChats: () => void

  // Internal helpers
  updateSession: (id: string, updates: Partial<ChatSession>) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sessions: [],
      currentSessionId: null,

      // Create a new chat session
      createChat: (preset) => {
        const state = get()

        // If no preset is provided, check if there's already an empty chat
        if (!preset) {
          const existingEmptyChat = state.sessions.find(
            (session) =>
              session.messages.length === 0 || (session.messages.length === 1 && session.messages[0].role === "system"),
          )

          if (existingEmptyChat) {
            // Return existing empty chat ID instead of creating new one
            return existingEmptyChat.id
          }
        }

        const id = Math.random().toString(36).substring(2, 15)
        const now = new Date()

        const newSession: ChatSession = {
          id,
          title: "New Chat",
          messages: [],
          createdAt: now,
          updatedAt: now,
          jurisdiction: preset?.jurisdiction,
          systemPrompt: preset?.system,
          prefillContent: preset?.prefill,
        }

        // Add system message if preset has one
        if (preset?.system) {
          const systemMessage: Message = {
            id: Math.random().toString(36).substring(2, 15),
            role: "system",
            content: preset.system,
            timestamp: now,
          }
          newSession.messages = [systemMessage]
        }

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: id,
        }))

        return id
      },

      // Delete a chat session
      deleteChat: (id) => {
        set((state) => {
          const newSessions = state.sessions.filter((s) => s.id !== id)
          const newCurrentId = state.currentSessionId === id ? null : state.currentSessionId

          return {
            sessions: newSessions,
            currentSessionId: newCurrentId,
          }
        })
      },

      // Rename a chat session
      renameChat: (id, title) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? { ...session, title, updatedAt: new Date() } : session,
          ),
        }))
      },

      // Add a message to a session
      addMessage: (id, message) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id
              ? {
                  ...session,
                  messages: [...session.messages, message],
                  updatedAt: new Date(),
                  title:
                    session.messages.filter((m) => m.role !== "system").length === 0 && message.role === "user"
                      ? message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "")
                      : session.title,
                }
              : session,
          ),
        }))
      },

      // Clear all messages from a session
      clearMessages: (id) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? { ...session, messages: [], updatedAt: new Date() } : session,
          ),
        }))
      },

      // Set jurisdiction for a session
      setJurisdiction: (id, code) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? { ...session, jurisdiction: code, updatedAt: new Date() } : session,
          ),
        }))
      },

      // Set current active session
      setCurrentSession: (id) => {
        set({ currentSessionId: id })
      },

      // Update session with partial data
      updateSession: (id, updates) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? { ...session, ...updates, updatedAt: new Date() } : session,
          ),
        }))
      },

      // Delete a message from a session
      deleteMessage: (sessionId, messageId) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: session.messages.filter((msg) => msg.id !== messageId),
                  updatedAt: new Date(),
                }
              : session,
          ),
        }))
      },

      // Edit a message in a session
      editMessage: (sessionId, messageId, newContent) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: session.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, content: newContent, timestamp: new Date() } : msg,
                  ),
                  updatedAt: new Date(),
                }
              : session,
          ),
        }))
      },

      // Regenerate a message in a session
      regenerateMessage: (sessionId, messageId) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: session.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, isStreaming: true, content: "" } : msg,
                  ),
                  updatedAt: new Date(),
                }
              : session,
          ),
        }))
      },

      clearAllChats: () => {
        set({
          sessions: [],
          currentSessionId: null,
        })
      },
    }),
    {
      name: "psalm_chats_v1",
      // Custom serialization to handle Date objects
      serialize: (state) => {
        return JSON.stringify(state)
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str)
        // Convert date strings back to Date objects
        if (parsed.state?.sessions) {
          parsed.state.sessions = parsed.state.sessions.map((session: any) => ({
            ...session,
            createdAt: new Date(session.createdAt),
            updatedAt: new Date(session.updatedAt),
            messages:
              session.messages?.map((message: any) => ({
                ...message,
                timestamp: new Date(message.timestamp),
              })) || [],
          }))
        }
        return parsed
      },
    },
  ),
)

// Selector hooks for better performance
export const useCurrentSession = () =>
  useChatStore((state) => {
    if (!state.currentSessionId) return null
    return state.sessions.find((s) => s.id === state.currentSessionId) || null
  }, shallow)

export const useSessions = () => useChatStore((state) => state.sessions, shallow)

// Access actions directly from the store for stable references
export const useChatActions = () => {
  const store = useChatStore.getState()
  return {
    createChat: store.createChat,
    deleteChat: store.deleteChat,
    renameChat: store.renameChat,
    addMessage: store.addMessage,
    clearMessages: store.clearMessages,
    setJurisdiction: store.setJurisdiction,
    setCurrentSession: store.setCurrentSession,
    updateSession: store.updateSession,
    deleteMessage: store.deleteMessage,
    editMessage: store.editMessage,
    regenerateMessage: store.regenerateMessage,
    clearAllChats: store.clearAllChats,
  }
}
