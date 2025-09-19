// Database utilities and connection for Supabase

import { createClient } from '@supabase/supabase-js';
import { VoiceNote, DailySummary, WeeklySummary } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database query helpers
export async function getVoiceNotes(limit?: number): Promise<VoiceNote[]> {
  let query = supabase
    .from('voice_notes')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching voice notes:', error);
    return [];
  }
  
  return data || [];
}

export async function getVoiceNotesByDate(date: string): Promise<VoiceNote[]> {
  const { data, error } = await supabase
    .from('voice_notes')
    .select('*')
    .gte('created_at', `${date}T00:00:00.000Z`)
    .lt('created_at', `${date}T23:59:59.999Z`)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching voice notes by date:', error);
    return [];
  }
  
  return data || [];
}

export async function getDailySummary(date: string): Promise<DailySummary | null> {
  const { data, error } = await supabase
    .from('daily_summaries')
    .select('*')
    .eq('summary_date', date)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No data found
    }
    console.error('Error fetching daily summary:', error);
    return null;
  }
  
  return data;
}

export async function getWeeklySummary(weekString: string): Promise<WeeklySummary | null> {
  const { data, error } = await supabase
    .from('weekly_summaries')
    .select('*')
    .eq('week_start', weekString)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No data found
    }
    console.error('Error fetching weekly summary:', error);
    return null;
  }
  
  return data;
}

export async function getAllSummaries() {
  const [dailyResult, weeklyResult] = await Promise.all([
    supabase
      .from('daily_summaries')
      .select('*')
      .order('summary_date', { ascending: false }),
    supabase
      .from('weekly_summaries')
      .select('*')
      .order('week_start', { ascending: false })
  ]);
  
  return {
    daily: dailyResult.data || [],
    weekly: weeklyResult.data || [],
    error: dailyResult.error || weeklyResult.error
  };
}
