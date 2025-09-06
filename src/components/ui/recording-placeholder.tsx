'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface RecordingPlaceholderProps {
  status: 'recording' | 'processing' | 'transcribing' | 'analyzing' | 'saving' | 'completed'
  recordingTime?: number
  className?: string
}

export function RecordingPlaceholder({ status, recordingTime = 0, className }: RecordingPlaceholderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusInfo = () => {
    switch (status) {
      case 'recording':
        return {
          title: 'RECORDING IN PROGRESS',
          subtitle: `Recording: ${formatTime(recordingTime)}`,
          icon: '🎙️',
          color: 'bg-red-50 border-red-300 text-red-800',
          spinner: false,
          pulse: true
        }
      case 'processing':
        return {
          title: 'PROCESSING AUDIO',
          subtitle: 'Preparing for AI analysis...',
          icon: '⚙️',
          color: 'bg-yellow-50 border-yellow-300 text-yellow-800',
          spinner: true,
          pulse: false
        }
      case 'transcribing':
        return {
          title: 'AI TRANSCRIPTION',
          subtitle: 'Gemini 2.5 Flash is transcribing audio...',
          icon: '📝',
          color: 'bg-blue-50 border-blue-300 text-blue-800',
          spinner: true,
          pulse: false
        }
      case 'analyzing':
        return {
          title: 'AI ANALYSIS',
          subtitle: 'Gemini 2.5 Flash analyzing content and mood...',
          icon: '🧠',
          color: 'bg-purple-50 border-purple-300 text-purple-800',
          spinner: true,
          pulse: false
        }
      case 'saving':
        return {
          title: 'SAVING TO DATABASE',
          subtitle: 'Storing results in Supabase...',
          icon: '💾',
          color: 'bg-green-50 border-green-300 text-green-800',
          spinner: true,
          pulse: false
        }
      case 'completed':
        return {
          title: 'COMPLETED',
          subtitle: 'Voice note processed successfully!',
          icon: '✅',
          color: 'bg-green-50 border-green-300 text-green-800',
          spinner: false,
          pulse: false
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className={cn(
      "border p-6 font-mono",
      statusInfo.color,
      statusInfo.pulse && "animate-pulse",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{statusInfo.icon}</span>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide">
              {statusInfo.title}
            </h3>
            <p className="text-xs mt-1">
              {statusInfo.subtitle}
            </p>
          </div>
        </div>
        
        {statusInfo.spinner && (
          <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      
      {status === 'recording' && (
        <div className="text-xs text-gray-600">
          Click the floating button again to stop recording
        </div>
      )}
      
      {status !== 'recording' && status !== 'completed' && (
        <div className="text-xs text-gray-600">
          Please wait while we process your voice note...
        </div>
      )}
    </div>
  )
}
