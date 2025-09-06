'use client'

import React from 'react'
import { useRecordingState } from '@/lib/hooks/use-recording-state'
import { RecordingPlaceholder } from './recording-placeholder'

export function RecordingStatusDisplay() {
  const recordingState = useRecordingState()

  if (recordingState.status === 'idle') {
    return null
  }

  return (
    <div className="mb-6">
      <RecordingPlaceholder 
        status={recordingState.status}
        recordingTime={recordingState.recordingTime}
      />
    </div>
  )
}
