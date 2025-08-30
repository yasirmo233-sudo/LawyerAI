import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, model = "gpt-4", temperature = 0.7, max_tokens = 2000, stream = true } = body

    // Mock streaming response for development
    if (stream) {
      const encoder = new TextEncoder()

      const mockResponse = `I'm a mock AI legal assistant. This is a demonstration response that would normally come from your configured AI provider.

For production use, you'll need to:
1. Set up your API endpoint in Admin Settings
2. Configure your AI provider (OpenAI, Anthropic, etc.)
3. Add proper authentication

This mock response is streaming character by character to demonstrate the real-time functionality.`

      const stream = new ReadableStream({
        start(controller) {
          let index = 0
          const interval = setInterval(() => {
            if (index < mockResponse.length) {
              const chunk = {
                id: "mock-" + Date.now(),
                object: "chat.completion.chunk",
                created: Date.now(),
                model,
                choices: [
                  {
                    index: 0,
                    delta: {
                      content: mockResponse[index],
                    },
                    finish_reason: null,
                  },
                ],
              }

              controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
              index++
            } else {
              const finalChunk = {
                id: "mock-" + Date.now(),
                object: "chat.completion.chunk",
                created: Date.now(),
                model,
                choices: [
                  {
                    index: 0,
                    delta: {},
                    finish_reason: "stop",
                  },
                ],
              }

              controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`))
              controller.enqueue(encoder.encode("data: [DONE]\n\n"))
              controller.close()
              clearInterval(interval)
            }
          }, 30)
        },
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      })
    }

    // Non-streaming response
    return NextResponse.json({
      id: "mock-" + Date.now(),
      object: "chat.completion",
      created: Date.now(),
      model,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "This is a mock response. Please configure your AI provider in Admin Settings.",
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
