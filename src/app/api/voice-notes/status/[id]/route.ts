import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 })
    }

    // Połączenie z Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Pobierz aktualny status notatki
    const { data: note, error: fetchError } = await supabase
      .from('voice_notes')
      .select('id, processing_status, transcription, summary, topics, follow_up_questions, action_items, insights')
      .eq('id', id)
      .single()

    if (fetchError || !note) {
      return NextResponse.json({
        error: 'Note not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: note.id,
        processing_status: note.processing_status,
        transcription: note.transcription,
        summary: note.summary,
        topics: note.topics,
        follow_up_questions: note.follow_up_questions,
        action_items: note.action_items,
        insights: note.insights
      }
    })

  } catch (error) {
    console.error('❌ Status check error:', error)
    return NextResponse.json({
      error: 'Failed to check note status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
