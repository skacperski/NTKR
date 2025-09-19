import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { createClient } from '@supabase/supabase-js'

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
    
    // NATYCHMIASTOWY ZAPIS DO BAZY - tylko podstawowe dane
    console.log('💾 Connecting to Supabase...')
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    console.log(`🔗 Supabase URL: ${supabaseUrl.substring(0, 30)}...`)
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Zapisz podstawowe dane natychmiast z placeholder content
    const { data: noteData, error: insertError } = await supabase
      .from('voice_notes')
      .insert({
        filename: audioFile.name,
        blob_url: blob.url,
        transcription: 'Przetwarzanie...', // Placeholder
        corrected_text: 'Przetwarzanie...', // Placeholder
        summary: 'Analizuję zawartość...', // Placeholder
        topics: JSON.stringify(['Przetwarzanie...']),
        follow_up_questions: JSON.stringify(['Pytania będą dostępne po analizie...']),
        action_items: JSON.stringify(['Zadania będą dostępne po analizie...']),
        insights: JSON.stringify(['Wnioski będą dostępne po analizie...']),
        location: location || '',
        recorded_at: timestamp || new Date().toISOString(),
        created_at: new Date().toISOString(),
        recorded_date: timestamp?.split('T')[0] || new Date().toISOString().split('T')[0],
        recorded_time: timestamp?.split('T')[1]?.split('.')[0] || new Date().toTimeString().split(' ')[0],
        processing_status: 'processing' // Nowy status field!
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Failed to save to database:', insertError)
      throw insertError
    }

    console.log('💾 Saved to database with ID:', noteData?.id)
    console.log('✅ Note created instantly - AI processing will continue in background')

    // URUCHOM PRZETWARZANIE AI W TLE (asynchronicznie)
    if (noteData?.id) {
      // Wywołaj endpoint do przetwarzania AI bez czekania na odpowiedź
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000'
      
      // Fire and forget - nie czekamy na odpowiedź
      fetch(`${baseUrl}/api/voice-notes/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId: noteData.id })
      }).catch(error => {
        console.error('❌ Background AI processing failed:', error)
      })

      console.log('🤖 Background AI processing started for note', noteData.id)
    }

    // Zwróć natychmiastową odpowiedź z podstawowymi danymi
    return NextResponse.json({
      success: true,
      message: 'Voice note uploaded and processing started',
      data: {
        id: noteData.id,
        filename: noteData.filename,
        blob_url: noteData.blob_url,
        processing_status: 'processing',
        created_at: noteData.created_at
      }
    })

  } catch (error) {
    console.error('❌ Voice note upload error:', error)
    return NextResponse.json({
      error: 'Failed to process voice note',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE endpoint pozostaje bez zmian
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