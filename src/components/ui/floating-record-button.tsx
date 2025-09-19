'use client'

import React, { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { recordingStore } from '@/lib/recording-store'

interface FloatingRecordButtonProps {
  onRecordingComplete: (audioBlob: Blob) => void
  className?: string
}

export function FloatingRecordButton({ onRecordingComplete, className }: FloatingRecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
        console.log('🔓 Screen wake lock activated')
      }
    } catch (error) {
      console.warn('⚠️ Wake lock not supported or failed:', error)
    }
  }

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release()
      wakeLockRef.current = null
      console.log('🔒 Screen wake lock released')
    }
  }

  const startRecording = useCallback(async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      })
      
      streamRef.current = stream
      
      // Request wake lock to keep screen on
      await requestWakeLock()
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      const chunks: BlobPart[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm;codecs=opus' })
        console.log('🎙️ Recording stopped, blob size:', audioBlob.size)
        
        // Release wake lock first
        await releaseWakeLock()
        
        // Reset recording state
        setIsRecording(false)
        setRecordingTime(0)
        
        // Call the completion handler
        onRecordingComplete(audioBlob)
      }
      
      // Start recording
      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setRecordingTime(0)
      
      // Update global recording store
      const tempId = recordingStore.startRecording()
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          recordingStore.updateRecordingTime(newTime)
          return newTime
        })
      }, 1000)
      
    } catch (error) {
      console.error('❌ Error starting recording:', error)
      alert('Nie można uzyskać dostępu do mikrofonu. Sprawdź uprawnienia w przeglądarce.')
    }
  }, [onRecordingComplete])

  const stopRecording = useCallback(async () => {
    console.log('🛑 Stopping recording...')
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log('📹 MediaRecorder stopping...')
      mediaRecorderRef.current.stop()
    }
    
    // Stop all tracks
    if (streamRef.current) {
      console.log('🎤 Stopping microphone stream...')
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    // Clear timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopRecording()
    }
  }, [stopRecording])

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Recording time indicator */}
      {isRecording && (
        <div className="absolute -top-16 right-0 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-mono animate-pulse">
          🔴 {formatTime(recordingTime)}
        </div>
      )}
      
      {/* Main button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log('🔘 Button clicked, isRecording:', isRecording, 'isProcessing:', isProcessing)
          if (isRecording) {
            stopRecording()
          } else if (!isProcessing) {
            startRecording()
          }
        }}
        disabled={isProcessing}
        className={cn(
          "relative w-16 h-16 rounded-full border-4 transition-all duration-300 shadow-lg",
          "flex items-center justify-center font-mono text-sm font-bold",
          "hover:scale-110 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            // Recording state
            "bg-red-600 border-red-700 text-white animate-pulse shadow-red-300": isRecording,
            // Processing state
            "bg-yellow-500 border-yellow-600 text-white": isProcessing,
            // Default state
            "bg-white border-gray-300 text-black hover:bg-gray-50": !isRecording && !isProcessing,
          }
        )}
      >
        {isProcessing ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isRecording ? (
          <div className="w-4 h-4 bg-white rounded-sm" />
        ) : (
          <div className="w-6 h-6 bg-red-500 rounded-full" />
        )}
      </button>
      
      {/* Recording animation ring */}
      {isRecording && (
        <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping pointer-events-none" />
      )}
    </div>
  )
}
