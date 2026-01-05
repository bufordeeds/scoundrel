# Scoundrel Mobile App - Technical Specification

## Project Overview

A faithful digital adaptation of the Scoundrel card game by Zach Gage and Kurt Bieg. Built with Expo for iOS/Android deployment, featuring offline gameplay with global leaderboards.

**Primary Goal:** Practice project to ship another mobile app through TestFlight/Play Store.

---

## Game Rules Summary

### Setup

-   Standard 52-card deck minus: Jokers, Red Face Cards (J/Q/K of Hearts & Diamonds), Red Aces
-   Remaining: 44 cards total
    -   26 Monsters (all Clubs & Spades, values 2-14 where A=14)
    -   9 Weapons (Diamonds 2-10)
    -   9 Potions (Hearts 2-10)
-   Player starts with 20 HP (max 20)

### Gameplay Loop

1. Deal 4 cards face-up to form a "Room"
2. Player chooses: **Face** the room or **Avoid** it
    - **Face:** Must interact with exactly 3 of 4 cards, leaving 1 for next room
    - **Avoid:** All 4 cards go to bottom of deck, draw new room (cannot avoid twice in a row)
3. Repeat until deck exhausted or HP reaches 0

### Card Interactions

| Card Type         | Action                                                                |
| ----------------- | --------------------------------------------------------------------- |
| **Monster** (♠/♣) | Fight barehanded (take full damage) or with weapon (take difference)  |
| **Weapon** (♦)    | Must equip, replaces current weapon, discards weapon + its kill stack |
| **Potion** (♥)    | Heal by card value (max 20 HP), only 1 per room effective             |

### Weapon Degradation

-   After killing a monster, weapon can only kill monsters with **lower value** than the last kill
-   Monster cards stack on weapon to track this
-   Player can always fight barehanded even with weapon equipped

### Scoring

-   **Death:** Negative sum of all remaining monsters in deck
-   **Survival:** Current HP (positive)
-   **Perfect:** If HP=20 and last card was a potion, add potion value as bonus

---

## Tech Stack

| Layer            | Technology                  |
| ---------------- | --------------------------- |
| Framework        | Expo SDK 52+                |
| Language         | TypeScript                  |
| State Management | Zustand                     |
| Local Storage    | AsyncStorage                |
| Backend          | Supabase (leaderboard only) |
| Animations       | React Native Reanimated     |
| Navigation       | Expo Router                 |

---

## Project Structure

```
scoundrel/
├── app/
│   ├── _layout.tsx          # Root layout with providers
│   ├── index.tsx            # Home/Menu screen
│   ├── game.tsx             # Main game screen
│   ├── leaderboard.tsx      # Global leaderboard
│   └── how-to-play.tsx      # Rules/tutorial
├── components/
│   ├── Card.tsx             # Individual card component
│   ├── Room.tsx             # 4-card room display
│   ├── HealthBar.tsx        # HP visualization
│   ├── WeaponSlot.tsx       # Equipped weapon + kill stack
│   ├── DeckPile.tsx         # Remaining deck indicator
│   ├── ActionButtons.tsx    # Face Room / Avoid Room buttons
│   ├── GameOverModal.tsx    # Score display + submit to leaderboard
│   └── ScoreEntry.tsx       # Leaderboard row
├── stores/
│   └── gameStore.ts         # Zustand game state
├── lib/
│   ├── deck.ts              # Deck creation, shuffling
│   ├── scoring.ts           # Score calculation
│   ├── supabase.ts          # Supabase client
│   └── constants.ts         # Card values, colors, etc.
├── hooks/
│   ├── useGame.ts           # Game logic hook
│   └── useLeaderboard.ts    # Leaderboard queries
├── types/
│   └── index.ts             # TypeScript interfaces
└── assets/
    └── cards/               # Card face images (or generate programmatically)
```

---

## Data Models

### TypeScript Types

```typescript
// types/index.ts

type Suit = 'spades' | 'clubs' | 'diamonds' | 'hearts';
type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

interface Card {
	id: string; // Unique identifier (e.g., "spades-14")
	suit: Suit;
	rank: Rank;
	value: number; // Same as rank for this game
}

type CardType = 'monster' | 'weapon' | 'potion';

interface Weapon {
	card: Card;
	killStack: Card[]; // Monsters killed with this weapon
	maxTarget: number; // Highest value monster it can now kill (starts at 14)
}

interface GameState {
	// Deck state
	deck: Card[];
	room: Card[];
	discard: Card[];

	// Player state
	health: number;
	maxHealth: number;
	weapon: Weapon | null;

	// Room state
	selectedCards: string[]; // IDs of cards interacted with this room
	canAvoid: boolean;
	potionUsedThisRoom: boolean;

	// Game state
	phase: 'menu' | 'playing' | 'gameOver';
	score: number | null;
	roomsCleared: number;
	monstersSlain: number;
}

// Leaderboard
interface LeaderboardEntry {
	id: string;
	player_name: string;
	score: number;
	survived: boolean;
	rooms_cleared: number;
	monsters_slain: number;
	created_at: string;
}
```

---

## Game State Management (Zustand)

```typescript
// stores/gameStore.ts

interface GameActions {
	// Setup
	startNewGame: () => void;

	// Room actions
	avoidRoom: () => void;
	selectCard: (cardId: string) => void;

	// Combat
	fightBareHanded: (cardId: string) => void;
	fightWithWeapon: (cardId: string) => void;

	// Utility
	resetGame: () => void;
	calculateScore: () => number;
}

type GameStore = GameState & GameActions;
```

### State Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                        GAME FLOW                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Menu] ──startNewGame──▶ [Deal Room]                       │
│                               │                             │
│                    ┌──────────┴──────────┐                  │
│                    ▼                     ▼                  │
│              [Face Room]           [Avoid Room]             │
│                    │                     │                  │
│            Select 3 cards          (if canAvoid)            │
│                    │                     │                  │
│                    ▼                     ▼                  │
│              [Process Card]      Cards to bottom            │
│               ┌────┼────┐              │                    │
│               ▼    ▼    ▼              │                    │
│            Monster Weapon Potion       │                    │
│               │    │    │              │                    │
│               └────┴────┴──────────────┤                    │
│                                        │                    │
│                    ┌───────────────────┘                    │
│                    ▼                                        │
│           [Check Game End]                                  │
│            ┌───────┼───────┐                                │
│            ▼       ▼       ▼                                │
│         HP = 0  Deck < 4  Continue                          │
│            │       │       │                                │
│            ▼       ▼       ▼                                │
│        [Game Over] [Win]  [Deal Room]                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Screen Specifications

### 1. Home Screen (`app/index.tsx`)

```
┌─────────────────────────────┐
│                             │
│         SCOUNDREL           │
│      ─────────────────      │
│        [Card Icon]          │
│                             │
│    ┌─────────────────┐      │
│    │   NEW GAME      │      │
│    └─────────────────┘      │
│                             │
│    ┌─────────────────┐      │
│    │  LEADERBOARD    │      │
│    └─────────────────┘      │
│                             │
│    ┌─────────────────┐      │
│    │  HOW TO PLAY    │      │
│    └─────────────────┘      │
│                             │
│                             │
│   Best: +12  |  Games: 47   │
│                             │
└─────────────────────────────┘
```

### 2. Game Screen (`app/game.tsx`)

Portrait orientation, optimized for one-handed play:

```
┌─────────────────────────────┐
│  ♥ 17/20          Deck: 28 │  <- Header
├─────────────────────────────┤
│                             │
│   ┌─────┐  EQUIPPED WEAPON  │
│   │ ♦ 7 │  Can kill: < 10  │  <- Weapon slot
│   │     │  Kills: 2         │
│   └─────┘                   │
│      │                      │
│   ┌──┴──┐                   │
│   │ ♠10 │  <- Kill stack    │
│   └──┬──┘     (staggered)   │
│   ┌──┴──┐                   │
│   │ ♣ 6 │                   │
│   └─────┘                   │
│                             │
├─────────────────────────────┤
│          THE ROOM           │
│                             │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│  │ ♠ Q │ │ ♥ 5 │ │ ♦ 3 │ │ ♣ 8 │
│  │     │ │     │ │     │ │     │
│  │  12 │ │  +5 │ │ ATK │ │  8  │
│  └─────┘ └─────┘ └─────┘ └─────┘
│                             │
│  Selected: 1/3              │
│                             │
├─────────────────────────────┤
│                             │
│  ┌───────────┐ ┌───────────┐│
│  │AVOID ROOM │ │ NEXT ROOM ││  <- Actions
│  └───────────┘ └───────────┘│
│                             │
└─────────────────────────────┘
```

### 3. Card Selection Flow

When tapping a **Monster** card, show action sheet:

```
┌─────────────────────────────┐
│                             │
│      ♠ Queen (12 DMG)       │
│                             │
│  ┌───────────────────────┐  │
│  │  FIGHT BAREHANDED     │  │
│  │  Take 12 damage       │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  USE WEAPON (♦7)      │  │
│  │  Take 5 damage        │  │  <- (12 - 7 = 5)
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  CANCEL               │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

Weapon option is **disabled** if:

-   No weapon equipped
-   Monster value > weapon's maxTarget

### 4. Game Over Modal

```
┌─────────────────────────────┐
│                             │
│        GAME OVER            │
│                             │
│     YOU SURVIVED! 🎉        │  <- or "YOU DIED 💀"
│                             │
│    ┌─────────────────┐      │
│    │     SCORE       │      │
│    │      +14        │      │
│    └─────────────────┘      │
│                             │
│    Rooms cleared: 11        │
│    Monsters slain: 18       │
│                             │
│  ───────────────────────    │
│                             │
│    Enter name for           │
│    leaderboard:             │
│    ┌─────────────────┐      │
│    │ Buford          │      │
│    └─────────────────┘      │
│                             │
│    ┌─────────────────┐      │
│    │  SUBMIT SCORE   │      │
│    └─────────────────┘      │
│                             │
│    ┌─────────────────┐      │
│    │   PLAY AGAIN    │      │
│    └─────────────────┘      │
│                             │
└─────────────────────────────┘
```

### 5. Leaderboard Screen

```
┌─────────────────────────────┐
│  ←  GLOBAL LEADERBOARD      │
├─────────────────────────────┤
│                             │
│  🥇 DragonSlayer    +20 🏆  │
│  🥈 CardShark       +18     │
│  🥉 Buford          +14     │
│   4 LuckyDraw       +12     │
│   5 DungeonDiver    +8      │
│   6 RogueOne        +3      │
│   7 Newbie          -24 💀  │
│   8 FirstTimer      -67 💀  │
│   ...                       │
│                             │
├─────────────────────────────┤
│  YOUR BEST: +14 (Rank #3)   │
└─────────────────────────────┘
```

---

## Supabase Schema

### Table: `leaderboard`

```sql
CREATE TABLE leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  survived BOOLEAN NOT NULL,
  rooms_cleared INTEGER DEFAULT 0,
  monsters_slain INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast ranking queries
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);

-- Optional: RLS policies (open read, authenticated write)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read leaderboard"
  ON leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert scores"
  ON leaderboard FOR INSERT
  WITH CHECK (true);
```

### Queries

```typescript
// lib/supabase.ts

// Get top 100 scores
const getLeaderboard = async () => {
	const { data, error } = await supabase
		.from('leaderboard')
		.select('*')
		.order('score', { ascending: false })
		.limit(100);
	return data;
};

// Submit score
const submitScore = async (
	entry: Omit<LeaderboardEntry, 'id' | 'created_at'>
) => {
	const { data, error } = await supabase
		.from('leaderboard')
		.insert(entry)
		.select()
		.single();
	return data;
};

// Get player rank
const getPlayerRank = async (score: number) => {
	const { count } = await supabase
		.from('leaderboard')
		.select('*', { count: 'exact', head: true })
		.gt('score', score);
	return (count ?? 0) + 1;
};
```

---

## Core Game Logic

### Deck Creation

```typescript
// lib/deck.ts

const SUITS: Suit[] = ['spades', 'clubs', 'diamonds', 'hearts'];
const MONSTER_SUITS: Suit[] = ['spades', 'clubs'];
const RANKS: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export const createDeck = (): Card[] => {
	const cards: Card[] = [];

	// Add all spades and clubs (monsters) - full 2-14
	for (const suit of MONSTER_SUITS) {
		for (const rank of RANKS) {
			cards.push({
				id: `${suit}-${rank}`,
				suit,
				rank,
				value: rank
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
				value: rank
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
```

### Score Calculation

```typescript
// lib/scoring.ts

export const calculateScore = (state: GameState): number => {
	const { health, deck, room } = state;

	// Check if survived (deck exhausted)
	const survived = deck.length < 4;

	if (!survived && health <= 0) {
		// Death: negative sum of remaining monsters
		const remainingMonsters = [...deck, ...room].filter(
			(card) => getCardType(card) === 'monster'
		);
		const monsterSum = remainingMonsters.reduce(
			(sum, card) => sum + card.value,
			0
		);
		return -monsterSum;
	}

	// Survived
	let score = health;

	// Bonus: HP=20 and last card was a potion
	if (health === 20 && room.length === 1) {
		const lastCard = room[0];
		if (getCardType(lastCard) === 'potion') {
			score += lastCard.value;
		}
	}

	return score;
};
```

---

## Animation Approach

Using React Native Reanimated for smooth 60fps animations:

| Action        | Animation                                  |
| ------------- | ------------------------------------------ |
| Deal room     | Cards slide in from deck, fan out          |
| Select card   | Card lifts (scale + shadow)                |
| Fight monster | Card shakes, then slides to discard/weapon |
| Equip weapon  | Card slides to weapon slot                 |
| Use potion    | Card pulses green, health bar fills        |
| Avoid room    | Cards scoop together, slide to bottom      |
| Take damage   | Screen edge flashes red, health bar drains |
| Death         | Cards scatter, fade to gray                |

---

## Local Storage

```typescript
// Using AsyncStorage for:
// - Player's preferred name
// - Personal best score
// - Total games played
// - Sound/haptics preferences

interface LocalData {
	playerName: string;
	bestScore: number;
	gamesPlayed: number;
	soundEnabled: boolean;
	hapticsEnabled: boolean;
}
```

---

## MVP Feature Checklist

### Phase 1: Core Game (Week 1)

-   [ ] Project setup (Expo, TypeScript, folder structure)
-   [ ] Card component with suits/values
-   [ ] Deck creation and shuffling
-   [ ] Room display (4 cards)
-   [ ] Health bar
-   [ ] Basic card selection (tap to use)
-   [ ] Monster combat (barehanded only)
-   [ ] Potion healing
-   [ ] Weapon equipping
-   [ ] Game over detection

### Phase 2: Full Rules (Week 2)

-   [ ] Weapon combat with damage reduction
-   [ ] Weapon degradation (kill stack tracking)
-   [ ] Avoid room functionality
-   [ ] "Can't avoid twice" rule
-   [ ] One potion per room rule
-   [ ] Proper scoring (death vs survival vs perfect)
-   [ ] Room completion → next room flow

### Phase 3: Polish & Online (Week 3)

-   [ ] Animations (Reanimated)
-   [ ] Haptic feedback
-   [ ] Sound effects
-   [ ] Supabase setup
-   [ ] Leaderboard screen
-   [ ] Score submission
-   [ ] Local stats storage
-   [ ] How to Play screen

### Phase 4: Ship (Week 4)

-   [ ] App icon
-   [ ] Splash screen
-   [ ] TestFlight build
-   [ ] Play Store internal testing
-   [ ] Bug fixes from testing

---

## Design Decisions (Finalized)

1. **Card visuals:** Programmatic — suit symbols + values, colored by card type (red for monsters, blue for weapons, green for potions). Faster to build, cleaner look, no asset management.

2. **Player names:** Prompt at game over only (when submitting to leaderboard). Save name to AsyncStorage so it auto-fills on subsequent submissions.

3. **Undo:** None — pure roguelike. Every tap is final. No takebacks within a room.

4. **Monster combat flow:** Show action modal when tapping a monster with weapon equipped. Options: "Fight Barehanded" / "Use Weapon" / "Cancel". Clear damage preview on each option.

---

## References

-   [Official Rules PDF](http://www.stfj.net/art/2011/Scoundrel.pdf)
-   [Riffle Shuffle & Roll Tutorial](https://www.youtube.com/watch?v=...)
-   [BoardGameGeek Page](https://boardgamegeek.com/boardgame/191095/scoundrel)
