import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    capabilities: ["chat", "files", "voice"],
    version: "1.0.0",
  })
}
