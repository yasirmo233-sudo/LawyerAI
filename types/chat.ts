export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  citations?: Citation[]
  isStreaming?: boolean
}

export interface Citation {
  id: string
  title: string
  url?: string
  fileId?: string
  snippet?: string
  excerpt: string
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  jurisdiction?: string
  systemPrompt?: string
  attachments?: UploadRef[]
}

export interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
}

export interface UploadRef {
  id: string
  name: string
  mime: string
  size: number
}

export interface ChatSettings {
  baseUrl: string
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
  timeout: number
  capabilities?: {
    chat: boolean
    files: boolean
    voice: boolean
  }
}

export interface ConnectionStatus {
  connected: boolean
  lastChecked?: Date
  error?: string
}
