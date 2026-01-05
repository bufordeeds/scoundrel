import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card as CardType } from '../types';
import { Card } from './Card';
import { COLORS, CARDS_TO_SELECT } from '../lib/constants';

interface RoomProps {
  cards: CardType[];
  selectedCards: string[];
  onCardPress: (card: CardType) => void;
}

export function Room({ cards, selectedCards, onCardPress }: RoomProps) {
  const remainingSelections = CARDS_TO_SELECT - selectedCards.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>THE ROOM</Text>
        <Text style={styles.counter}>
          Select {remainingSelections} more card{remainingSelections !== 1 ? 's' : ''}
        </Text>
      </View>
      <View style={styles.cards}>
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            selected={selectedCards.includes(card.id)}
            onPress={() => onCardPress(card)}
            size="medium"
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  counter: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  cards: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
});
