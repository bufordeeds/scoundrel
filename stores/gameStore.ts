import { create } from 'zustand';
import { GameState, Card, Weapon } from '../types';
import { createDeck, getCardType, dealRoom } from '../lib/deck';
import { calculateScore } from '../lib/scoring';
import { STARTING_HEALTH, MAX_HEALTH, CARDS_TO_SELECT } from '../lib/constants';

interface GameActions {
  startNewGame: () => void;
  avoidRoom: () => void;
  selectCard: (cardId: string) => void;
  fightBareHanded: (cardId: string) => void;
  fightWithWeapon: (cardId: string) => void;
  equipWeapon: (cardId: string) => void;
  usePotion: (cardId: string) => void;
  finishRoom: () => void;
  resetGame: () => void;
}

type GameStore = GameState & GameActions;

const initialState: GameState = {
  deck: [],
  room: [],
  discard: [],
  health: STARTING_HEALTH,
  maxHealth: MAX_HEALTH,
  weapon: null,
  selectedCards: [],
  canAvoid: true,
  potionUsedThisRoom: false,
  lastCardWasPotion: false,
  phase: 'menu',
  score: null,
  roomsCleared: 0,
  monstersSlain: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startNewGame: () => {
    const deck = createDeck();
    const { room, remainingDeck } = dealRoom(deck);
    set({
      ...initialState,
      deck: remainingDeck,
      room,
      phase: 'playing',
    });
  },

  avoidRoom: () => {
    const { deck, room, canAvoid } = get();
    if (!canAvoid) return;

    // Move room cards to bottom of deck
    const newDeck = [...deck, ...room];
    const { room: newRoom, remainingDeck } = dealRoom(newDeck);

    set({
      deck: remainingDeck,
      room: newRoom,
      canAvoid: false,
      selectedCards: [],
      potionUsedThisRoom: false,
    });
  },

  selectCard: (cardId: string) => {
    const { selectedCards } = get();
    if (selectedCards.includes(cardId)) {
      set({ selectedCards: selectedCards.filter((id) => id !== cardId) });
    } else {
      set({ selectedCards: [...selectedCards, cardId] });
    }
  },

  fightBareHanded: (cardId: string) => {
    const { room, health, selectedCards, discard, monstersSlain } = get();
    const card = room.find((c) => c.id === cardId);
    if (!card || getCardType(card) !== 'monster') return;

    const newHealth = Math.max(0, health - card.value);
    const newRoom = room.filter((c) => c.id !== cardId);
    const newSelectedCards = [...selectedCards, cardId];
    const newDiscard = [...discard, card];

    set({
      room: newRoom,
      health: newHealth,
      selectedCards: newSelectedCards,
      discard: newDiscard,
      monstersSlain: monstersSlain + 1,
      lastCardWasPotion: false,
    });

    // Check for death
    if (newHealth <= 0) {
      const state = get();
      set({
        phase: 'gameOver',
        score: calculateScore(state),
      });
      return;
    }

    // Check if room is complete (3 cards selected)
    if (newSelectedCards.length >= CARDS_TO_SELECT) {
      get().finishRoom();
    }
  },

  fightWithWeapon: (cardId: string) => {
    const { room, health, weapon, selectedCards, monstersSlain } = get();
    if (!weapon) return;

    const card = room.find((c) => c.id === cardId);
    if (!card || getCardType(card) !== 'monster') return;

    // Check if weapon can kill this monster
    if (card.value > weapon.maxTarget) return;

    const damage = Math.max(0, card.value - weapon.card.value);
    const newHealth = Math.max(0, health - damage);
    const newRoom = room.filter((c) => c.id !== cardId);
    const newSelectedCards = [...selectedCards, cardId];

    // Add monster to weapon's kill stack
    const newWeapon: Weapon = {
      ...weapon,
      killStack: [...weapon.killStack, card],
      maxTarget: card.value - 1, // Weapon can now only kill monsters with lower value
    };

    set({
      room: newRoom,
      health: newHealth,
      weapon: newWeapon,
      selectedCards: newSelectedCards,
      monstersSlain: monstersSlain + 1,
      lastCardWasPotion: false,
    });

    // Check for death
    if (newHealth <= 0) {
      const state = get();
      set({
        phase: 'gameOver',
        score: calculateScore(state),
      });
      return;
    }

    // Check if room is complete
    if (newSelectedCards.length >= CARDS_TO_SELECT) {
      get().finishRoom();
    }
  },

  equipWeapon: (cardId: string) => {
    const { room, weapon, selectedCards, discard } = get();
    const card = room.find((c) => c.id === cardId);
    if (!card || getCardType(card) !== 'weapon') return;

    // Discard old weapon and its kill stack
    let newDiscard = [...discard];
    if (weapon) {
      newDiscard = [...newDiscard, weapon.card, ...weapon.killStack];
    }

    const newWeapon: Weapon = {
      card,
      killStack: [],
      maxTarget: 14, // Can kill any monster initially
    };

    const newRoom = room.filter((c) => c.id !== cardId);
    const newSelectedCards = [...selectedCards, cardId];

    set({
      room: newRoom,
      weapon: newWeapon,
      selectedCards: newSelectedCards,
      discard: newDiscard,
      lastCardWasPotion: false,
    });

    // Check if room is complete
    if (newSelectedCards.length >= CARDS_TO_SELECT) {
      get().finishRoom();
    }
  },

  usePotion: (cardId: string) => {
    const { room, health, maxHealth, potionUsedThisRoom, selectedCards, discard } = get();
    const card = room.find((c) => c.id === cardId);
    if (!card || getCardType(card) !== 'potion') return;

    const newRoom = room.filter((c) => c.id !== cardId);
    const newSelectedCards = [...selectedCards, cardId];
    const newDiscard = [...discard, card];

    // Only heal if no potion used this room
    const healAmount = potionUsedThisRoom ? 0 : card.value;
    const newHealth = Math.min(maxHealth, health + healAmount);

    set({
      room: newRoom,
      health: newHealth,
      potionUsedThisRoom: true,
      selectedCards: newSelectedCards,
      discard: newDiscard,
      lastCardWasPotion: true,
    });

    // Check if room is complete
    if (newSelectedCards.length >= CARDS_TO_SELECT) {
      get().finishRoom();
    }
  },

  finishRoom: () => {
    const { deck, room, roomsCleared } = get();

    // If deck is empty (or less than 4 cards), game is won
    if (deck.length < 4) {
      const state = get();
      set({
        phase: 'gameOver',
        score: calculateScore({ ...state, deck, room }),
        roomsCleared: roomsCleared + 1,
      });
      return;
    }

    // Deal new room, keeping the 1 unselected card
    const { room: newRoom, remainingDeck } = dealRoom(deck);
    const leftoverCard = room[0]; // The one card left in room

    set({
      deck: remainingDeck,
      room: leftoverCard ? [leftoverCard, ...newRoom.slice(0, 3)] : newRoom,
      selectedCards: [],
      canAvoid: true,
      potionUsedThisRoom: false,
      roomsCleared: roomsCleared + 1,
    });
  },

  resetGame: () => {
    set(initialState);
  },
}));
