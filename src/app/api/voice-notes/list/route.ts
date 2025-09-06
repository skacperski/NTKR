import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    console.log('📋 Loading voice notes list...')
    
    // Połączenie z Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

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
    
    return NextResponse.json({
      success: true,
      data: processedNotes,
      count: processedNotes.length
    })

  } catch (error) {
    console.error('❌ Error loading voice notes:', error)
    return NextResponse.json({
      error: 'Failed to load voice notes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
