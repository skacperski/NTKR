import React from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

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

async function getDailySummary(date: string): Promise<DailySummary | null> {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase credentials missing')
      return null
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('daily_summaries')
      .select('*')
      .eq('summary_date', date)
      .single()

    if (error || !data) return null

    return {
      ...data,
      selected_questions: Array.isArray(data.selected_questions) ? data.selected_questions : [],
      next_day_suggestions: Array.isArray(data.next_day_suggestions) ? data.next_day_suggestions : []
    }
  } catch (error) {
    console.error('❌ Error getting daily summary:', error)
    return null
  }
}

export default async function DailySummaryPage({
  params
}: {
  params: Promise<{ date: string }>
}) {
  const { date } = await params
  const summary = await getDailySummary(date)

  if (!summary) {
    return (
      <div className="min-h-screen bg-white text-black font-mono">
        <div className="max-w-4xl mx-auto p-6">
          <div className="border-b border-gray-300 pb-4 mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">DAILY SUMMARY - {date}</h1>
              <Link href="/summaries" className="text-sm hover:underline">
                ← BACK TO SUMMARIES
              </Link>
            </div>
          </div>
          
          <div className="text-center py-12 text-gray-600">
            <h2 className="text-lg font-bold mb-4">SUMMARY NOT FOUND</h2>
            <p className="mb-4">No summary exists for {date}</p>
            <Link href="/summaries" className="text-sm hover:underline">
              ← Go back to summaries
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      <div className="max-w-4xl mx-auto p-6">
        
        {/* Header */}
        <div className="border-b border-gray-300 pb-4 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">DAILY SUMMARY</h1>
            <Link href="/summaries" className="text-sm hover:underline">
              ← BACK TO SUMMARIES
            </Link>
          </div>
        </div>

        {/* Summary Content */}
        <div className="space-y-8">
          
          {/* Date and Mood */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{date}</h2>
              <div className="text-sm text-gray-600">
                Mood: {summary.overall_mood}/10 • {summary.total_recordings} recordings
              </div>
            </div>
          </div>

          {/* Summary Text */}
          <section>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wide">SUMMARY</h3>
            <div className="border border-gray-300 p-6">
              <p className="leading-relaxed">{summary.summary_text}</p>
            </div>
          </section>

          {/* Questions */}
          {summary.selected_questions.length > 0 && (
            <section>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide">REFLECTION QUESTIONS</h3>
              <div className="border border-gray-300 p-6">
                <ol className="space-y-3">
                  {summary.selected_questions.map((question, index) => (
                    <li key={index} className="flex">
                      <span className="font-bold mr-3">{index + 1}.</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {/* Next Day Suggestions */}
          {summary.next_day_suggestions.length > 0 && (
            <section>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide">TOMORROW</h3>
              <div className="border border-gray-300 p-6">
                <ul className="space-y-2">
                  {summary.next_day_suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

        </div>

      </div>
    </div>
  )
}
