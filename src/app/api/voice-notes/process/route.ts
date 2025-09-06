import { NextRequest, NextResponse } from 'next/server'
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

const MoodAnalysisSchema = z.object({
  mood_score: z.number().min(1).max(10),
  emotional_tags: z.array(z.string()).max(3),
  main_topics: z.array(z.string()).max(5),
  importance_level: z.number().min(1).max(5)
})

export async function POST(request: NextRequest) {
  try {
    const { noteId } = await request.json()

    if (!noteId) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 })
    }

    console.log(`🤖 Starting AI processing for note ${noteId}`)

    // Połączenie z Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Pobierz notatkę z bazy
    const { data: note, error: fetchError } = await supabase
      .from('voice_notes')
      .select('*')
      .eq('id', noteId)
      .single()

    if (fetchError || !note) {
      console.error('❌ Note not found:', fetchError)
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    // Aktualizuj status na 'transcribing'
    await supabase
      .from('voice_notes')
      .update({ processing_status: 'transcribing' })
      .eq('id', noteId)

    // FAZA 1: Transkrypcja
    const transcriptionModel = getModelForTask('TRANSCRIPTION')
    console.log(`📝 Phase 1: Transcription with ${transcriptionModel}...`)
    
    const transcriptionResult = await generateObject({
      model: google(transcriptionModel),
      schema: TranscriptionSchema,
      messages: [
        {
          role: 'system',
          content: getPrompt('TRANSCRIPTION', {
            date: note.recorded_date,
            location: note.location
          })
        },
        {
          role: 'user',
          content: [
            {
              type: 'file',
              data: note.blob_url,
              mimeType: 'audio/webm'
            }
          ]
        }
      ]
    })
    
    console.log('✅ Transcription completed')

    // Aktualizuj z transkrypcją
    await supabase
      .from('voice_notes')
      .update({ 
        transcription: transcriptionResult.object.transcription,
        corrected_text: transcriptionResult.object.corrected_text,
        topics: JSON.stringify(transcriptionResult.object.topics),
        processing_status: 'analyzing'
      })
      .eq('id', noteId)

    // FAZA 2: Analiza
    const analysisModel = getModelForTask('ANALYSIS')
    console.log(`🧠 Phase 2: Analysis with ${analysisModel}...`)
    
    const analysisResult = await generateObject({
      model: google(analysisModel),
      schema: AnalysisSchema,
      messages: [
        {
          role: 'system',
          content: getPrompt('ANALYSIS', transcriptionResult.object.corrected_text, {
            date: note.recorded_date,
            location: note.location
          })
        },
        {
          role: 'user',
          content: transcriptionResult.object.corrected_text
        }
      ]
    })
    
    console.log('✅ Analysis completed')

    // FAZA 3: Mood Analysis
    const moodAnalysisModel = getModelForTask('MOOD_ANALYSIS')
    console.log(`😊 Phase 3: Mood Analysis with ${moodAnalysisModel}...`)
    
    const moodResult = await generateObject({
      model: google(moodAnalysisModel),
      schema: MoodAnalysisSchema,
      messages: [
        {
          role: 'system',
          content: getPrompt('MOOD_ANALYSIS', transcriptionResult.object.corrected_text)
        },
        {
          role: 'user',
          content: transcriptionResult.object.corrected_text
        }
      ]
    })
    
    console.log('✅ Mood Analysis completed')

    // Finalne zapisanie wszystkich danych
    const { error: updateError } = await supabase
      .from('voice_notes')
      .update({
        summary: analysisResult.object.summary,
        follow_up_questions: JSON.stringify(analysisResult.object.follow_up_questions),
        action_items: JSON.stringify(analysisResult.object.action_items),
        insights: JSON.stringify(analysisResult.object.insights),
        mood_score: moodResult.object.mood_score,
        emotional_tags: JSON.stringify(moodResult.object.emotional_tags),
        main_topics: JSON.stringify(moodResult.object.main_topics),
        importance_level: moodResult.object.importance_level,
        processing_status: 'completed'
      })
      .eq('id', noteId)

    if (updateError) {
      console.error('❌ Failed to update note with AI analysis:', updateError)
      await supabase
        .from('voice_notes')
        .update({ processing_status: 'error' })
        .eq('id', noteId)
      
      throw updateError
    }

    console.log(`✅ AI processing completed for note ${noteId}`)

    // Auto-regenerate daily summary
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

    return NextResponse.json({
      success: true,
      message: 'AI processing completed',
      noteId
    })

  } catch (error) {
    console.error('❌ AI processing error:', error)
    return NextResponse.json({
      error: 'Failed to process voice note with AI',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
