export type Suit = 'spades' | 'clubs' | 'diamonds' | 'hearts';
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number;
}

export type CardType = 'monster' | 'weapon' | 'potion';

export interface Weapon {
  card: Card;
  killStack: Card[];
  maxTarget: number;
}

export interface GameState {
  deck: Card[];
  room: Card[];
  discard: Card[];

  health: number;
  maxHealth: number;
  weapon: Weapon | null;

  selectedCards: string[];
  canAvoid: boolean;
  potionUsedThisRoom: boolean;
  lastCardWasPotion: boolean;

  phase: 'menu' | 'playing' | 'roomClear' | 'gameOver';
  score: number | null;
  roomsCleared: number;
  monstersSlain: number;
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  survived: boolean;
  rooms_cleared: number;
  monsters_slain: number;
  created_at: string;
}

export interface LocalData {
  playerName: string;
  bestScore: number;
  gamesPlayed: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}
