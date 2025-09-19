import React from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { headers } from 'next/headers'
import { GenerateSummaryButton } from '@/components/ui/generate-summary-button'
import { StickyNavigation } from '@/components/ui/sticky-navigation'
import { CollapsibleSection } from '@/components/ui/collapsible-section'

interface DailySummary {
  id: number
  summary_date: string
  total_recordings: number
  overall_mood: number
  summary_text: string
  selected_questions: string[]
  next_day_suggestions: string[]
  created_at: string
}

interface WeeklySummary {
  id: number
  week_start: string
  week_end: string
  diary_entries: { date: string; time: string; entry: string }[]
  total_recordings: number
  motivational_quote: string
  quote_context: string
  created_at: string
}

async function getAllSummaries() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get all daily summaries
    const { data: dailySummaries, error: dailyError } = await supabase
      .from('daily_summaries')
      .select('*')
      .order('summary_date', { ascending: false })

    // Get all weekly summaries
    const { data: weeklySummaries, error: weeklyError } = await supabase
      .from('weekly_summaries')
      .select('*')
      .order('week_start', { ascending: false })

    if (dailyError || weeklyError) {
      throw new Error('Database error')
    }

    return {
      daily: (dailySummaries || []).map(summary => ({
        ...summary,
        selected_questions: Array.isArray(summary.selected_questions) ? summary.selected_questions : [],
        next_day_suggestions: Array.isArray(summary.next_day_suggestions) ? summary.next_day_suggestions : []
      })),
      weekly: (weeklySummaries || []).map(summary => ({
        ...summary,
        diary_entries: Array.isArray(summary.diary_entries) ? summary.diary_entries : []
      }))
    }
  } catch (error) {
    console.error('❌ Error getting summaries:', error)
    return { daily: [], weekly: [] }
  }
}

function groupSummariesByWeek(dailySummaries: DailySummary[]) {
  const weeks: Record<string, { 
    weekStart: string, 
    weekEnd: string, 
    days: DailySummary[] 
  }> = {}

  dailySummaries.forEach(summary => {
    const date = new Date(summary.summary_date)
    const monday = new Date(date)
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Monday as first day
    monday.setDate(diff)
    
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    
    const weekKey = monday.toISOString().split('T')[0]
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = {
        weekStart: monday.toISOString().split('T')[0],
        weekEnd: sunday.toISOString().split('T')[0],
        days: []
      }
    }
    
    weeks[weekKey].days.push(summary)
  })

  // Sort days within each week
  Object.values(weeks).forEach(week => {
    week.days.sort((a, b) => new Date(a.summary_date).getTime() - new Date(b.summary_date).getTime())
  })

  return weeks
}

function WeekSection({ 
  week, 
  weeklySummary 
}: { 
  week: { weekStart: string, weekEnd: string, days: DailySummary[] }, 
  weeklySummary?: WeeklySummary 
}) {
  const formatWeekRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString('pl-PL')} - ${endDate.toLocaleDateString('pl-PL')}`
  }

  return (
    <div className="border border-gray-300 mb-6">
      {/* Week Header */}
      <div className="bg-gray-50 p-4 border-b border-gray-300">
        <h3 className="font-bold text-sm uppercase tracking-wide">
          TYDZIEŃ: {formatWeekRange(week.weekStart, week.weekEnd)}
        </h3>
        <p className="text-xs text-gray-600 mt-1">
          {week.days.length} {week.days.length === 1 ? 'dzień' : 'dni'} z podsumowaniami
        </p>
      </div>

      {/* Daily Summaries */}
      <div className="p-4 space-y-4">
        {week.days.map(day => (
          <div key={day.id} className="border-l-4 border-gray-200 pl-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">
                  {new Date(day.summary_date).toLocaleDateString('pl-PL', { 
                    weekday: 'long',
                    day: '2-digit',
                    month: '2-digit'
                  }).toUpperCase()}
                </span>
                <span className="text-xs text-gray-600">
                  Mood: {day.overall_mood}/10 • {day.total_recordings} recordings
                </span>
              </div>
              <Link
                href={`/summaries/daily/${day.summary_date}`}
                className="text-xs hover:underline font-bold"
              >
                VIEW →
              </Link>
            </div>
            
            <CollapsibleSection title="Summary" defaultOpen={false}>
              <p className="text-sm text-gray-700 leading-relaxed">
                {day.summary_text}
              </p>
            </CollapsibleSection>
          </div>
        ))}
      </div>

      {/* Weekly Summary Section */}
      {weeklySummary ? (
        <div className="border-t border-gray-300 bg-blue-50 p-4">
          <CollapsibleSection title="📅 WEEKLY SUMMARY" defaultOpen={false}>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm mb-2">DIARY ENTRIES</h4>
                <div className="space-y-2 text-sm">
                  {weeklySummary.diary_entries.map((entry, index) => (
                    <div key={index} className="border-l-2 border-blue-300 pl-3">
                      <div className="font-bold text-xs text-blue-800">
                        {entry.date} at {entry.time}
                      </div>
                      <div className="text-gray-700">{entry.entry}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-sm mb-2">MOTIVATIONAL QUOTE</h4>
                <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-700">
                  &quot;{weeklySummary.motivational_quote}&quot;
                  <footer className="text-xs text-gray-500 mt-1">— Artificial Wisdom</footer>
                </blockquote>
                <p className="text-xs text-gray-600 mt-2">{weeklySummary.quote_context}</p>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      ) : (
        <div className="border-t border-gray-300 bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-600 mb-2">No weekly summary yet</p>
          <GenerateSummaryButton date={week.weekStart} type="weekly" />
        </div>
      )}
    </div>
  )
}

export default async function SummariesPage() {
  const { daily, weekly } = await getAllSummaries()
  const weeklyGroups = groupSummariesByWeek(daily)
  const today = new Date().toISOString().split('T')[0]

  // Find today's summary
  const todaySummary = daily.find(s => s.summary_date === today)

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      <StickyNavigation />
      
      <div className="max-w-4xl mx-auto p-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">SUMMARIES</h1>
          <p className="text-sm text-gray-600 mt-1">
            Daily and weekly AI-generated insights
          </p>
        </div>

        {/* Today's Quick Access */}
        <section className="mb-12">
          <h2 className="text-lg font-bold mb-4">TODAY&apos;S SUMMARY</h2>
          <div className="border border-gray-300 p-6">
            {todaySummary ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-bold">{today}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      Mood: {todaySummary.overall_mood}/10
                    </span>
                  </div>
                  <Link
                    href={`/summaries/daily/${today}`}
                    className="text-xs hover:underline font-bold"
                  >
                    VIEW FULL →
                  </Link>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {todaySummary.summary_text}
                </p>
              </>
            ) : (
              <GenerateSummaryButton date={today} type="daily" />
            )}
          </div>
        </section>

        {/* Calendar View - Weeks */}
        <section>
          <h2 className="text-lg font-bold mb-6">CALENDAR VIEW</h2>
          
          {Object.entries(weeklyGroups)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([weekKey, week]) => {
              const weeklySummary = weekly.find(w => w.week_start === week.weekStart)
              return (
                <WeekSection
                  key={weekKey}
                  week={week}
                  weeklySummary={weeklySummary}
                />
              )
            })}
            
          {daily.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <h3 className="text-lg font-bold mb-4">NO SUMMARIES YET</h3>
              <p className="mb-4">Record some voice notes and generate your first daily summary</p>
              <Link href="/notes" className="text-sm hover:underline">
                → Go to Notes
              </Link>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}