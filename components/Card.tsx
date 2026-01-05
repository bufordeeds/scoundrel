import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Card as CardType, CardType as CardTypeEnum } from '../types';
import { getCardType } from '../lib/deck';
import { SUIT_SYMBOLS, RANK_DISPLAY, COLORS } from '../lib/constants';

interface CardProps {
  card: CardType;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const CARD_COLORS: Record<CardTypeEnum, string> = {
  monster: COLORS.monster,
  weapon: COLORS.weapon,
  potion: COLORS.potion,
};

export function Card({ card, onPress, selected = false, disabled = false, size = 'medium' }: CardProps) {
  const cardType = getCardType(card);
  const color = CARD_COLORS[cardType];
  const symbol = SUIT_SYMBOLS[card.suit];
  const rank = RANK_DISPLAY[card.rank];

  const sizeStyles = {
    small: { width: 50, height: 70, fontSize: 14, symbolSize: 20 },
    medium: { width: 70, height: 100, fontSize: 18, symbolSize: 28 },
    large: { width: 90, height: 130, fontSize: 24, symbolSize: 36 },
  };

  const s = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      style={({ pressed }) => [
        styles.card,
        { width: s.width, height: s.height },
        selected && styles.selected,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.cardInner}>
        <Text style={[styles.rank, { fontSize: s.fontSize, color }]}>{rank}</Text>
        <Text style={[styles.symbol, { fontSize: s.symbolSize, color }]}>{symbol}</Text>
      </View>
      {cardType === 'monster' && (
        <View style={[styles.typeIndicator, { backgroundColor: color }]}>
          <Text style={styles.typeText}>DMG</Text>
        </View>
      )}
      {cardType === 'weapon' && (
        <View style={[styles.typeIndicator, { backgroundColor: color }]}>
          <Text style={styles.typeText}>ATK</Text>
        </View>
      )}
      {cardType === 'potion' && (
        <View style={[styles.typeIndicator, { backgroundColor: color }]}>
          <Text style={styles.typeText}>+HP</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  rank: {
    fontWeight: 'bold',
  },
  symbol: {
    fontWeight: 'bold',
  },
  typeIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  selected: {
    transform: [{ translateY: -8 }],
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
