# Product Requirements Document (PRD)
# NTKR - Personal Voice Journal with AI Insights

## 1. Executive Summary

NTKR to aplikacja do osobistego dziennika głosowego, która przekształca nagrania audio w strukturyzowane wpisy dziennika z AI-powered insights. W przeciwieństwie do typowych aplikacji do notatek, NTKR koncentruje się na aspekcie terapeutycznym i samorozwoju, analizując nastroje użytkownika i dostarczając codzienne oraz tygodniowe podsumowania.

## 2. Product Vision

### 2.1 Problem Statement
Ludzie często nagrywają swoje myśli, ale rzadko wracają do nich lub wyciągają z nich wnioski. Brakuje narzędzia, które pomoże im zrozumieć swoje wzorce myślowe, nastroje i postępy w życiu osobistym.

### 2.2 Solution
Aplikacja, która:
- Automatycznie transkrybuje i analizuje nagrania głosowe
- Tworzy strukturyzowane podsumowania dzienne i tygodniowe
- Śledzi nastroje i emocje użytkownika
- Dostarcza spersonalizowane pytania do refleksji
- Działa jak osobisty dziennik z AI jako asystentem

## 3. Core Features

### 3.1 Voice Recording & Processing (EXISTING - TO ENHANCE)
- **Nagrywanie przez Apple Shortcuts** (już działa)
- **Automatyczna transkrypcja** (już działa)
- **Rozszerzona analiza AI**:
  - Mood detection (1-10 scale)
  - Emotional tags extraction
  - Topic categorization
  - Importance level assessment

### 3.2 Daily Summary (NEW)
**Generowane o 20:00 każdego dnia**

#### Zawartość:
- Krótkie podsumowanie dnia w stylu gazety (2-3 zdania)
- Overall mood score
- 3 wybrane pytania do refleksji (wybrane z pytań wygenerowanych dla każdego nagrania)
- 3 konkretne sugestie na następny dzień

#### Przykłady Daily Summary:

**Przykład 1 - Dzień produktywny:**
```
Użytkownik miał bardzo produktywny dzień - ukończył projekt dla klienta i odbył ważną rozmowę z zespołem. 
Czuł się zmotywowany, choć pojawiły się momenty stresu związane z deadline'ami.

Nastrój dnia: 7/10 ☺️

Pytania do przemyślenia:
1. Jak możesz lepiej zarządzać stresem podczas intensywnych projektów?
2. Co sprawiło, że rozmowa z zespołem była tak efektywna?
3. Jakie lekcje wyniosłeś z dzisiejszego dnia?

Sugestie na jutro:
- Zaplanuj 15 minut przerwy między spotkaniami
- Skontaktuj się z Markiem w sprawie nowego projektu
- Rozpocznij dzień od krótkiej medytacji
```

**Przykład 2 - Dzień stresujący:**
```
Użytkownik był dziś bardzo zestresowany w związku z pracą, ale udało mu się zrelaksować wieczorem.
Spotkał się z przyjacielem, co poprawiło jego nastrój.

Nastrój dnia: 5/10 😐

Pytania do przemyślenia:
1. Co konkretnie wywołuje największy stres w Twojej pracy?
2. Jakie techniki relaksacyjne działają dla Ciebie najlepiej?
3. Czy możesz częściej planować spotkania z przyjaciółmi?

Sugestie na jutro:
- Zacznij dzień od 10 minut oddychania
- Podziel duże zadania na mniejsze kroki
- Zaplanuj przerwę na lunch poza biurem
```

**Przykład 3 - Dzień refleksyjny:**
```
Użytkownik spędził dzień na rozmyślaniach o przyszłości i planowaniu kolejnych kroków w karierze.
Rozmawiał z mamą o jej zdrowiu, co wywołało mieszane uczucia.

Nastrój dnia: 6/10 🤔

Pytania do przemyślenia:
1. Jakie są Twoje prawdziwe priorytety w życiu?
2. Jak możesz lepiej wspierać rodzinę zachowując balans?
3. Czy Twoja obecna ścieżka kariery jest zgodna z Twoimi wartościami?

Sugestie na jutro:
- Zapisz 3 najważniejsze cele na najbliższy miesiąc
- Zadzwoń do mamy sprawdzić jak się czuje
- Poświęć 30 minut na planowanie kariery
```

### 3.3 Weekly Summary (NEW)
**Generowane w piątki o 18:00**

#### Zawartość:
- Chronologiczna lista wszystkich ważnych wydarzeń tygodnia
- Format dziennika z timestampami
- Każdy wpis = jedno zdanie rozbudowane o szczegóły
- Motywacyjny cytat dopasowany do tygodnia użytkownika

#### Przykłady Weekly Summary:

**Przykład 1 - Tydzień produktywny:**
```
TYDZIEŃ UŻYTKOWNIKA: 26.08 - 30.08.2025

**Poniedziałek, 26.08.2025 o 08:30**
Użytkownik rozpoczął dzień od 20-minutowej medytacji, która pomogła mu zebrać myśli przed ważną prezentacją dla inwestorów.

**Poniedziałek, 26.08.2025 o 14:15**
Prezentacja przebiegła świetnie - inwestorzy byli zainteresowani, szczególnie modułem AI do analizy nastrojów.

**Wtorek, 27.08.2025 o 10:00**
Spotkanie z zespołem ujawniło kilka problemów technicznych, które trzeba rozwiązać przed końcem sprintu.

**Środa, 28.08.2025 o 16:45**
Długa rozmowa z mamą o jej zdrowiu - użytkownik czuł się lepiej wiedząc, że może ją wspierać.

**Czwartek, 29.08.2025 o 09:00**
Otrzymał feedback od klienta - konieczne przeprojektowanie UI, ale ogólnie klient zadowolony z postępów.

**Piątek, 30.08.2025 o 11:30**
Zamknął sprint z sukcesem, zespół świętował ukończenie wszystkich zadań na czas.

---
"Każdy mały krok naprzód buduje fundament pod większy sukces. Twoja konsekwencja w tym tygodniu pokazuje, że jesteś na właściwej drodze."
- Artificial Wisdom
```

**Przykład 2 - Tydzień trudny:**
```
TYDZIEŃ UŻYTKOWNIKA: 25.12 - 29.12.2023

**Poniedziałek, 25.12.2023 o 08:00**
Użytkownik medytował przez 10 minut, co pomogło mu oczyścić umysł i wpadł na pomysł nowego projektu o systemie automatyzacji dla małych firm.

**Wtorek, 26.12.2023 o 09:00**
Otrzymał złe wieści od inwestora - stracili kontrakt, ponieważ nie dopełnili wszystkich wymagań klienta dotyczących dokumentacji.

**Wtorek, 26.12.2023 o 15:30**
Długa rozmowa z zespołem o tym, jak uniknąć podobnych błędów - ustalili nową procedurę weryfikacji dokumentów.

**Środa, 27.12.2023 o 10:00**
Rozmawiał z mamą przez telefon, była w złym nastroju z powodu problemów zdrowotnych, próbował ją pocieszyć i umówił wizytę u lekarza.

**Środa, 27.12.2023 o 14:00**
Planował wyjazd do Grecji na regenerację - znalazł świetną ofertę na Booking.com, hotel przy plaży za połowę ceny.

**Czwartek, 28.12.2023 o 12:00**
Był bardzo zestresowany sytuacją w pracy, ale wieczorne spotkanie z przyjaciółmi pomogło mu się zrelaksować.

**Piątek, 29.12.2023 o 16:00**
Podsumował tydzień i wyciągnął wnioski - każda porażka to lekcja, która czyni nas silniejszymi.

---
"Najtrudniejsze momenty uczą nas najwięcej. To w ciemności odkrywamy swoją wewnętrzną siłę i zdolność do podnoszenia się."
- Artificial Wisdom
```

**Przykład 3 - Tydzień zrównoważony:**
```
TYDZIEŃ UŻYTKOWNIKA: 01.04 - 05.04.2025

**Poniedziałek, 01.04.2025 o 07:30**
Użytkownik zaczął tydzień od porannego biegu w parku, czuł się pełen energii i gotowy na nowe wyzwania.

**Poniedziałek, 01.04.2025 o 10:00**
Spotkanie z nowym klientem poszło lepiej niż oczekiwał - podpisali wstępną umowę na projekt wartości 50 tysięcy.

**Wtorek, 02.04.2025 o 14:00**
Pracował nad prototypem nowej aplikacji, był w stanie flow przez 4 godziny bez przerwy.

**Środa, 03.04.2025 o 12:00**
Lunch z mentorem przyniósł cenne wskazówki dotyczące rozwoju biznesu i zarządzania zespołem.

**Środa, 03.04.2025 o 18:00**
Wieczorna joga pomogła mu się wyciszyć po intensywnym dniu, czuł harmonię między ciałem a umysłem.

**Czwartek, 04.04.2025 o 09:00**
Przeprowadził warsztaty dla zespołu na temat nowych technologii AI, wszyscy byli zaangażowani i zadawali dużo pytań.

**Piątek, 05.04.2025 o 15:00**
Zakończył tydzień wcześniej i spędził popołudnie z rodziną w ogrodzie, grillując i ciesząc się słońcem.

---
"Prawdziwy sukces to znalezienie równowagi między ambicją a spokojem, między pracą a życiem, między dawaniem a otrzymywaniem."
- Artificial Wisdom
```

### 3.4 Summaries Dashboard (NEW)
**Lokalizacja**: `/summaries`

#### Sekcje:
1. **Today's Summary** - podsumowanie dzisiejszego dnia (jeśli dostępne)
2. **This Week** - bieżący tydzień w formie timeline
3. **Previous Summaries** - archiwum poprzednich podsumowań
4. **Mood Trends** - wykres nastrojów z ostatnich 30 dni

## 4. Database Schema

### 4.1 Enhanced `voice_notes` table
```sql
CREATE TABLE voice_notes (
  -- Existing columns
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255),
  blob_url TEXT,
  transcription TEXT,
  corrected_text TEXT,
  summary TEXT,
  topics JSONB,
  follow_up_questions JSONB,
  action_items JSONB,
  insights JSONB,
  location TEXT,
  recorded_at VARCHAR(100),
  created_at TIMESTAMP,
  
  -- New columns
  recorded_date DATE GENERATED ALWAYS AS (DATE(recorded_at)) STORED,
  recorded_time TIME GENERATED ALWAYS AS (TIME(recorded_at)) STORED,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  emotional_tags JSONB, -- ["stressed", "excited", "thoughtful"]
  main_topics JSONB, -- ["work", "family", "health"]
  importance_level INTEGER CHECK (importance_level >= 1 AND importance_level <= 5)
);
```

### 4.2 New `daily_summaries` table
```sql
CREATE TABLE daily_summaries (
  id SERIAL PRIMARY KEY,
  summary_date DATE UNIQUE NOT NULL,
  total_recordings INTEGER DEFAULT 0,
  overall_mood DECIMAL(3,1), -- Average mood score
  key_events JSONB, -- Array of main events
  summary_text TEXT,
  selected_questions JSONB, -- 3 questions selected from recordings
  next_day_suggestions JSONB, -- 3 concrete suggestions
  mood_distribution JSONB, -- {"morning": 6, "afternoon": 8, "evening": 7}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_daily_summaries_date ON daily_summaries(summary_date DESC);
```

### 4.3 New `weekly_summaries` table
```sql
CREATE TABLE weekly_summaries (
  id SERIAL PRIMARY KEY,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  diary_entries JSONB, -- Structured timeline entries
  key_themes JSONB, -- Main themes of the week
  mood_trend JSONB, -- Daily mood progression
  total_recordings INTEGER,
  motivational_quote TEXT,
  quote_context TEXT, -- Why this quote was chosen
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(week_start, week_end)
);

CREATE INDEX idx_weekly_summaries_dates ON weekly_summaries(week_start DESC);
```

## 5. API Endpoints

### 5.1 Existing (Enhanced)
- `POST /api/voice-notes` - Enhanced to include mood analysis

### 5.2 New Endpoints

#### Daily Summaries
- `GET /api/summaries/daily/:date` - Get daily summary for specific date
- `POST /api/summaries/daily/generate` - Generate daily summary (manual trigger)
- `GET /api/summaries/daily/range?from=DATE&to=DATE` - Get summaries for date range

#### Weekly Summaries  
- `GET /api/summaries/weekly/:week` - Get weekly summary
- `POST /api/summaries/weekly/generate` - Generate weekly summary (manual trigger)
- `GET /api/summaries/weekly/latest` - Get latest weekly summary

#### Analytics
- `GET /api/analytics/mood-trends?days=30` - Get mood trends
- `GET /api/analytics/topics?days=30` - Get most common topics

## 6. Frontend Structure

### 6.1 Updated Navigation
```
/                   - Home/Dashboard
/notes              - All recordings (existing, enhanced)
/summaries          - Daily & Weekly summaries hub
/summaries/daily    - Daily summaries archive
/summaries/weekly   - Weekly summaries archive
/analytics          - Mood trends & insights
```

### 6.2 New Pages

#### `/summaries` - Main Summaries Dashboard (Minimalist UI)
```
TODAY'S SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
30.08.2025 | Mood: 7/10

[Summary text...]

Questions:
1. ...
2. ...
3. ...

Tomorrow:
• ...
• ...
• ...


THIS WEEK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mon  Tue  Wed  Thu  Fri
 6    7    8    7    8

View Full Weekly Summary →


PREVIOUS SUMMARIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
29.08.2025 - Mood: 6/10
28.08.2025 - Mood: 8/10
27.08.2025 - Mood: 7/10

View All →
```

#### UI Design Principles:
- **No shadows, no rounded corners, no gradients**
- **Simple lines and borders (━━━)**
- **Monospace or system font only**
- **Black or grey text on white background**
- **Different tones of grey for elements, don't make it to high contrast**
- **Minimal spacing**
- **No decorative elements**
- **Simple rectangular buttons, small, all caps**
- **Focus on content, not design**

## 7. Testing Strategy

### 7.1 Mock Data Structure
```javascript
// Mock recordings for testing
const mockRecordings = [
  {
    date: "2025-08-30",
    time: "08:00",
    transcription: "Dzisiaj rano czuję się zmotywowany...",
    mood: 8,
    emotional_tags: ["motivated", "energetic"],
    topics: ["work", "goals"],
    importance: 4
  },
  // ... more mock recordings
];
```

### 7.2 Test Endpoints
- `POST /api/test/mock-day` - Insert mock recordings for a day
- `POST /api/test/mock-week` - Insert mock recordings for entire week
- `POST /api/test/generate-summaries` - Force generate all summaries
- `DELETE /api/test/clear-test-data` - Clear all test data

### 7.3 Test Scenarios
1. **Single Day Flow**: Add 3-5 recordings → Generate daily summary
2. **Weekly Flow**: Add recordings for 5 days → Generate weekly summary
3. **Mood Variations**: Test with different mood patterns
4. **Edge Cases**: No recordings, single recording, very long recordings

## 8. Implementation Phases

### Phase 1: Foundation (Current Sprint)
- [ ] Extend voice_notes table with mood fields
- [ ] Create daily_summaries table
- [ ] Create weekly_summaries table
- [ ] Build `/api/summaries/daily/generate` endpoint
- [ ] Build `/api/summaries/weekly/generate` endpoint
- [ ] Create `/summaries` dashboard page
- [ ] Add mock data generation tools

### Phase 2: Enhancement
- [ ] Mood trends visualization
- [ ] Topic analytics
- [ ] Archive pages for summaries

## 9. AI Prompts Management

### 9.1 Prompts Organization Structure
```javascript
// lib/prompts/index.ts
export const AI_PROMPTS = {
  // Podstawowa analiza nagrania
  VOICE_NOTE_ANALYSIS: {
    name: "Voice Note Analysis",
    description: "Analizuje pojedyncze nagranie głosowe",
    prompt: `...`,
    output_schema: TranscriptionSchema
  },
  
  // Analiza nastroju
  MOOD_DETECTION: {
    name: "Mood Detection",
    description: "Wykrywa nastrój użytkownika z transkrypcji",
    prompt: `...`,
    output_schema: MoodSchema
  },
  
  // Podsumowanie dzienne
  DAILY_SUMMARY: {
    name: "Daily Summary",
    description: "Tworzy podsumowanie dnia z wszystkich nagrań",
    prompt: `...`,
    output_schema: DailySummarySchema
  },
  
  // Podsumowanie tygodniowe
  WEEKLY_SUMMARY: {
    name: "Weekly Summary",
    description: "Tworzy dziennik tygodnia",
    prompt: `...`,
    output_schema: WeeklySummarySchema
  }
}
```

### 9.2 Daily Summary Prompt
```javascript
DAILY_SUMMARY: {
  name: "Daily Summary",
  description: "Generuje podsumowanie dnia na podstawie wszystkich nagrań",
  prompt: `
    Jesteś osobistym asystentem AI analizującym dzień użytkownika.
    Przeanalizuj wszystkie nagrania głosowe z dnia [DATE].
    
    ZADANIE:
    1. Stwórz krótkie podsumowanie dnia (2-3 zdania) w trzeciej osobie
    2. Określ ogólny nastrój dnia (1-10)
    3. Wybierz 3 najważniejsze pytania do refleksji
    4. Zaproponuj 3 konkretne działania na jutro
    
    KONTEKST:
    - Liczba nagrań: [COUNT]
    - Transkrypcje: [TRANSCRIPTIONS]
    - Wygenerowane pytania: [QUESTIONS]
    - Lokalizacja: [LOCATION]
    
    WAŻNE:
    - Opis dnia pisz w trzeciej osobie (użytkownik, on/ona)
    - Pytania kieruj bezpośrednio do użytkownika (ty, Twoje, Ciebie)
    - Sugestie w trybie rozkazującym (zrób, zaplanuj, skontaktuj się)
    - Bądź konkretny i zwięzły
    
    Zwróć JSON zgodny ze schematem.
  `,
  output_schema: {
    summary_text: "string",
    overall_mood: "number (1-10)",
    selected_questions: ["string", "string", "string"],
    next_day_suggestions: ["string", "string", "string"]
  }
}
```

### 9.3 Weekly Summary Prompt
```javascript
WEEKLY_SUMMARY: {
  name: "Weekly Summary",
  description: "Tworzy strukturalny dziennik tygodnia",
  prompt: `
    Jesteś osobistym biografem AI tworzącym dziennik tygodnia.
    Stwórz podsumowanie tygodnia od [START_DATE] do [END_DATE].
    
    ZADANIE:
    1. Stwórz chronologiczne wpisy dziennika (jeden na każde ważne wydarzenie)
    2. Każdy wpis = jedno rozbudowane zdanie w trzeciej osobie
    3. Dodaj motywacyjny cytat pasujący do tygodnia
    4. Wyjaśnij dlaczego ten cytat jest odpowiedni
    
    KONTEKST:
    - Podsumowania dzienne: [DAILY_SUMMARIES]
    - Wszystkie nagrania: [RECORDINGS]
    - Nastroje: [MOOD_TRENDS]
    
    FORMAT WPISU:
    **[Dzień], [Data] o [Godzina]**
    [Zdanie opisujące wydarzenie w trzeciej osobie]
    
    CYTAT:
    - Nie szukaj autora, stwórz własne słowa
    - Podpisz jako "Artificial Wisdom"
    - Dopasuj do kontekstu tygodnia użytkownika
    
    Zwróć JSON zgodny ze schematem.
  `,
  output_schema: {
    diary_entries: [{
      date: "string",
      time: "string",
      entry: "string"
    }],
    motivational_quote: "string",
    quote_context: "string"
  }
}
```

### 9.4 Mood Detection Prompt
```javascript
MOOD_DETECTION: {
  name: "Mood Detection",
  description: "Analizuje nastrój z transkrypcji",
  prompt: `
    Przeanalizuj nastrój użytkownika na podstawie transkrypcji.
    
    TRANSKRYPCJA: [TRANSCRIPTION]
    
    Określ:
    1. Mood score (1-10, gdzie 1=bardzo zły, 10=świetny)
    2. Emotional tags (max 3)
    3. Główny temat emocjonalny
    
    Zwróć JSON zgodny ze schematem.
  `,
  output_schema: {
    mood_score: "number",
    emotional_tags: ["string"],
    main_emotional_theme: "string"
  }
}
```

---

## Appendix A: Sample User Journey

1. **Morning**: User records thought about upcoming meeting
2. **Afternoon**: Records reflection on meeting outcome
3. **Evening**: Records personal thoughts about day
4. **8 PM**: Daily summary generated and available
5. **Next morning**: User reviews summary and suggestions
6. **Friday evening**: Weekly summary available for reflection
7. **Weekend**: User reflects on week using diary entries

## Appendix B: Technical Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Vercel Functions
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 2.5 Flash or Pro
- **Storage**: Vercel Blob Storage
- **Hosting**: Vercel
- **Audio Input**: Apple Shortcuts

---

*Document Version: 1.0*
*Last Updated: 30.08.2025*
*Author: NTKR Development Team*
