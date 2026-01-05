import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../stores/gameStore';
import { getCardType } from '../lib/deck';
import { COLORS } from '../lib/constants';
import { Card as CardType } from '../types';
import {
  HealthBar,
  WeaponSlot,
  Room,
  ActionButtons,
  GameOverModal,
  CardActionModal,
} from '../components';

export default function GameScreen() {
  const router = useRouter();
  const [selectedMonster, setSelectedMonster] = useState<CardType | null>(null);

  const {
    deck,
    room,
    health,
    maxHealth,
    weapon,
    selectedCards,
    canAvoid,
    potionUsedThisRoom,
    phase,
    score,
    roomsCleared,
    monstersSlain,
    startNewGame,
    avoidRoom,
    fightBareHanded,
    fightWithWeapon,
    equipWeapon,
    usePotion,
    resetGame,
  } = useGameStore();

  useEffect(() => {
    startNewGame();
  }, []);

  const handleCardPress = (card: CardType) => {
    const cardType = getCardType(card);

    switch (cardType) {
      case 'monster':
        setSelectedMonster(card);
        break;
      case 'weapon':
        equipWeapon(card.id);
        break;
      case 'potion':
        usePotion(card.id);
        break;
    }
  };

  const handleFightBareHanded = () => {
    if (selectedMonster) {
      fightBareHanded(selectedMonster.id);
      setSelectedMonster(null);
    }
  };

  const handleFightWithWeapon = () => {
    if (selectedMonster) {
      fightWithWeapon(selectedMonster.id);
      setSelectedMonster(null);
    }
  };

  const handlePlayAgain = () => {
    startNewGame();
  };

  const handleMainMenu = () => {
    resetGame();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <HealthBar current={health} max={maxHealth} />
        </View>

        <Room
          cards={room}
          selectedCards={selectedCards}
          onCardPress={handleCardPress}
        />

        <ActionButtons
          canAvoid={canAvoid}
          onAvoid={avoidRoom}
          deckCount={deck.length}
        />
      </View>

      <View style={styles.bottomSection}>
        <WeaponSlot weapon={weapon} />
      </View>

      <CardActionModal
        visible={selectedMonster !== null}
        card={selectedMonster}
        weapon={weapon}
        onFightBareHanded={handleFightBareHanded}
        onFightWithWeapon={handleFightWithWeapon}
        onCancel={() => setSelectedMonster(null)}
      />

      <GameOverModal
        visible={phase === 'gameOver'}
        score={score ?? 0}
        survived={health > 0}
        roomsCleared={roomsCleared}
        monstersSlain={monstersSlain}
        onPlayAgain={handlePlayAgain}
        onMainMenu={handleMainMenu}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topSection: {
    padding: 16,
    gap: 16,
  },
  bottomSection: {
    flex: 1,
    padding: 16,
  },
  header: {
    paddingVertical: 8,
  },
});
