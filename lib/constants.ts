import { Suit, Rank } from '../types';

export const SUITS: Suit[] = ['spades', 'clubs', 'diamonds', 'hearts'];
export const MONSTER_SUITS: Suit[] = ['spades', 'clubs'];
export const RANKS: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export const MAX_HEALTH = 20;
export const STARTING_HEALTH = 20;
export const ROOM_SIZE = 4;
export const CARDS_TO_SELECT = 3;

export const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '\u2660',
  clubs: '\u2663',
  diamonds: '\u2666',
  hearts: '\u2665',
};

export const RANK_DISPLAY: Record<Rank, string> = {
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
  14: 'A',
};

export const COLORS = {
  background: '#1a1a2e',
  surface: '#16213e',
  card: '#0f3460',
  monster: '#e94560',
  weapon: '#4da8da',
  potion: '#7ec8a3',
  text: '#eaeaea',
  textMuted: '#888',
  health: '#e94560',
  healthBg: '#3a1a1a',
  gold: '#ffd700',
};
