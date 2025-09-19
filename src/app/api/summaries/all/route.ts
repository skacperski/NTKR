import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const { searchParams } = url
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log(`📋 Getting all summaries (limit: ${limit}, offset: ${offset})`)

    // Połączenie z Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Pobierz daily summaries
    const { data: dailySummaries, error: dailyError } = await supabase
      .from('daily_summaries')
      .select('*')
      .order('summary_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (dailyError) {
      throw new Error(`Daily summaries error: ${dailyError.message}`)
    }

    // Pobierz weekly summaries
    const { data: weeklySummaries, error: weeklyError } = await supabase
      .from('weekly_summaries')
      .select('*')
      .order('week_start', { ascending: false })
      .range(offset, offset + limit - 1)

    if (weeklyError) {
      throw new Error(`Weekly summaries error: ${weeklyError.message}`)
    }

    // Process daily summaries (Supabase returns JSONB as objects)
    const processedDailySummaries = (dailySummaries || []).map(summary => ({
      ...summary,
      type: 'daily',
      selected_questions: summary.selected_questions || [],
      next_day_suggestions: summary.next_day_suggestions || []
    }))

    // Process weekly summaries (Supabase returns JSONB as objects)
    const processedWeeklySummaries = (weeklySummaries || []).map(summary => ({
      ...summary,
      type: 'weekly',
      diary_entries: summary.diary_entries || []
    }))

    // Combine and sort by date
    const allSummaries = [
      ...processedDailySummaries.map(s => ({ ...s, sort_date: s.summary_date })),
      ...processedWeeklySummaries.map(s => ({ ...s, sort_date: s.week_start }))
    ].sort((a, b) => new Date(b.sort_date).getTime() - new Date(a.sort_date).getTime())

    // Get total counts for pagination
    const { count: dailyCount } = await supabase
      .from('daily_summaries')
      .select('*', { count: 'exact', head: true })

    const { count: weeklyCount } = await supabase
      .from('weekly_summaries')
      .select('*', { count: 'exact', head: true })

    console.log(`✅ Found ${processedDailySummaries.length} daily and ${processedWeeklySummaries.length} weekly summaries`)

    return NextResponse.json({
      success: true,
      summaries: allSummaries,
      pagination: {
        limit,
        offset,
        total_daily: dailyCount || 0,
        total_weekly: weeklyCount || 0,
        total_combined: (dailyCount || 0) + (weeklyCount || 0),
        has_more: allSummaries.length === limit
      },
      retrieved_at: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Error getting all summaries:', error)
    return NextResponse.json({
      error: 'Failed to get summaries',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}
