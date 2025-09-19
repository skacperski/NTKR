# 🎙️ NTKR - Personal Voice Journal

> **Personal Voice Journal with AI Insights**  
> Aplikacja do nagrywania notatek głosowych z iPhone przez Apple Shortcuts z automatyczną transkrypcją i analizą AI.

## ✨ Funkcje

- 📱 **Apple Shortcuts Integration** - nagrywanie jednym tapnięciem
- 🤖 **3-fazowa analiza AI** z Google Gemini:
  - Transkrypcja i korekta tekstu
  - Analiza treści i wnioski  
  - Analiza nastroju i emocji
- 📊 **Automatyczne podsumowania**:
  - Dzienne podsumowania z pytaniami do refleksji
  - Tygodniowe dzienniki z motywacyjnymi cytatami
- 🎯 **Minimalistyczny UI** - skupienie na treści
- ☁️ **Serverless Architecture** - zero DevOps

## 🚀 Quick Start

### 1. Instalacja
```bash
git clone <repo-url>
cd NTKR
npm install
```

### 2. Konfiguracja
```bash
cp env.example .env.local
# Edytuj .env.local i dodaj:
```

**Wymagane zmienne w `.env.local`:**

⚠️ **BEZPIECZEŃSTWO:** Nigdy nie commituj rzeczywistych kluczy API do git!

```bash
# Google AI API Key (wymagany - uzyskaj z https://aistudio.google.com/app/apikey)
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_google_ai_studio_key_here

# Authentication (wymagany dla bezpieczeństwa - użyj silnych, unikalnych danych)
AUTH_USERNAME=your_secure_username
AUTH_PASSWORD=your_very_secure_password

# Supabase (jeśli używasz własnej instancji)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

🔒 **Wskazówki bezpieczeństwa:**
- Użyj silnych, unikalnych haseł
- Nigdy nie udostępniaj swoich kluczy API
- Regularnie rotuj klucze API
- Sprawdź usage w Google Cloud Console

### 3. Uruchomienie
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`

**🔐 Logowanie:**
Przy pierwszym wejściu przeglądarka poprosi o username i hasło (HTTP Basic Auth).

## 🏗️ Architektura

```
📱 iPhone Shortcuts
       ↓
🌐 Next.js API Routes (/api/voice-notes)
       ↓
☁️ Vercel Blob (storage) + Supabase (database)
       ↓
🤖 Google Gemini AI (analysis)
       ↓
📊 Next.js Frontend (/notes, /summaries)
```

## 📁 Struktura Projektu

```
NTKR/
├── src/                          # Główny kod źródłowy
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API endpoints
│   │   │   ├── voice-notes/      # Nagrania głosowe
│   │   │   ├── summaries/        # Podsumowania
│   │   │   └── dev-tools/        # Narzędzia deweloperskie
│   │   ├── notes/                # Strona notatek
│   │   ├── summaries/            # Dashboard podsumowań
│   │   └── page.tsx              # Strona główna
│   ├── components/               # Komponenty UI
│   │   └── ui/                   # Podstawowe komponenty
│   ├── lib/                      # Biblioteki i narzędzia
│   │   ├── ai-models.ts          # Konfiguracja AI
│   │   ├── database.ts           # Połączenie z bazą
│   │   └── utils.ts              # Funkcje pomocnicze
│   └── types/                    # Definicje typów TypeScript
├── config/                       # Pliki konfiguracyjne
├── docs/                         # Dokumentacja
└── README.md                     # Ten plik
```

### 🤔 Dlaczego `src/app/` zamiast `app/`?

W Next.js 14 można używać **ALBO** `app/` **ALBO** `src/app/`. Wybrałem `src/app/` bo:
- ✅ Lepsze oddzielenie kodu źródłowego od plików konfiguracyjnych
- ✅ Wszystkie źródła w jednym folderze `src/`
- ✅ Łatwiejsze zarządzanie w większych projektach
- ✅ Zgodne z konwencjami innych frameworków

## 🛠️ Stack Technologiczny

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Serverless Functions
- **Database**: Supabase (PostgreSQL) + MCP integration
- **AI**: Google Gemini 2.5 (Flash & Pro)
- **Storage**: Vercel Blob
- **Hosting**: Vercel

## 📊 API Endpoints

### Voice Notes
- `POST /api/voice-notes` - Upload i proces audio
- `GET /api/voice-notes` - Info o API

### Summaries
- `GET /api/summaries/daily/[date]` - Dzienne podsumowanie
- `POST /api/summaries/daily/generate` - Generuj dzienne
- `GET /api/summaries/weekly/[week]` - Tygodniowe podsumowanie  
- `POST /api/summaries/weekly/generate` - Generuj tygodniowe
- `GET /api/summaries/all` - Wszystkie podsumowania

#### 🤔 Dlaczego `[date]` w nawiasach?

To są **Dynamic Routes** w Next.js App Router:
- `[date]` = parametr dynamiczny w URL
- `/api/summaries/daily/2025-01-15` → `params.date = "2025-01-15"`
- Nawiasy kwadratowe to składnia Next.js dla parametrów URL

### Development Tools
- `GET /api/dev-tools` - Lista narzędzi deweloperskich
- `POST /api/dev-tools/mock-day` - Generuj mock data dla dnia
- `POST /api/dev-tools/mock-week` - Generuj mock data dla tygodnia
- `DELETE /api/dev-tools/clear-test-data` - Wyczyść dane testowe

## 📱 Apple Shortcuts Setup

1. Otwórz **Shortcuts** na iPhone
2. Stwórz nowy shortcut z akcjami:
   - **Record Audio**
   - **Get Current Location** 
   - **Get Contents of URL** (POST)

3. Konfiguracja URL:
   - URL: `https://your-app.vercel.app/api/voice-notes`
   - Method: `POST`
   - Request Body: `Form`
   - Pola:
     - `message`: [Recorded Audio]
     - `timestamp`: [Current Date]
     - `location`: [Current Location Address]

## 🔒 Security

### API Key Management
- **NIGDY** nie commituj plików `.env*` do git
- Użyj silnych, unikalnych haseł dla `AUTH_USERNAME` i `AUTH_PASSWORD`
- Regularnie monitoruj usage swojego Google AI API key
- W przypadku wycieku klucza, natychmiast go zregeneruj

### Deployment Security
- Environment variables są bezpiecznie przechowywane w Vercel
- Aplikacja używa HTTP Basic Auth dla prostej ochrony
- Wszystkie wrażliwe dane są szyfrowane w bazie danych

## 🔧 Development

```bash
# Development server
npm run dev

# Build for production  
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## 🔐 Bezpieczeństwo

### Authentication
Aplikacja używa **HTTP Basic Auth** do ochrony prywatnych danych:
- ✅ **API endpoints otwarte** - dla Apple Shortcuts
- ✅ **Web interface chroniony** - wymaga logowania
- ✅ **Brak hardcoded credentials** - tylko w zmiennych środowiskowych

**Konfiguracja w `.env.local`:**
```bash
AUTH_USERNAME=twoj_username
AUTH_PASSWORD=twoje_haslo
```

**⚠️ WAŻNE**: Nigdy nie commituj `.env.local` do repozytorium!

## 💾 Database Management

Baza danych jest zarządzana przez **MCP Supabase integration**:
- ✅ Brak plików .sql w projekcie
- ✅ Automatyczne zarządzanie schematem
- ✅ Bezpośrednie operacje na bazie przez MCP
- ✅ Migracje wykonywane programowo

### Tabele:
- `voice_notes` - Nagrania i analiza AI
- `daily_summaries` - Dzienne podsumowania
- `weekly_summaries` - Tygodniowe dzienniki

## 🤖 AI Prompts

Wszystkie prompty AI można łatwo edytować w jednym pliku:
**`src/lib/ai-prompts.ts`**

Dostępne prompty:
- `TRANSCRIPTION` - transkrypcja nagrań audio
- `ANALYSIS` - analiza treści i wnioski
- `MOOD_ANALYSIS` - analiza nastroju i emocji
- `DAILY_SUMMARY` - dzienne podsumowania
- `WEEKLY_SUMMARY` - tygodniowe dzienniki

**Jak edytować**: Otwórz plik i zmień treść promptów według potrzeb.

## 📚 Dokumentacja

Dokumentacja znajduje się w [`docs/`](./docs/):
- [Product Requirements Document](./docs/PRD.md)
- [Documentation Overview](./docs/README.md)

## 💰 Koszty (miesięcznie)

- **Vercel Hobby**: DARMOWE (do 100GB bandwidth)
- **Vercel Blob**: ~$0.15/GB storage + $0.36/GB transfer
- **Supabase**: DARMOWE (do 500MB)
- **Google Gemini**: ~$0.00015/1K tokenów (Flash) + $0.00125/1K (Pro)

**Przykład**: 100 notatek/miesiąc × 1MB = ~$2-3 total

## 🌟 Zalety

- ✅ **Zero DevOps** - wszystko managed
- ✅ **Auto-scaling** - płacisz za użycie  
- ✅ **Edge deployment** - szybkość globalnie
- ✅ **Modern stack** - Next.js 14, TypeScript
- ✅ **AI-powered** - inteligentna analiza treści
- ✅ **Privacy-focused** - twoje dane, twoja kontrola
- ✅ **Clean architecture** - uporządkowana struktura

---

**Made with ❤️ using Vercel Stack + Google Gemini + Supabase MCP**