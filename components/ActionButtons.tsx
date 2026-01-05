import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../lib/constants';

interface ActionButtonsProps {
  canAvoid: boolean;
  onAvoid: () => void;
  deckCount: number;
}

export function ActionButtons({ canAvoid, onAvoid, deckCount }: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.avoidButton,
          !canAvoid && styles.disabled,
          pressed && canAvoid && styles.pressed,
        ]}
        onPress={onAvoid}
        disabled={!canAvoid}
      >
        <Text style={[styles.buttonText, !canAvoid && styles.disabledText]}>
          AVOID ROOM
        </Text>
        {!canAvoid && (
          <Text style={styles.hint}>Can't avoid twice</Text>
        )}
      </Pressable>
      <View style={styles.deckInfo}>
        <Text style={styles.deckLabel}>DECK</Text>
        <Text style={styles.deckCount}>{deckCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avoidButton: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
    borderColor: COLORS.surface,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
  hint: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  deckInfo: {
    width: 80,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
  },
  deckCount: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
