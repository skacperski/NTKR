import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { weekStartDate } = await request.json()
    
    if (!weekStartDate) {
      return NextResponse.json({ 
        error: 'Week start date is required (YYYY-MM-DD format, should be Monday)' 
      }, { status: 400 })
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(weekStartDate)) {
      return NextResponse.json({ 
        error: 'Invalid date format. Use YYYY-MM-DD for week start (Monday)' 
      }, { status: 400 })
    }

    console.log(`🧪 Generating mock week data starting from ${weekStartDate}`)

    const results = []
    const errors = []

    // Generate mock data for each day of the week (Monday to Friday)
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const currentDate = new Date(weekStartDate)
      currentDate.setDate(currentDate.getDate() + dayOffset)
      const dateString = currentDate.toISOString().split('T')[0]

      try {
        // Call the mock-day endpoint for each day
        const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/test/mock-day`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date: dateString })
        })

        if (!response.ok) {
          const errorData = await response.json()
          errors.push({
            date: dateString,
            error: errorData.error || 'Unknown error'
          })
        } else {
          const dayResult = await response.json()
          results.push({
            date: dateString,
            recordings_generated: dayResult.recordings_generated,
            success: true
          })
        }
      } catch (error: any) {
        errors.push({
          date: dateString,
          error: error.message || 'Network error'
        })
      }

      // Small delay between requests to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    const totalRecordings = results.reduce((sum, day) => sum + day.recordings_generated, 0)

    console.log(`✅ Generated mock data for ${results.length} days with ${totalRecordings} total recordings`)

    return NextResponse.json({
      success: true,
      week_start: weekStartDate,
      days_processed: results.length,
      total_recordings: totalRecordings,
      results,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully generated mock data for ${results.length} days (${totalRecordings} recordings total)`
    })

  } catch (error: any) {
    console.error('❌ Error generating mock week data:', error)
    return NextResponse.json({
      error: 'Failed to generate mock week data',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}

// Alternative implementation that directly inserts data (if the above doesn't work due to URL issues)
export async function PUT(request: NextRequest) {
  try {
    const { weekStartDate } = await request.json()
    
    if (!weekStartDate) {
      return NextResponse.json({ 
        error: 'Week start date is required (YYYY-MM-DD format, should be Monday)' 
      }, { status: 400 })
    }

    console.log(`🧪 Generating mock week data (direct method) starting from ${weekStartDate}`)

    const { createClient } = await import('@supabase/supabase-js')
    
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NTKR_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NTKR_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Mock templates for different days
    const weekTemplates = [
      // Monday - motivated start
      {
        mood_range: [7, 9],
        topics: ["praca", "cele", "planowanie"],
        emotions: ["zmotywowany", "energiczny", "skupiony"]
      },
      // Tuesday - productive work
      {
        mood_range: [6, 8],
        topics: ["projekty", "spotkania", "współpraca"],
        emotions: ["produktywny", "zaangażowany", "analityczny"]
      },
      // Wednesday - mid-week reflection
      {
        mood_range: [5, 7],
        topics: ["postęp", "wyzwania", "refleksje"],
        emotions: ["zamyślony", "refleksyjny", "realistyczny"]
      },
      // Thursday - pushing through
      {
        mood_range: [4, 7],
        topics: ["deadline", "stres", "wytrwałość"],
        emotions: ["zdeterminowany", "zmęczony", "wytrwały"]
      },
      // Friday - week wrap-up
      {
        mood_range: [6, 8],
        topics: ["podsumowanie", "osiągnięcia", "weekend"],
        emotions: ["zadowolony", "zmęczony", "optymistyczny"]
      }
    ]

    const allRecordings = []
    
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const currentDate = new Date(weekStartDate)
      currentDate.setDate(currentDate.getDate() + dayOffset)
      const dateString = currentDate.toISOString().split('T')[0]
      const dayTemplate = weekTemplates[dayOffset]
      
      // Generate 2-4 recordings per day
      const numRecordings = Math.floor(Math.random() * 3) + 2
      
      for (let i = 0; i < numRecordings; i++) {
        const hour = 8 + Math.floor(Math.random() * 12) // 8-19
        const minute = Math.floor(Math.random() * 60)
        const recordingTime = new Date(currentDate)
        recordingTime.setHours(hour, minute, 0, 0)
        
        const moodScore = dayTemplate.mood_range[0] + 
          Math.floor(Math.random() * (dayTemplate.mood_range[1] - dayTemplate.mood_range[0] + 1))
        
        const recording = {
          filename: `mock-week-${dateString}-${i + 1}.wav`,
          blob_url: `https://example.com/mock-week-audio-${dateString}-${i + 1}.wav`,
          transcription: `Mock nagranie z dnia ${dateString}. ${dayTemplate.topics.join(', ')} - ${dayTemplate.emotions[0]}.`,
          corrected_text: `Mock nagranie z dnia ${dateString}. Tematy: ${dayTemplate.topics.join(', ')}.`,
          summary: `Nagranie dotyczące ${dayTemplate.topics[0]} z nastroju ${moodScore}/10.`,
          topics: JSON.stringify(dayTemplate.topics),
          follow_up_questions: JSON.stringify([
            `Jak oceniasz dzisiejszy postęp w ${dayTemplate.topics[0]}?`,
            `Co możesz poprawić w ${dayTemplate.topics[1]}?`,
            `Jakie są Twoje plany na jutro?`
          ]),
          action_items: JSON.stringify([
            `Kontynuować pracę nad ${dayTemplate.topics[0]}`,
            `Przeanalizować ${dayTemplate.topics[1]}`,
            `Zaplanować następne kroki`
          ]),
          insights: JSON.stringify([
            `${dayTemplate.emotions[0]} nastrój`,
            `Koncentracja na ${dayTemplate.topics[0]}`,
            `Potrzeba ${dayTemplate.topics[2]}`
          ]),
          location: Math.random() > 0.5 ? "Warsaw, Poland" : "Home",
          recorded_at: recordingTime.toISOString(),
          created_at: recordingTime.toISOString(),
          
          // Mood analysis
          recorded_date: dateString,
          recorded_time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`,
          mood_score: moodScore,
          emotional_tags: JSON.stringify(dayTemplate.emotions.slice(0, 2)),
          main_topics: JSON.stringify(dayTemplate.topics.slice(0, 3)),
          importance_level: Math.floor(Math.random() * 3) + 2 // 2-4
        }
        
        allRecordings.push(recording)
      }
    }

    // Insert all recordings
    const { data, error } = await supabase
      .from('voice_notes')
      .insert(allRecordings)
      .select('id')

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    console.log(`✅ Generated ${allRecordings.length} mock recordings for week ${weekStartDate}`)

    return NextResponse.json({
      success: true,
      week_start: weekStartDate,
      total_recordings: allRecordings.length,
      recordings: data,
      message: `Successfully generated ${allRecordings.length} mock recordings for the week`
    })

  } catch (error: any) {
    console.error('❌ Error generating mock week data (direct):', error)
    return NextResponse.json({
      error: 'Failed to generate mock week data',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}
