'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { DayGroup } from '@/components/ui/day-group'
import { CollapsibleNoteCard } from '@/components/ui/collapsible-note-card'
import { RecordingStatusDisplay } from '@/components/ui/recording-status'
import { StickyNavigation } from '@/components/ui/sticky-navigation'

interface VoiceNote {
  id: number
  filename: string
  blob_url: string
  transcription: string
  corrected_text: string
  summary: string
  topics: string[]
  follow_up_questions: string[]
  action_items: string[]
  insights: string[]
  location: string
  recorded_at: string
  created_at: string
  mood_score?: number
  emotional_tags?: string[]
  main_topics?: string[]
  importance_level?: number
  processing_status?: 'uploading' | 'processing' | 'transcribing' | 'analyzing' | 'completed' | 'error'
}

// Client-side function to fetch notes
async function fetchVoiceNotes(): Promise<VoiceNote[]> {
  try {
    const response = await fetch('/api/voice-notes/list', {
      cache: 'no-store' // Always fetch fresh data
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.data || []

  } catch (error) {
    console.error('❌ Error loading voice notes:', error)
    return []
  }
}

function groupNotesByDay(notes: VoiceNote[]): Record<string, VoiceNote[]> {
  return notes.reduce((groups, note) => {
    const date = new Date(note.created_at).toISOString().split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(note)
    return groups
  }, {} as Record<string, VoiceNote[]>)
}


export default function NotesPage() {
  const [notes, setNotes] = useState<VoiceNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now())

  // Funkcja do ładowania notatek
  const loadNotes = useCallback(async () => {
    setIsLoading(true)
    try {
      const fetchedNotes = await fetchVoiceNotes()
      setNotes(fetchedNotes)
      setLastRefresh(Date.now())
    } catch (error) {
      console.error('❌ Failed to load notes:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Ładuj notatki przy pierwszym renderze
  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  // Nasłuchuj na nowe notatki
  useEffect(() => {
    const handleNoteAdded = () => {
      console.log('🔔 Note added event received - refreshing list')
      loadNotes()
    }

    const handleNoteDeleted = () => {
      console.log('🔔 Note deleted event received - refreshing list')
      loadNotes()
    }

    window.addEventListener('noteAdded', handleNoteAdded)
    window.addEventListener('noteDeleted', handleNoteDeleted)

    return () => {
      window.removeEventListener('noteAdded', handleNoteAdded)
      window.removeEventListener('noteDeleted', handleNoteDeleted)
    }
  }, [loadNotes])

  // Auto-refresh co 5 sekund jeśli są notatki w trakcie przetwarzania
  useEffect(() => {
    const hasProcessingNotes = notes.some(note => 
      note.processing_status && note.processing_status !== 'completed'
    )

    if (hasProcessingNotes) {
      const interval = setInterval(() => {
        console.log('🔄 Auto-refreshing notes (processing detected)')
        loadNotes()
      }, 5000) // Co 5 sekund

      return () => clearInterval(interval)
    }
  }, [notes, loadNotes])

  // Funkcja do ręcznego odświeżenia
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered')
    loadNotes()
  }

  const groupedNotes = groupNotesByDay(notes)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      <StickyNavigation />
      
      <div className="max-w-6xl mx-auto p-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">VOICE NOTES ({notes.length})</h1>
              <p className="text-sm text-gray-600 mt-1">
                Personal voice journal with AI insights
                {isLoading && <span className="ml-2">• Ładowanie...</span>}
              </p>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className={isLoading ? "animate-spin" : ""}>🔄</span>
              Odśwież
            </button>
          </div>
        </div>

        {/* Recording Status */}
        <RecordingStatusDisplay />

        {/* Grouped Notes by Day */}
        <div className="space-y-6">
          {Object.entries(groupedNotes)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, dayNotes]) => (
              <DayGroup
                key={date}
                date={date}
                notesCount={dayNotes.length}
                isToday={date === today}
              >
                <div className="space-y-0">
                  {dayNotes.map((note, index) => (
                    <CollapsibleNoteCard 
                      key={note.id} 
                      note={note} 
                      isNewest={index === 0}
                    />
                  ))}
                </div>
              </DayGroup>
            ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <h2 className="text-lg font-bold mb-4">NO NOTES YET</h2>
            <p className="mb-4">Start recording your thoughts with the floating record button</p>
            <p className="text-xs">Or use Apple Shortcuts to record from your iPhone</p>
          </div>
        )}

      </div>
    </div>
  )
}