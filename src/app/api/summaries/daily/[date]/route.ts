import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return NextResponse.json({
        error: 'Invalid date format. Use YYYY-MM-DD'
      }, { status: 400 })
    }

    console.log(`📊 Getting daily summary for ${date}`)

    // Połączenie z Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Pobierz daily summary
    const { data: summary, error: summaryError } = await supabase
      .from('daily_summaries')
      .select('*')
      .eq('summary_date', date)
      .single()

    if (summaryError) {
      if (summaryError.code === 'PGRST116') {
        // No summary found for this date
        return NextResponse.json({
          error: 'Daily summary not found for this date',
          date,
          suggestion: `Generate summary using POST /api/summaries/daily/generate with body: {"date": "${date}"}`
        }, { status: 404 })
      }
      throw new Error(`Database error: ${summaryError.message}`)
    }

    // Supabase returns JSONB as parsed objects already
    const processedSummary = {
      ...summary,
      selected_questions: summary.selected_questions || [],
      next_day_suggestions: summary.next_day_suggestions || []
    }

    // Pobierz też podstawowe statystyki z voice_notes dla tego dnia
    const { data: notesStats, error: notesError } = await supabase
      .from('voice_notes')
      .select('id, mood_score, emotional_tags, main_topics, importance_level, created_at')
      .gte('created_at', `${date} 00:00:00`)
      .lte('created_at', `${date} 23:59:59`)

    let notesData: any[] = []
    if (!notesError && notesStats) {
      notesData = notesStats.map(note => ({
        ...note,
        emotional_tags: note.emotional_tags || [],
        main_topics: note.main_topics || []
      }))
    }

    console.log(`✅ Found daily summary for ${date} with ${notesData.length} related notes`)

    return NextResponse.json({
      success: true,
      date,
      summary: processedSummary,
      related_notes: {
        count: notesData.length,
        notes: notesData
      },
      retrieved_at: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Error getting daily summary:', error)
    return NextResponse.json({
      error: 'Failed to get daily summary',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}
