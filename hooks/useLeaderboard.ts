import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLeaderboard, submitScore, getPlayerRank, LeaderboardEntry } from '../lib/supabase';

const PLAYER_NAME_KEY = '@scoundrel/playerName';
const BEST_SCORE_KEY = '@scoundrel/bestScore';

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [bestScore, setBestScore] = useState<number | null>(null);

  // Load saved player name and best score
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const [savedName, savedBest] = await Promise.all([
          AsyncStorage.getItem(PLAYER_NAME_KEY),
          AsyncStorage.getItem(BEST_SCORE_KEY),
        ]);
        if (savedName) setPlayerName(savedName);
        if (savedBest) setBestScore(parseInt(savedBest, 10));
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    };
    loadSavedData();
  }, []);

  const savePlayerName = async (name: string) => {
    setPlayerName(name);
    try {
      await AsyncStorage.setItem(PLAYER_NAME_KEY, name);
    } catch (e) {
      console.error('Error saving player name:', e);
    }
  };

  const updateBestScore = async (score: number) => {
    if (bestScore === null || score > bestScore) {
      setBestScore(score);
      try {
        await AsyncStorage.setItem(BEST_SCORE_KEY, score.toString());
      } catch (e) {
        console.error('Error saving best score:', e);
      }
    }
  };

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard();
      setEntries(data);
    } catch (e) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitPlayerScore = async (
    score: number,
    survived: boolean,
    roomsCleared: number,
    monstersSlain: number,
    name?: string
  ): Promise<{ success: boolean; rank?: number }> => {
    const finalName = name || playerName || 'Anonymous';

    if (name) {
      await savePlayerName(name);
    }

    try {
      const result = await submitScore({
        player_name: finalName,
        score,
        survived,
        rooms_cleared: roomsCleared,
        monsters_slain: monstersSlain,
      });

      if (result) {
        await updateBestScore(score);
        const rank = await getPlayerRank(score);
        await fetchLeaderboard();
        return { success: true, rank };
      }
      return { success: false };
    } catch (e) {
      console.error('Error submitting score:', e);
      return { success: false };
    }
  };

  return {
    entries,
    loading,
    error,
    playerName,
    bestScore,
    fetchLeaderboard,
    submitPlayerScore,
    savePlayerName,
  };
}
