import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const confirm = searchParams.get('confirm')
    
    if (confirm !== 'yes') {
      return NextResponse.json({
        error: 'Confirmation required',
        message: 'To clear test data, add ?confirm=yes to the URL',
        warning: 'This will delete ALL voice notes, daily summaries, and weekly summaries!'
      }, { status: 400 })
    }

    console.log('🧪 Clearing all test data...')

    // Połączenie z Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get counts before deletion
    const { count: voiceNotesCount } = await supabase
      .from('voice_notes')
      .select('*', { count: 'exact', head: true })

    const { count: dailySummariesCount } = await supabase
      .from('daily_summaries')
      .select('*', { count: 'exact', head: true })

    const { count: weeklySummariesCount } = await supabase
      .from('weekly_summaries')
      .select('*', { count: 'exact', head: true })

    // Clear all tables (order matters due to potential foreign keys)
    console.log('🗑️ Clearing weekly summaries...')
    const { error: weeklyError } = await supabase
      .from('weekly_summaries')
      .delete()
      .neq('id', 0) // Delete all records

    if (weeklyError) {
      console.warn('Weekly summaries deletion error:', weeklyError.message)
    }

    console.log('🗑️ Clearing daily summaries...')
    const { error: dailyError } = await supabase
      .from('daily_summaries')
      .delete()
      .neq('id', 0) // Delete all records

    if (dailyError) {
      console.warn('Daily summaries deletion error:', dailyError.message)
    }

    console.log('🗑️ Clearing voice notes...')
    const { error: voiceNotesError } = await supabase
      .from('voice_notes')
      .delete()
      .neq('id', 0) // Delete all records

    if (voiceNotesError) {
      console.warn('Voice notes deletion error:', voiceNotesError.message)
    }

    // Verify deletion
    const { count: remainingVoiceNotes } = await supabase
      .from('voice_notes')
      .select('*', { count: 'exact', head: true })

    const { count: remainingDaily } = await supabase
      .from('daily_summaries')
      .select('*', { count: 'exact', head: true })

    const { count: remainingWeekly } = await supabase
      .from('weekly_summaries')
      .select('*', { count: 'exact', head: true })

    console.log('✅ Test data cleared successfully')

    return NextResponse.json({
      success: true,
      message: 'All test data cleared successfully',
      deleted_counts: {
        voice_notes: (voiceNotesCount || 0) - (remainingVoiceNotes || 0),
        daily_summaries: (dailySummariesCount || 0) - (remainingDaily || 0),
        weekly_summaries: (weeklySummariesCount || 0) - (remainingWeekly || 0)
      },
      remaining_counts: {
        voice_notes: remainingVoiceNotes || 0,
        daily_summaries: remainingDaily || 0,
        weekly_summaries: remainingWeekly || 0
      },
      cleared_at: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Error clearing test data:', error)
    return NextResponse.json({
      error: 'Failed to clear test data',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}

// POST method for easier testing (some clients have issues with DELETE)
export async function POST(request: NextRequest) {
  try {
    const { confirm } = await request.json()
    
    if (confirm !== 'yes') {
      return NextResponse.json({
        error: 'Confirmation required',
        message: 'Send {"confirm": "yes"} in the request body',
        warning: 'This will delete ALL voice notes, daily summaries, and weekly summaries!'
      }, { status: 400 })
    }

    // Redirect to DELETE method logic
    const url = new URL(request.url)
    url.searchParams.set('confirm', 'yes')
    
    // Create a new request for the DELETE method
    const deleteRequest = new NextRequest(url, {
      method: 'DELETE',
      headers: request.headers
    })

    return await DELETE(deleteRequest)

  } catch (error: any) {
    console.error('❌ Error in POST clear test data:', error)
    return NextResponse.json({
      error: 'Failed to clear test data',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}
