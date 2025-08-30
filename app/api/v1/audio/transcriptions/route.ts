import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Mock transcription - in production, you'd use Whisper API or similar
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate processing time

    return NextResponse.json({
      text: "This is a mock transcription. Please configure your speech-to-text service in Admin Settings to enable real audio transcription.",
    })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 })
  }
}
