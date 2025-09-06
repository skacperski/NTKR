'use client'

import { useState, useEffect } from 'react'
import { recordingStore } from '@/lib/recording-store'

export function useRecordingState() {
  const [state, setState] = useState(recordingStore.getState())

  useEffect(() => {
    const unsubscribe = recordingStore.subscribe(setState)
    return unsubscribe
  }, [])

  return state
}
