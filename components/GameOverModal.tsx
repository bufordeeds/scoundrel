import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput, ActivityIndicator } from 'react-native';
import { COLORS } from '../lib/constants';
import { useLeaderboard } from '../hooks/useLeaderboard';

interface GameOverModalProps {
  visible: boolean;
  score: number;
  survived: boolean;
  roomsCleared: number;
  monstersSlain: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export function GameOverModal({
  visible,
  score,
  survived,
  roomsCleared,
  monstersSlain,
  onPlayAgain,
  onMainMenu,
}: GameOverModalProps) {
  const { playerName, submitPlayerScore, savePlayerName } = useLeaderboard();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rank, setRank] = useState<number | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setName(playerName);
      setSubmitted(false);
      setRank(null);
    }
  }, [visible, playerName]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setSubmitting(true);
    const result = await submitPlayerScore(
      score,
      survived,
      roomsCleared,
      monstersSlain,
      name.trim()
    );
    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      setRank(result.rank ?? null);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>GAME OVER</Text>
          <Text style={[styles.result, survived ? styles.survived : styles.died]}>
            {survived ? 'YOU SURVIVED!' : 'YOU DIED'}
          </Text>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>SCORE</Text>
            <Text style={[styles.score, score >= 0 ? styles.positive : styles.negative]}>
              {score >= 0 ? '+' : ''}{score}
            </Text>
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{roomsCleared}</Text>
              <Text style={styles.statLabel}>Rooms Cleared</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{monstersSlain}</Text>
              <Text style={styles.statLabel}>Monsters Slain</Text>
            </View>
          </View>

          {!submitted ? (
            <View style={styles.submitSection}>
              <Text style={styles.submitLabel}>Submit to Leaderboard</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textMuted}
                maxLength={20}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.submitButton,
                  (!name.trim() || submitting) && styles.buttonDisabled,
                  pressed && styles.pressed,
                ]}
                onPress={handleSubmit}
                disabled={!name.trim() || submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>SUBMIT SCORE</Text>
                )}
              </Pressable>
            </View>
          ) : (
            <View style={styles.submittedSection}>
              <Text style={styles.submittedText}>Score Submitted!</Text>
              {rank && <Text style={styles.rankText}>Rank: #{rank}</Text>}
            </View>
          )}

          <View style={styles.buttons}>
            <Pressable
              style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.pressed]}
              onPress={onPlayAgain}
            >
              <Text style={styles.buttonText}>PLAY AGAIN</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.button, styles.secondaryButton, pressed && styles.pressed]}
              onPress={onMainMenu}
            >
              <Text style={styles.secondaryButtonText}>MAIN MENU</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  survived: {
    color: COLORS.potion,
  },
  died: {
    color: COLORS.monster,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    width: '100%',
  },
  scoreLabel: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  positive: {
    color: COLORS.potion,
  },
  negative: {
    color: COLORS.monster,
  },
  stats: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  submitSection: {
    width: '100%',
    marginBottom: 16,
  },
  submitLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.background,
    color: COLORS.text,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  submittedSection: {
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  submittedText: {
    color: COLORS.potion,
    fontSize: 16,
    fontWeight: 'bold',
  },
  rankText: {
    color: COLORS.gold,
    fontSize: 14,
    marginTop: 4,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.potion,
  },
  primaryButton: {
    backgroundColor: COLORS.weapon,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.textMuted,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
