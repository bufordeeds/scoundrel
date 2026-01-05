import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { COLORS } from '../lib/constants';

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
  buttons: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.weapon,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.textMuted,
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
