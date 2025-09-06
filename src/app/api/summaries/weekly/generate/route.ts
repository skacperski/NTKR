import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'
import { getModelForTask } from '@/lib/ai-models'

// Schema dla weekly summary
const WeeklySummarySchema = z.object({
  diary_entries: z.array(z.object({
    date: z.string(),
    time: z.string(),
    entry: z.string()
  })),
  motivational_quote: z.string(),
  quote_context: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const { weekStartDate } = await request.json()
    
    if (!weekStartDate) {
      return NextResponse.json({ error: 'Week start date is required' }, { status: 400 })
    }

    // Oblicz datę końca tygodnia
    const startDate = new Date(weekStartDate)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    
    const weekEndDate = endDate.toISOString().split('T')[0]

    console.log(`📅 Generating weekly summary for ${weekStartDate} to ${weekEndDate}`)

    // Połączenie z Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Pobierz wszystkie nagrania z tygodnia
    const { data: notes, error: notesError } = await supabase
      .from('voice_notes')
      .select('*')
      .gte('created_at', `${weekStartDate} 00:00:00`)
      .lte('created_at', `${weekEndDate} 23:59:59`)
      .order('created_at', { ascending: true })

    if (notesError) {
      throw new Error(`Database error: ${notesError.message}`)
    }

    if (!notes || notes.length === 0) {
      return NextResponse.json({ 
        error: 'No voice notes found for this week',
        week: `${weekStartDate} to ${weekEndDate}`
      }, { status: 404 })
    }

    // Pobierz daily summaries z tego tygodnia (jeśli istnieją)
    const { data: dailySummaries } = await supabase
      .from('daily_summaries')
      .select('*')
      .gte('summary_date', weekStartDate)
      .lte('summary_date', weekEndDate)
      .order('summary_date', { ascending: true })

    console.log(`📝 Found ${notes.length} voice notes and ${dailySummaries?.length || 0} daily summaries`)

    // Przygotuj kontekst dla AI
    const weeklyContext = notes.map(note => ({
      date: note.created_at,
      transcription: note.transcription,
      location: note.location
    }))

    const dailySummariesText = dailySummaries?.map(summary => 
      `${summary.summary_date}: ${summary.summary_text}`
    ).join('\n') || 'Brak daily summaries'

    // Generuj weekly summary używając skonfigurowanego modelu
    const weeklySummaryModel = getModelForTask('WEEKLY_SUMMARY')
    console.log(`🤖 Using model: ${weeklySummaryModel} for weekly summary`)

    const weeklyResult = await generateObject({
      model: google(weeklySummaryModel),
      schema: WeeklySummarySchema,
      messages: [
        {
          role: 'system',
          content: 'Jesteś osobistym biografem AI tworzącym dziennik tygodnia. ZAWSZE odpowiadasz TYLKO w języku polskim.'
        },
        {
          role: 'user',
          content: `Stwórz dziennik tygodnia od ${weekStartDate} do ${weekEndDate}.

ZADANIE:
1. Stwórz chronologiczne wpisy dziennika (jeden na każde ważne wydarzenie)
2. Każdy wpis = jedno rozbudowane zdanie w trzeciej osobie
3. Dodaj motywacyjny cytat pasujący do tygodnia
4. Wyjaśnij dlaczego ten cytat jest odpowiedni

KONTEKST:
- Liczba nagrań: ${notes.length}
- Daily summaries: ${dailySummariesText}
- Szczegółowe nagrania: ${JSON.stringify(weeklyContext)}

FORMAT WPISU:
**[Dzień], [Data] o [Godzina]**
[Zdanie opisujące wydarzenie w trzeciej osobie]

CYTAT:
- Nie szukaj autora, stwórz własne słowa
- Podpisz jako "Artificial Wisdom"
- Dopasuj do kontekstu tygodnia użytkownika

Zwróć strukturalny JSON zgodny ze schematem.`
        }
      ]
    })

    // Zapisz weekly summary do bazy
    const { data: summary, error: summaryError } = await supabase
      .from('weekly_summaries')
      .insert([{
        week_start: weekStartDate,
        week_end: weekEndDate,
        diary_entries: weeklyResult.object.diary_entries,
        total_recordings: notes.length,
        motivational_quote: weeklyResult.object.motivational_quote,
        quote_context: weeklyResult.object.quote_context,
        created_at: new Date().toISOString()
      }])
      .select('id')
      .single()

    if (summaryError) {
      throw new Error(`Failed to save weekly summary: ${summaryError.message}`)
    }

    console.log(`✅ Weekly summary generated and saved with ID: ${summary?.id}`)

    return NextResponse.json({
      success: true,
      summary_id: summary?.id,
      week: `${weekStartDate} to ${weekEndDate}`,
      model_used: weeklySummaryModel,
      summary: weeklyResult.object,
      generated_at: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Error generating weekly summary:', error)
    return NextResponse.json({
      error: 'Failed to generate weekly summary',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}
