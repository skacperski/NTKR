// Simple state management for recording status across components

type RecordingStatus = 'idle' | 'recording' | 'processing' | 'transcribing' | 'analyzing' | 'saving' | 'completed'

interface RecordingState {
  status: RecordingStatus
  recordingTime: number
  tempId?: string
}

// Simple event emitter for recording state
class RecordingStore {
  private state: RecordingState = {
    status: 'idle',
    recordingTime: 0
  }
  
  private listeners: Set<(state: RecordingState) => void> = new Set()

  getState(): RecordingState {
    return { ...this.state }
  }

  setState(newState: Partial<RecordingState>) {
    this.state = { ...this.state, ...newState }
    this.listeners.forEach(listener => listener(this.state))
  }

  subscribe(listener: (state: RecordingState) => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  // Convenience methods
  startRecording() {
    const tempId = `temp-${Date.now()}`
    this.setState({ 
      status: 'recording', 
      recordingTime: 0,
      tempId 
    })
    return tempId
  }

  updateRecordingTime(time: number) {
    this.setState({ recordingTime: time })
  }

  setProcessing() {
    this.setState({ status: 'processing' })
  }

  setTranscribing() {
    this.setState({ status: 'transcribing' })
  }

  setAnalyzing() {
    this.setState({ status: 'analyzing' })
  }

  setSaving() {
    this.setState({ status: 'saving' })
  }

  setCompleted() {
    this.setState({ status: 'completed' })
    // Auto-reset after 2 seconds
    setTimeout(() => {
      this.setState({ status: 'idle', tempId: undefined })
    }, 2000)
  }

  reset() {
    this.setState({ 
      status: 'idle', 
      recordingTime: 0, 
      tempId: undefined 
    })
  }
}

export const recordingStore = new RecordingStore()
