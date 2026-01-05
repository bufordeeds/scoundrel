import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these with your Supabase project credentials
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  survived: boolean;
  rooms_cleared: number;
  monsters_slain: number;
  created_at: string;
}

export const getLeaderboard = async (limit = 100): Promise<LeaderboardEntry[]> => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data || [];
};

export const submitScore = async (
  entry: Omit<LeaderboardEntry, 'id' | 'created_at'>
): Promise<LeaderboardEntry | null> => {
  console.log('Submitting score with entry:', JSON.stringify(entry));
  console.log('Supabase URL:', SUPABASE_URL);
  console.log('Has anon key:', !!SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'your-anon-key');

  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .insert(entry)
      .select()
      .single();

    if (error) {
      console.error('Supabase error submitting score:', error.message, error.code, error.details);
      return null;
    }

    console.log('Score submitted successfully:', data);
    return data;
  } catch (e) {
    console.error('Exception submitting score:', e);
    return null;
  }
};

export const getPlayerRank = async (score: number): Promise<number> => {
  const { count, error } = await supabase
    .from('leaderboard')
    .select('*', { count: 'exact', head: true })
    .gt('score', score);

  if (error) {
    console.error('Error getting rank:', error);
    return 0;
  }

  return (count ?? 0) + 1;
};
