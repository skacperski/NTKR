import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { createClient } from '@supabase/supabase-js'
import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'
import { getModelForTask } from '@/lib/ai-models'
import { getPrompt } from '@/lib/ai-prompts'

// Schema dla analizy AI
const TranscriptionSchema = z.object({
  transcription: z.string(),
  corrected_text: z.string(),
  topics: z.array(z.string()),
})

const AnalysisSchema = z.object({
  summary: z.string(),
  follow_up_questions: z.array(z.string()),
  action_items: z.array(z.string()),
  insights: z.array(z.string()),
})

// Nowy schema dla mood analysis
const MoodAnalysisSchema = z.object({
  mood_score: z.number().min(1).max(10),
  emotional_tags: z.array(z.string()).max(3),
  main_topics: z.array(z.string()).max(5),
  importance_level: z.number().min(1).max(5)
})

// Typy dla Supabase
interface VoiceNote {
  id?: number
  filename: string
  blob_url: string
  transcription: string
  corrected_text: string
  summary: string
  topics: string
  follow_up_questions: string
  action_items: string
  insights: string
  location: string
  recorded_at: string
  created_at: string
  
  // Nowe pola mood analysis
  recorded_date?: string
  recorded_time?: string
  mood_score?: number
  emotional_tags?: string
  main_topics?: string
  importance_level?: number
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎙️ New voice note received')
    
    // Parsuj form data
    const formData = await request.formData()
    const audioFile = formData.get('message') as File
    const timestamp = formData.get('timestamp') as string
    const location = formData.get('location') as string
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }
    
    console.log(`📁 File: ${audioFile.name}, Size: ${Math.round(audioFile.size / 1024)}KB`)
    
    // Upload do Vercel Blob Storage
    const filename = `voice-note-${Date.now()}-${audioFile.name}`
    const blob = await put(filename, audioFile, {
      access: 'public',
    })
    
    console.log('☁️ Uploaded to Vercel Blob:', blob.url)
    
    // Przygotuj audio dla AI (konwersja do base64)
    const audioBuffer = await audioFile.arrayBuffer()
    const audioBase64 = Buffer.from(audioBuffer).toString('base64')
    const mimeType = audioFile.type || 'audio/wav'
    
    // FAZA 1: Transkrypcja
    const transcriptionModel = getModelForTask('TRANSCRIPTION');
    console.log(`📝 Phase 1: Transcription with ${transcriptionModel}...`)
    
    const transcriptionResult = await generateObject({
      model: google(transcriptionModel),
      schema: TranscriptionSchema,
      messages: [
        {
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: getPrompt('TRANSCRIPTION', { 
                date: timestamp || undefined, 
                location: location || undefined 
              })
            },
            {
              type: 'file',
              data: audioBase64,
              mimeType: mimeType,
            },
          ],
        },
      ],
    })
    
    console.log('✅ Transcription completed')
    
    // FAZA 2: Analiza nastroju
    const moodModel = getModelForTask('MOOD_ANALYSIS');
    console.log(`🧠 Phase 2: Analysis with ${moodModel}...`)
    
    const analysisResult = await generateObject({
      model: google(moodModel),
      schema: AnalysisSchema,
      messages: [
        {
          role: 'system',
          content: 'Jesteś polskim asystentem AI. ZAWSZE odpowiadasz TYLKO w języku polskim. Nigdy nie używasz języka angielskiego.'
        },
        {
          role: 'user',
          content: `Przeanalizuj następującą transkrypcję notatki głosowej:

"${transcriptionResult.object.transcription}"

Wykonaj analizę w języku polskim:

1. PODSUMOWANIE: Zwięzłe podsumowanie (2-3 zdania)
2. PYTANIA UZUPEŁNIAJĄCE: 3-5 pytań uzupełniających
3. ZADANIA DO WYKONANIA: Konkretne akcje/TODO jeśli są wspomniane
4. KLUCZOWE WNIOSKI: Najważniejsze insights

Kontekst: ${timestamp || 'brak'}, ${location || 'brak'}

PAMIĘTAJ: Wszystkie odpowiedzi MUSZĄ być po polsku!`
        }
      ],
    })
    
    console.log('✅ Analysis completed')
    
    // FAZA 3: Mood Analysis
    const moodAnalysisModel = getModelForTask('MOOD_ANALYSIS');
    console.log(`😊 Phase 3: Mood Analysis with ${moodAnalysisModel}...`)
    
    const moodResult = await generateObject({
      model: google(moodAnalysisModel),
      schema: MoodAnalysisSchema,
      messages: [
        {
          role: 'system',
          content: 'Jesteś ekspertem AI w analizie nastrojów i emocji. ZAWSZE odpowiadasz TYLKO w języku polskim.'
        },
        {
          role: 'user',
          content: `Przeanalizuj nastrój i emocje użytkownika na podstawie transkrypcji:

"${transcriptionResult.object.transcription}"

Wykonaj analizę nastrojową w języku polskim:

1. MOOD SCORE: Oceń ogólny nastrój na skali 1-10 (1=bardzo zły, 10=świetny)
2. EMOTIONAL TAGS: Wybierz maksymalnie 3 tagi emocjonalne (np. "zmotywowany", "zestresowany", "spokojny")
3. MAIN TOPICS: Wyodrębnij maksymalnie 5 głównych tematów (np. "praca", "rodzina", "zdrowie")
4. IMPORTANCE LEVEL: Oceń wagę tej notatki na skali 1-5 (1=mało ważne, 5=bardzo ważne)

Kontekst: ${timestamp || 'brak'}, ${location || 'brak'}

PAMIĘTAJ: Wszystkie tagi i tematy po polsku!`
        }
      ]
    })
    
    console.log('✅ Mood Analysis completed')
    
    // Przygotuj daty z timestamp
    const recordedDate = timestamp ? new Date(timestamp).toISOString().split('T')[0] : null
    const recordedTime = timestamp ? new Date(timestamp).toISOString().split('T')[1].split('.')[0] : null
    
    // BEZPIECZNE POŁĄCZENIE Z SUPABASE
    console.log('💾 Connecting to Supabase...')
    
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }
    
    if (!supabaseUrl.includes('supabase.co')) {
      throw new Error(`Invalid Supabase URL: ${supabaseUrl}`)
    }
    
    console.log('🔗 Supabase URL:', supabaseUrl.substring(0, 30) + '...')
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Zapisz do Supabase z mood analysis
    const { data: noteData, error: dbError } = await supabase
      .from('voice_notes')
      .insert([{
        filename: filename,
        blob_url: blob.url,
        transcription: transcriptionResult.object.transcription,
        corrected_text: transcriptionResult.object.corrected_text,
        summary: analysisResult.object.summary,
        topics: JSON.stringify(transcriptionResult.object.topics),
        follow_up_questions: JSON.stringify(analysisResult.object.follow_up_questions),
        action_items: JSON.stringify(analysisResult.object.action_items),
        insights: JSON.stringify(analysisResult.object.insights),
        location: location,
        recorded_at: timestamp,
        created_at: new Date().toISOString(),
        
        // Nowe pola mood analysis
        recorded_date: recordedDate,
        recorded_time: recordedTime,
        mood_score: moodResult.object.mood_score,
        emotional_tags: JSON.stringify(moodResult.object.emotional_tags),
        main_topics: JSON.stringify(moodResult.object.main_topics),
        importance_level: moodResult.object.importance_level
      }])
      .select('id')
      .single()
    
    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error(`Database error: ${dbError.message}`)
    }
    
    console.log('💾 Saved to database with ID:', noteData?.id)
    
    // Auto-regenerate daily summary for today
    try {
      const today = new Date().toISOString().split('T')[0]
      console.log(`🔄 Auto-regenerating daily summary for ${today}`)
      
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000'
      
      const summaryResponse = await fetch(`${baseUrl}/api/summaries/daily/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today })
      })
      
      if (summaryResponse.ok) {
        console.log(`✅ Daily summary auto-regenerated for ${today}`)
      } else {
        console.warn(`⚠️ Failed to auto-regenerate daily summary: ${summaryResponse.status}`)
      }
    } catch (error) {
      console.warn('⚠️ Auto-regeneration failed:', error)
    }
    
    // Odpowiedź dla Shortcuts
    return NextResponse.json({
      success: true,
      message: 'Voice note processed successfully!',
      note_id: noteData?.id,
      transcription_preview: transcriptionResult.object.transcription.substring(0, 100) + '...',
               models_used: {
           transcription: transcriptionModel,
           analysis: moodModel,
           mood_analysis: moodAnalysisModel
         },
         mood_data: {
           mood_score: moodResult.object.mood_score,
           emotional_tags: moodResult.object.emotional_tags,
           main_topics: moodResult.object.main_topics,
           importance_level: moodResult.object.importance_level
         },
      processed_at: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('❌ Error processing voice note:', error)
    return NextResponse.json({
      error: 'Failed to process voice note',
      details: error?.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// GET endpoint - info o API
export async function GET() {
  return NextResponse.json({
    message: 'Voice Notes API - Clean Supabase Integration',
    endpoints: {
      'POST /api/voice-notes': 'Upload and process voice note',
      'DELETE /api/voice-notes': 'Delete voice note by ID'
    },
    services: {
      storage: 'Vercel Blob',
      database: 'Supabase', 
             ai: 'Google Gemini (Configurable Models)'
    },
    status: 'ready'
  })
}

// DELETE endpoint - usuwanie notatek
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 })
    }

    console.log(`🗑️ Deleting voice note ${id}`)

    // Połączenie z Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Pobierz notatkę przed usunięciem (dla blob_url)
    const { data: note, error: fetchError } = await supabase
      .from('voice_notes')
      .select('blob_url, filename')
      .eq('id', id)
      .single()

    if (fetchError || !note) {
      return NextResponse.json({ 
        error: 'Voice note not found' 
      }, { status: 404 })
    }

    // Usuń z bazy danych
    const { error: deleteError } = await supabase
      .from('voice_notes')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw new Error(`Database delete error: ${deleteError.message}`)
    }

    console.log(`✅ Voice note ${id} deleted successfully`)

    return NextResponse.json({
      success: true,
      message: 'Voice note deleted successfully',
      deleted_id: id,
      deleted_filename: note.filename
    })

  } catch (error) {
    console.error('❌ Delete error:', error)
    return NextResponse.json({
      error: 'Failed to delete voice note',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
