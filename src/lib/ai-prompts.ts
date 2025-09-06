// =============================================================================
// AI PROMPTS CONFIGURATION - EDIT THESE TO CUSTOMIZE AI BEHAVIOR
// =============================================================================

export const AI_PROMPTS = {
  
  // TRANSCRIPTION PROMPT (Gemini 2.5 Flash)
  TRANSCRIPTION: (metadata: { date?: string; location?: string }) => `
Przeanalizuj to nagranie audio w języku polskim i wykonaj następujące zadania:

1. TRANSKRYPCJA: Przepisz DOKŁADNIE co zostało powiedziane (zachowaj oryginalny język)
2. POPRAWIONA WERSJA: Popraw błędy, interpunkcję i formatowanie  
3. TEMATY: Wyodrębnij 3-5 głównych tematów/tagów

Metadane nagrania:
- Data: ${metadata.date || 'brak'}
- Lokalizacja: ${metadata.location || 'brak'}

WAŻNE: Transkrybuj dokładnie to co słyszysz w nagraniu, nie wymyślaj treści!

Odpowiedz w formacie JSON:
{
  "transcription": "dokładna transkrypcja tego co usłyszałeś",
  "corrected_text": "poprawiona wersja z interpunkcją",
  "topics": ["temat1", "temat2", "temat3"]
}`,

  // CONTENT ANALYSIS PROMPT (Gemini 2.5 Flash)
  ANALYSIS: (transcription: string, metadata: { date?: string; location?: string }) => `
Przeanalizuj następującą transkrypcję notatki głosowej i wykonaj zaawansowaną analizę:

TRANSKRYPCJA:
"${transcription}"

KONTEKST:
- Data: ${metadata.date || 'nieznana'}
- Lokalizacja: ${metadata.location || 'nieznana'}

ZADANIA DO WYKONANIA:
1. PODSUMOWANIE: Stwórz zwięzłe, ale kompletne podsumowanie (2-3 zdania)
2. PYTANIA UZUPEŁNIAJĄCE: Zaproponuj 3 inteligentne pytania, które pomogą doprecyzować lub rozwinąć temat
3. ZADANIA DO WYKONANIA: Wyodrębnij konkretne akcje/TODO jeśli są wspomniane
4. KLUCZOWE WNIOSKI: Wyciągnij najważniejsze wnioski lub insights z notatki

Odpowiedz w formacie JSON:
{
  "summary": "profesjonalne podsumowanie treści",
  "follow_up_questions": [
    "Przemyślane pytanie 1?",
    "Przemyślane pytanie 2?",
    "Przemyślane pytanie 3?"
  ],
  "action_items": ["konkretna akcja 1", "konkretna akcja 2"],
  "insights": ["ważny wniosek 1", "ważny wniosek 2"]
}`,

  // MOOD ANALYSIS PROMPT (Gemini 2.5 Flash)
  MOOD_ANALYSIS: (transcription: string) => `
Przeanalizuj nastrój i emocje w następującej transkrypcji:

"${transcription}"

ZADANIA:
1. OCENA NASTROJU: Oceń nastrój na skali 1-10 (1=bardzo smutny, 10=bardzo szczęśliwy)
2. TAGI EMOCJONALNE: Wybierz maksymalnie 3 najważniejsze emocje/stany
3. GŁÓWNE TEMATY: Wyodrębnij maksymalnie 5 głównych tematów
4. WAŻNOŚĆ: Oceń ważność tej notatki na skali 1-5 (1=mało ważne, 5=bardzo ważne)

Odpowiedz w formacie JSON:
{
  "mood_score": 7,
  "emotional_tags": ["spokojny", "zamyślony", "optymistyczny"],
  "main_topics": ["praca", "rodzina", "zdrowie", "cele", "refleksja"],
  "importance_level": 3
}`,

  // DAILY SUMMARY PROMPT (Gemini 2.5 Pro)
  DAILY_SUMMARY: (transcriptions: string, questions: string[], date: string) => `
Stwórz dzienne podsumowanie na podstawie notatek głosowych z dnia ${date}.

WSZYSTKIE TRANSKRYPCJE Z DNIA:
${transcriptions}

DOSTĘPNE PYTANIA Z NOTATEK:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

ZADANIA:
1. PODSUMOWANIE: Napisz podsumowanie dnia w stylu gazety (3-4 zdania, 3 osoba)
   Przykład: "Użytkownik spędził dzień na..."
   
2. WYBIERZ PYTANIA: Wybierz 3 najciekawsze pytania z listy dostępnych pytań
   
3. SUGESTIE NA JUTRO: Zaproponuj 3 konkretne, wykonalne akcje na następny dzień
   
4. OGÓLNY NASTRÓJ: Oceń średni nastrój dnia (1-10)

Odpowiedz w formacie JSON:
{
  "summary_text": "Podsumowanie dnia w stylu gazety...",
  "overall_mood": 7,
  "selected_questions": ["Pytanie 1?", "Pytanie 2?", "Pytanie 3?"],
  "next_day_suggestions": ["Konkretna akcja 1", "Konkretna akcja 2", "Konkretna akcja 3"]
}`,

  // WEEKLY SUMMARY PROMPT (Gemini 2.5 Pro)
  WEEKLY_SUMMARY: (weekData: string, weekStart: string, weekEnd: string) => `
Stwórz tygodniowe podsumowanie-dziennik dla okresu ${weekStart} - ${weekEnd}.

DANE Z CAŁEGO TYGODNIA:
${weekData}

ZADANIA:
1. DZIENNIK: Stwórz strukturalny dziennik w formie listy chronologicznej
   Format: "**Data, godzina**: Krótki opis wydarzeń i myśli"
   Styl: Jak dziennik osobisty, ale w 3. osobie
   
2. CYTAT MOTYWACYJNY: Napisz oryginalny cytat motywacyjny związany z tygodniem
   Podpisz jako "Artificial Wisdom"
   
3. KONTEKST CYTATU: Wyjaśnij dlaczego ten cytat pasuje do tego tygodnia

Odpowiedz w formacie JSON:
{
  "diary_entries": [
    {
      "date": "2025-09-06",
      "time": "09:00",
      "entry": "Użytkownik rozpoczął dzień..."
    }
  ],
  "motivational_quote": "Oryginalny cytat motywacyjny...",
  "quote_context": "Ten cytat pasuje do tego tygodnia bo..."
}`

} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getPrompt(type: keyof typeof AI_PROMPTS, ...args: any[]): string {
  const promptFunction = AI_PROMPTS[type] as any
  return promptFunction(...args)
}

// Log all prompts for debugging
export function logAllPrompts() {
  console.log('📝 Available AI Prompts:')
  Object.keys(AI_PROMPTS).forEach(key => {
    console.log(`  - ${key}`)
  })
}

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
PRZYKŁAD UŻYCIA:

import { getPrompt } from '@/lib/ai-prompts'

// Transcription
const transcriptionPrompt = getPrompt('TRANSCRIPTION', { 
  date: '2025-09-06', 
  location: 'Warsaw' 
})

// Analysis  
const analysisPrompt = getPrompt('ANALYSIS', 
  'Transkrypcja tekstu...', 
  { date: '2025-09-06', location: 'Warsaw' }
)

// Mood Analysis
const moodPrompt = getPrompt('MOOD_ANALYSIS', 'Transkrypcja tekstu...')

// Daily Summary
const dailyPrompt = getPrompt('DAILY_SUMMARY', 
  'Wszystkie transkrypcje...', 
  ['Pytanie 1?', 'Pytanie 2?'], 
  '2025-09-06'
)

// Weekly Summary
const weeklyPrompt = getPrompt('WEEKLY_SUMMARY', 
  'Dane z tygodnia...', 
  '2025-09-02', 
  '2025-09-08'
)
*/
