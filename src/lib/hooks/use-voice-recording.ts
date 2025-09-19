'use client'

import { useState, useCallback } from 'react'

interface UseVoiceRecordingOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useVoiceRecording({ onSuccess, onError }: UseVoiceRecordingOptions = {}) {
  const [isUploading, setIsUploading] = useState(false)

  const uploadRecording = useCallback(async (audioBlob: Blob) => {
    setIsUploading(true)
    
    try {
      // Get current location (optional)
      let location = 'Unknown'
      try {
        if (navigator.geolocation) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false
            })
          })
          
          // Reverse geocoding would require an API, so we'll use coordinates
          location = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
        }
      } catch (geoError) {
        console.warn('⚠️ Could not get location:', geoError)
      }

      // Prepare form data
      const formData = new FormData()
      formData.append('message', audioBlob, 'recording.webm')
      formData.append('timestamp', new Date().toISOString())
      formData.append('location', location)

      // Upload to API
      const response = await fetch('/api/voice-notes', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      console.log('✅ Recording uploaded successfully:', result)
      
      onSuccess?.()
      
      return result
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Upload error:', errorMessage)
      onError?.(errorMessage)
      throw error
      
    } finally {
      setIsUploading(false)
    }
  }, [onSuccess, onError])

  return {
    uploadRecording,
    isUploading
  }
}
