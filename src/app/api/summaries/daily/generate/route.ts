import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'
import { getModelForTask } from '@/lib/ai-models'

// Schema dla daily summary
const DailySummarySchema = z.object({
  summary_text: z.string(),
  overall_mood: z.number().min(1).max(10),
  selected_questions: z.array(z.string()).length(3),
  next_day_suggestions: z.array(z.string()).length(3),
})

export async function POST(request: NextRequest) {
  try {
    const { date } = await request.json()
    
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    console.log(`📊 Generating daily summary for ${date}`)

    // Połączenie z Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Pobierz wszystkie nagrania z danego dnia
    const { data: notes, error: notesError } = await supabase
      .from('voice_notes')
      .select('*')
      .gte('created_at', `${date} 00:00:00`)
      .lte('created_at', `${date} 23:59:59`)
      .order('created_at', { ascending: true })

    if (notesError) {
      throw new Error(`Database error: ${notesError.message}`)
    }

    if (!notes || notes.length === 0) {
      return NextResponse.json({ 
        error: 'No voice notes found for this date',
        date 
      }, { status: 404 })
    }

    console.log(`📝 Found ${notes.length} voice notes for ${date}`)

    // Przygotuj dane dla AI
    const transcriptions = notes.map(note => note.transcription).join('\n\n')
    const allQuestions = notes.flatMap(note => {
      // Supabase returns JSONB as parsed objects already
      if (Array.isArray(note.follow_up_questions)) {
        return note.follow_up_questions
      }
      if (typeof note.follow_up_questions === 'string') {
        try {
          return JSON.parse(note.follow_up_questions)
        } catch {
          return []
        }
      }
      return []
    })

    // Generuj daily summary używając skonfigurowanego modelu
    const dailySummaryModel = getModelForTask('DAILY_SUMMARY')
    console.log(`🤖 Using model: ${dailySummaryModel} for daily summary`)

    const summaryResult = await generateObject({
      model: google(dailySummaryModel),
      schema: DailySummarySchema,
      messages: [
        {
          role: 'system',
          content: 'Jesteś osobistym asystentem AI tworzącym podsumowania dnia. ZAWSZE odpowiadasz TYLKO w języku polskim.'
        },
        {
          role: 'user',
          content: `Stwórz podsumowanie dnia ${date} na podstawie nagrań głosowych użytkownika.

ZADANIE:
1. Stwórz krótkie podsumowanie dnia (2-3 zdania) w trzeciej osobie
2. Określ ogólny nastrój dnia (1-10)
3. Wybierz 3 najważniejsze pytania do refleksji
4. Zaproponuj 3 konkretne działania na jutro

KONTEKST:
- Liczba nagrań: ${notes.length}
- Transkrypcje: ${transcriptions}
- Dostępne pytania: ${JSON.stringify(allQuestions)}

WAŻNE:
- Opis dnia pisz w trzeciej osobie (użytkownik, on/ona)
- Pytania kieruj bezpośrednio do użytkownika (ty, Twoje, Ciebie)
- Sugestie w trybie rozkazującym (zrób, zaplanuj, skontaktuj się)
- Bądź konkretny i zwięzły`
        }
      ]
    })

    // Zapisz daily summary do bazy
    const { data: summary, error: summaryError } = await supabase
      .from('daily_summaries')
      .insert([{
        summary_date: date,
        total_recordings: notes.length,
        overall_mood: summaryResult.object.overall_mood,
        summary_text: summaryResult.object.summary_text,
        selected_questions: summaryResult.object.selected_questions,
        next_day_suggestions: summaryResult.object.next_day_suggestions,
        created_at: new Date().toISOString()
      }])
      .select('id')
      .single()

    if (summaryError) {
      throw new Error(`Failed to save summary: ${summaryError.message}`)
    }

    console.log(`✅ Daily summary generated and saved with ID: ${summary?.id}`)

    return NextResponse.json({
      success: true,
      summary_id: summary?.id,
      date,
      model_used: dailySummaryModel,
      summary: summaryResult.object,
      generated_at: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Error generating daily summary:', error)
    return NextResponse.json({
      error: 'Failed to generate daily summary',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}
