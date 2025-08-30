"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VoiceRecorderProps {
  onTranscription: (text: string) => void
  onTranscribe: (blob: Blob) => Promise<string>
  disabled?: boolean
}

export function VoiceRecorder({ onTranscription, onTranscribe, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<number | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    return () => {
      stopRecording()
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const updateAudioLevel = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
    setAudioLevel(average / 255) // Normalize to 0-1

    if (isRecording) {
      animationRef.current = requestAnimationFrame(updateAudioLevel)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      streamRef.current = stream

      // Set up audio analysis for visual feedback
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      source.connect(analyserRef.current)

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm;codecs=opus" })
        await handleTranscription(blob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)

      // Start audio level animation
      updateAudioLevel()

      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone",
      })
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    setIsRecording(false)
    setAudioLevel(0)
  }

  const handleTranscription = async (blob: Blob) => {
    setIsTranscribing(true)

    try {
      const text = await onTranscribe(blob)
      if (text.trim()) {
        onTranscription(text.trim())
        toast({
          title: "Transcription Complete",
          description: "Voice converted to text",
        })
      } else {
        toast({
          title: "No Speech Detected",
          description: "Please try recording again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Transcription Failed",
        description: error instanceof Error ? error.message : "Could not transcribe audio",
        variant: "destructive",
      })
    } finally {
      setIsTranscribing(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (isTranscribing) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        Transcribing...
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {isRecording ? (
        <>
          <Button variant="destructive" size="sm" onClick={stopRecording} className="h-8 w-8 p-0" disabled={disabled}>
            <Square className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
              style={{
                opacity: 0.5 + audioLevel * 0.5,
                transform: `scale(${1 + audioLevel * 0.5})`,
              }}
            />
            <span className="font-mono">{formatDuration(duration)}</span>
          </div>
        </>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={startRecording}
          className="h-8 w-8 p-0 hover:bg-secondary hover:text-secondary-foreground transition-colors"
          disabled={disabled}
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
