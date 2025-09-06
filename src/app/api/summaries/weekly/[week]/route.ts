import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'


// Helper function to get week start date from week string (YYYY-MM-DD format expected)
function getWeekDates(weekStartDate: string) {
  const startDate = new Date(weekStartDate)
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)
  
  return {
    start: weekStartDate,
    end: endDate.toISOString().split('T')[0]
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ week: string }> }
) {
  try {
    const { week } = await params

    // Validate date format (YYYY-MM-DD for week start)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(week)) {
      return NextResponse.json({
        error: 'Invalid week format. Use YYYY-MM-DD for week start date (Monday)'
      }, { status: 400 })
    }

    const weekDates = getWeekDates(week)
    console.log(`📅 Getting weekly summary for ${weekDates.start} to ${weekDates.end}`)

    // Połączenie z Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Pobierz weekly summary
    const { data: summary, error: summaryError } = await supabase
      .from('weekly_summaries')
      .select('*')
      .eq('week_start', weekDates.start)
      .eq('week_end', weekDates.end)
      .single()

    if (summaryError) {
      if (summaryError.code === 'PGRST116') {
        // No summary found for this week
        return NextResponse.json({
          error: 'Weekly summary not found for this week',
          week_start: weekDates.start,
          week_end: weekDates.end,
          suggestion: `Generate summary using POST /api/summaries/weekly/generate with body: {"weekStartDate": "${weekDates.start}"}`
        }, { status: 404 })
      }
      throw new Error(`Database error: ${summaryError.message}`)
    }

    // Supabase returns JSONB as parsed objects already
    const processedSummary = {
      ...summary,
      diary_entries: summary.diary_entries || []
    }

    // Pobierz statystyki z voice_notes dla tego tygodnia
    const { data: notesStats, error: notesError } = await supabase
      .from('voice_notes')
      .select('id, mood_score, emotional_tags, main_topics, importance_level, created_at, recorded_date')
      .gte('created_at', `${weekDates.start} 00:00:00`)
      .lte('created_at', `${weekDates.end} 23:59:59`)
      .order('created_at', { ascending: true })

    let notesData = []
    let weeklyStats: {
      total_notes: number
      avg_mood: number
      mood_by_day: { [key: string]: number }
      top_topics: Array<{ topic: string; count: number }>
      top_emotions: Array<{ emotion: string; count: number }>
    } = {
      total_notes: 0,
      avg_mood: 0,
      mood_by_day: {},
      top_topics: [],
      top_emotions: []
    }

    if (!notesError && notesStats) {
      notesData = notesStats.map(note => ({
        ...note,
        emotional_tags: note.emotional_tags || [],
        main_topics: note.main_topics || []
      }))

      // Calculate weekly statistics
      weeklyStats.total_notes = notesData.length
      
      const validMoods = notesData.filter(n => n.mood_score).map(n => n.mood_score)
      weeklyStats.avg_mood = validMoods.length > 0 
        ? Math.round((validMoods.reduce((a, b) => a + b, 0) / validMoods.length) * 10) / 10 
        : 0

      // Group mood by day
      const moodByDay: { [key: string]: number[] } = {}
      notesData.forEach(note => {
        if (note.recorded_date && note.mood_score) {
          const day = new Date(note.recorded_date).toLocaleDateString('pl-PL', { weekday: 'short' })
          if (!moodByDay[day]) moodByDay[day] = []
          moodByDay[day].push(note.mood_score)
        }
      })
      
      // Average mood per day
      Object.keys(moodByDay).forEach(day => {
        const moods = moodByDay[day]
        weeklyStats.mood_by_day[day] = Math.round((moods.reduce((a, b) => a + b, 0) / moods.length) * 10) / 10
      })

      // Top topics and emotions
      const allTopics = notesData.flatMap(n => n.main_topics || [])
      const allEmotions = notesData.flatMap(n => n.emotional_tags || [])
      
      const topicCounts: { [key: string]: number } = {}
      const emotionCounts: { [key: string]: number } = {}
      
      allTopics.forEach(topic => topicCounts[topic] = (topicCounts[topic] || 0) + 1)
      allEmotions.forEach(emotion => emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1)
      
      weeklyStats.top_topics = Object.entries(topicCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([topic, count]) => ({ topic, count }))
        
      weeklyStats.top_emotions = Object.entries(emotionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([emotion, count]) => ({ emotion, count }))
    }

    console.log(`✅ Found weekly summary for ${weekDates.start}-${weekDates.end} with ${notesData.length} related notes`)

    return NextResponse.json({
      success: true,
      week_start: weekDates.start,
      week_end: weekDates.end,
      summary: processedSummary,
      weekly_stats: weeklyStats,
      retrieved_at: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Error getting weekly summary:', error)
    return NextResponse.json({
      error: 'Failed to get weekly summary',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}
