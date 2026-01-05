import { GameState, Card } from '../types';
import { getCardType } from './deck';

export const calculateScore = (state: GameState): number => {
  const { health, deck, room, lastCardWasPotion } = state;

  // Check if survived (deck exhausted and health > 0)
  const survived = health > 0 && deck.length < 4;

  if (health <= 0) {
    // Death: negative sum of remaining monsters
    const remainingMonsters = [...deck, ...room].filter(
      (card) => getCardType(card) === 'monster'
    );
    const monsterSum = remainingMonsters.reduce((sum, card) => sum + card.value, 0);
    return -monsterSum;
  }

  if (!survived) {
    // Game still in progress, no score yet
    return 0;
  }

  // Survived
  let score = health;

  // Bonus: HP=20 and last card processed was a potion
  if (health === 20 && lastCardWasPotion) {
    // Find the last potion in the room to get its value for bonus
    const potionsInRoom = room.filter((card) => getCardType(card) === 'potion');
    if (potionsInRoom.length > 0) {
      const lastPotion = potionsInRoom[potionsInRoom.length - 1];
      score += lastPotion.value;
    }
  }

  return score;
};

export const getRemainingMonsterSum = (deck: Card[], room: Card[]): number => {
  const allCards = [...deck, ...room];
  return allCards
    .filter((card) => getCardType(card) === 'monster')
    .reduce((sum, card) => sum + card.value, 0);
};
