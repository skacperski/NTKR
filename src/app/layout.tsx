import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { VoiceRecorder } from '@/components/ui/voice-recorder'

export const metadata: Metadata = {
  title: 'Voice Notes - AI Powered',
  description: 'Record voice notes with Apple Shortcuts and get AI-powered transcription and analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {children}
        <VoiceRecorder />
      </body>
    </html>
  )
}
