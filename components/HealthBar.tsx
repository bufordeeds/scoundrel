import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../lib/constants';

interface HealthBarProps {
  current: number;
  max: number;
}

export function HealthBar({ current, max }: HealthBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  const isLow = current <= 5;
  const isCritical = current <= 3;

  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>{'\u2665'}</Text>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.barFill,
            { width: `${percentage}%` },
            isLow && styles.barLow,
            isCritical && styles.barCritical,
          ]}
        />
      </View>
      <Text style={styles.text}>
        {current}/{max}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  symbol: {
    color: COLORS.health,
    fontSize: 20,
  },
  barContainer: {
    flex: 1,
    height: 16,
    backgroundColor: COLORS.healthBg,
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.health,
    borderRadius: 8,
  },
  barLow: {
    backgroundColor: '#ff6b35',
  },
  barCritical: {
    backgroundColor: '#ff0000',
  },
  text: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 50,
  },
});
