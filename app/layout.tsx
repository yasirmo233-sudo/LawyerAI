import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Psalm - AI Legal Assistant Tuned to Your Jurisdiction",
  description: "Research, drafting, and compliance answers adapted to your country or state. Not legal advice.",
  generator: "v0.app",
  keywords: [
    "AI legal assistant",
    "jurisdiction-aware",
    "legal research",
    "contract drafting",
    "compliance",
    "legal tech",
  ],
  authors: [{ name: "Psalm" }],
  openGraph: {
    title: "Psalm - AI Legal Assistant Tuned to Your Jurisdiction",
    description: "Research, drafting, and compliance answers adapted to your country or state. Not legal advice.",
    type: "website",
    locale: "en_US",
    url: "https://psalm.com",
    siteName: "Psalm",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Psalm - AI Legal Assistant Tuned to Your Jurisdiction",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Psalm - AI Legal Assistant Tuned to Your Jurisdiction",
    description: "Research, drafting, and compliance answers adapted to your country or state. Not legal advice.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
