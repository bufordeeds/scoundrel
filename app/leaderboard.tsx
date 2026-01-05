import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../lib/constants';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { LeaderboardEntry } from '../lib/supabase';

function getRankEmoji(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `${rank}`;
}

function ScoreRow({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  const isTopThree = rank <= 3;

  return (
    <View style={[styles.row, isTopThree && styles.topThreeRow]}>
      <Text style={[styles.rank, isTopThree && styles.topThreeRank]}>
        {getRankEmoji(rank)}
      </Text>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName} numberOfLines={1}>
          {entry.player_name}
        </Text>
        <Text style={styles.playerStats}>
          {entry.rooms_cleared} rooms · {entry.monsters_slain} kills
        </Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={[styles.score, entry.score >= 0 ? styles.positive : styles.negative]}>
          {entry.score >= 0 ? '+' : ''}{entry.score}
        </Text>
        {!entry.survived && <Text style={styles.skull}>💀</Text>}
      </View>
    </View>
  );
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const { entries, loading, error, bestScore, fetchLeaderboard } = useLeaderboard();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{'\u2190'} Back</Text>
        </Pressable>
        <Text style={styles.title}>LEADERBOARD</Text>
      </View>

      {loading && entries.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.weapon} />
          <Text style={styles.loadingText}>Loading scores...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchLeaderboard}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No scores yet!</Text>
          <Text style={styles.emptyHint}>Be the first to submit a score.</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ScoreRow entry={item} rank={index + 1} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {bestScore !== null && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your Best: {bestScore >= 0 ? '+' : ''}{bestScore}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  backButton: {
    marginBottom: 8,
  },
  backText: {
    color: COLORS.weapon,
    fontSize: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    color: COLORS.textMuted,
    marginTop: 12,
  },
  errorText: {
    color: COLORS.monster,
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyHint: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 8,
  },
  list: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  topThreeRow: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  rank: {
    width: 36,
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  topThreeRank: {
    fontSize: 20,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  playerName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerStats: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  positive: {
    color: COLORS.potion,
  },
  negative: {
    color: COLORS.monster,
  },
  skull: {
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
