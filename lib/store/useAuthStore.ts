import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  name?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, name?: string) => Promise<boolean>
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Mock authentication - replace with real API
        if (email && password.length >= 6) {
          const user = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: email.split("@")[0],
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      register: async (email: string, password: string, name?: string) => {
        // Mock registration - replace with real API
        if (email && password.length >= 6) {
          const user = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: name || email.split("@")[0],
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
    }),
    {
      name: "psalm-auth",
    },
  ),
)
