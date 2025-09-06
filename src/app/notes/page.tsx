import React from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
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
}

async function getVoiceNotes(): Promise<VoiceNote[]> {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    console.log(`🔗 /notes connecting to Supabase: ${supabaseUrl.substring(0, 30)}...`)

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('voice_notes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }
    
    console.log(`✅ Loaded ${data?.length || 0} voice notes`)
    
    // Parse JSONB fields safely
    const processedNotes = (data || []).map((note: any) => {
      const safeJsonParse = (jsonData: any, fallback: any[] = []) => {
        // Supabase returns JSONB as parsed objects already
        if (!jsonData) return fallback
        if (Array.isArray(jsonData)) return jsonData
        if (typeof jsonData === 'object' && jsonData !== null) return jsonData
        if (typeof jsonData === 'string') {
          try {
            return JSON.parse(jsonData)
          } catch (e) {
            return fallback
          }
        }
        return fallback
      }
      
      return {
        ...note,
        topics: safeJsonParse(note.topics, []),
        follow_up_questions: safeJsonParse(note.follow_up_questions, []),
        action_items: safeJsonParse(note.action_items, []),
        insights: safeJsonParse(note.insights, []),
        emotional_tags: safeJsonParse(note.emotional_tags, []),
        main_topics: safeJsonParse(note.main_topics, [])
      }
    })
    
    return processedNotes

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


export default async function NotesPage() {
  const notes = await getVoiceNotes()
  const groupedNotes = groupNotesByDay(notes)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      <StickyNavigation />
      
      <div className="max-w-6xl mx-auto p-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">VOICE NOTES ({notes.length})</h1>
          <p className="text-sm text-gray-600 mt-1">
            Personal voice journal with AI insights
          </p>
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