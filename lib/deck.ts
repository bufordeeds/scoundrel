import { Card, CardType, Suit, Rank } from '../types';
import { MONSTER_SUITS, RANKS } from './constants';

export const createDeck = (): Card[] => {
  const cards: Card[] = [];

  // Add all spades and clubs (monsters) - full 2-14
  for (const suit of MONSTER_SUITS) {
    for (const rank of RANKS) {
      cards.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value: rank,
      });
    }
  }

  // Add diamonds and hearts 2-10 only (no face cards/aces)
  for (const suit of ['diamonds', 'hearts'] as Suit[]) {
    for (const rank of RANKS.filter((r) => r <= 10)) {
      cards.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value: rank,
      });
    }
  }

  return shuffle(cards);
};

export const getCardType = (card: Card): CardType => {
  if (card.suit === 'spades' || card.suit === 'clubs') return 'monster';
  if (card.suit === 'diamonds') return 'weapon';
  return 'potion';
};

// Fisher-Yates shuffle
export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const dealRoom = (deck: Card[]): { room: Card[]; remainingDeck: Card[] } => {
  if (deck.length < 4) {
    return { room: [...deck], remainingDeck: [] };
  }
  return {
    room: deck.slice(0, 4),
    remainingDeck: deck.slice(4),
  };
};
