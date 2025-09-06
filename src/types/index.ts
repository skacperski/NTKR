// Global type definitions for the NTKR application

export interface VoiceNote {
  id: number;
  created_at: string;
  transcription: string;
  corrected_text: string;
  summary: string;
  topics: string[];
  follow_up_questions: string[];
  action_items: string[];
  insights: string[];
  recorded_date?: string;
  recorded_time?: string;
  mood_score?: number;
  emotional_tags?: string[];
  main_topics?: string[];
  importance_level?: number;
  audio_url?: string;
  location?: string;
  processing_status?: 'uploading' | 'processing' | 'transcribing' | 'analyzing' | 'completed' | 'error';
}

export interface DailySummary {
  id: number;
  summary_date: string;
  total_recordings: number;
  overall_mood: number;
  summary_text: string;
  selected_questions: string[];
  next_day_suggestions: string[];
  created_at: string;
}

export interface WeeklySummary {
  id: number;
  week_start: string;
  week_end: string;
  diary_entries: DiaryEntry[];
  key_themes: string[];
  mood_trend: DailyMood[];
  total_recordings: number;
  motivational_quote: string;
  quote_context: string;
  created_at: string;
}

export interface DiaryEntry {
  date: string;
  time: string;
  content: string;
}

export interface DailyMood {
  date: string;
  mood_score: number;
  recordings_count: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
