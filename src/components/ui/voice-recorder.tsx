'use client'

import React, { useState } from 'react'
import { FloatingRecordButton } from './floating-record-button'
import { useVoiceRecording } from '@/lib/hooks/use-voice-recording'
import { recordingStore } from '@/lib/recording-store'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

function Toast({ message, type, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed top-6 right-6 z-[60] p-4 border font-mono text-sm max-w-sm animate-in slide-in-from-top duration-300 ${
      type === 'success' 
        ? 'bg-green-50 border-green-300 text-green-800' 
        : 'bg-red-50 border-red-300 text-red-800'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-bold uppercase text-xs mb-1">
            {type === 'success' ? '✅ SUCCESS' : '❌ ERROR'}
          </div>
          <div>{message}</div>
        </div>
        <button 
          onClick={onClose}
          className="ml-3 text-gray-500 hover:text-gray-700 text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export function VoiceRecorder() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  const { uploadRecording, isUploading } = useVoiceRecording({
    onSuccess: () => {
      setToast({
        type: 'success',
        message: 'Nagranie zostało pomyślnie przesłane i przetworzone przez AI!'
      })
      // Refresh the page after successful upload to show new note
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    },
    onError: (error) => {
      setToast({
        type: 'error',
        message: `Błąd podczas przesyłania: ${error}`
      })
    }
  })

  const handleRecordingComplete = async (audioBlob: Blob) => {
    console.log('🎙️ Recording completed, uploading...', {
      size: audioBlob.size,
      type: audioBlob.type
    })
    
    // Update recording store with processing status
    recordingStore.setProcessing()
    
    try {
      // Show different statuses during upload
      recordingStore.setTranscribing()
      
      // Simulate AI processing stages (we'll track real ones later)
      setTimeout(() => recordingStore.setAnalyzing(), 2000)
      setTimeout(() => recordingStore.setSaving(), 8000)
      
      await uploadRecording(audioBlob)
      
      recordingStore.setCompleted()
      
      // Wyślij event żeby odświeżyć listę notatek
      window.dispatchEvent(new CustomEvent('noteAdded'))
      
    } catch (error) {
      recordingStore.reset()
      // Error is already handled by the hook
    }
  }

  return (
    <>
      <FloatingRecordButton 
        onRecordingComplete={handleRecordingComplete}
        className={isUploading ? 'pointer-events-none' : ''}
      />
      
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
