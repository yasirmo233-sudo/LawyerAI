import type { Message, ChatSettings, UploadRef } from "@/types/chat"

export interface SendChatOptions {
  messages: Message[]
  stream?: boolean
  jurisdiction?: string
  attachments?: UploadRef[]
}

export interface HealthResponse {
  ok: boolean
  capabilities?: string[]
}

export class LawyerAIClient {
  private settings: ChatSettings
  private abortController?: AbortController

  constructor(settings: ChatSettings) {
    this.settings = settings
  }

  updateSettings(settings: ChatSettings) {
    this.settings = settings
  }

  async health(): Promise<HealthResponse> {
    try {
      // Try /health first, fallback to base URL
      const urls = [`${this.settings.baseUrl}/health`, this.settings.baseUrl]

      for (const url of urls) {
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${this.settings.apiKey}`,
              "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(this.settings.timeout),
          })

          if (response.ok) {
            const data = await response.json().catch(() => ({}))
            return {
              ok: true,
              capabilities: data.capabilities || ["chat"],
            }
          }
        } catch (error) {
          // Try next URL
          continue
        }
      }

      return { ok: false }
    } catch (error) {
      return { ok: false }
    }
  }

  async sendChat({
    messages,
    stream = true,
    jurisdiction,
    attachments = [],
  }: SendChatOptions): Promise<ReadableStream<string>> {
    this.abortController = new AbortController()

    const response = await fetch(`${this.settings.baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.settings.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.settings.model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature: this.settings.temperature,
        max_tokens: this.settings.maxTokens,
        stream,
        jurisdiction,
        attachments,
      }),
      signal: this.abortController.signal,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error("No response body")
    }

    if (!stream) {
      // Non-streaming response
      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || ""
      return new ReadableStream({
        start(controller) {
          controller.enqueue(content)
          controller.close()
        },
      })
    }

    // SSE streaming response with abort support
    const reader = response.body.pipeThrough(new TextDecoderStream()).pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          const lines = chunk.split("\n")
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim()
              if (data === "[DONE]") return
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(content)
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        },
      }),
    )

    return new ReadableStream({
      start(controller) {
        const streamReader = reader.getReader()

        const pump = async () => {
          try {
            while (true) {
              const { done, value } = await streamReader.read()

              if (this.abortController?.signal.aborted) {
                controller.close()
                return
              }

              if (done) {
                controller.close()
                return
              }

              controller.enqueue(value)
            }
          } catch (error) {
            if (error.name === "AbortError") {
              controller.close()
            } else {
              controller.error(error)
            }
          }
        }

        pump()
      },
      cancel() {
        this.abortController?.abort()
      },
    })
  }

  async uploadFile(file: File): Promise<UploadRef> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${this.settings.baseUrl}/v1/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.settings.apiKey}`,
      },
      body: formData,
      signal: AbortSignal.timeout(this.settings.timeout),
    })

    if (!response.ok) {
      throw new Error(`Upload failed: HTTP ${response.status}`)
    }

    const result = await response.json()
    return {
      id: result.id,
      name: result.name || file.name,
      mime: result.mime || file.type,
      size: result.size || file.size,
    }
  }

  async transcribeAudio(blob: Blob): Promise<string> {
    const formData = new FormData()
    formData.append("file", blob, "audio.webm")
    formData.append("model", "whisper-1")

    const response = await fetch(`${this.settings.baseUrl}/v1/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.settings.apiKey}`,
      },
      body: formData,
      signal: AbortSignal.timeout(this.settings.timeout),
    })

    if (!response.ok) {
      throw new Error(`Transcription failed: HTTP ${response.status}`)
    }

    const result = await response.json()
    return result.text || ""
  }

  abort() {
    this.abortController?.abort()
  }

  isStreaming(): boolean {
    return this.abortController && !this.abortController.signal.aborted
  }
}

// Mock client for development/demo purposes
export class MockLawyerAIClient extends LawyerAIClient {
  private currentInterval?: NodeJS.Timeout

  async health(): Promise<HealthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      ok: true,
      capabilities: ["chat", "files", "voice"],
    }
  }

  async sendChat({ messages, jurisdiction }: SendChatOptions): Promise<ReadableStream<string>> {
    const mockResponse =
      "This service is not configured yet. Please set up your backend API endpoint in the Admin Settings to enable AI-powered legal assistance."

    return new ReadableStream({
      start: (controller) => {
        let i = 0
        this.currentInterval = setInterval(() => {
          if (this.abortController?.signal.aborted) {
            controller.close()
            if (this.currentInterval) clearInterval(this.currentInterval)
            return
          }

          if (i < mockResponse.length) {
            controller.enqueue(mockResponse[i])
            i++
          } else {
            controller.close()
            if (this.currentInterval) clearInterval(this.currentInterval)
          }
        }, 30)
      },
      cancel: () => {
        if (this.currentInterval) {
          clearInterval(this.currentInterval)
        }
        this.abortController?.abort()
      },
    })
  }

  async uploadFile(file: File): Promise<UploadRef> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      id: Math.random().toString(36).substring(2, 15),
      name: file.name,
      mime: file.type,
      size: file.size,
    }
  }

  async transcribeAudio(blob: Blob): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return "This service is not configured yet. Please set up your backend API endpoint in Admin Settings to enable speech-to-text."
  }

  abort() {
    if (this.currentInterval) {
      clearInterval(this.currentInterval)
    }
    super.abort()
  }
}
