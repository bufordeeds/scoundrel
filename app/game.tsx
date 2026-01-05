import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Text, Modal } from 'react-native';
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
  const [menuVisible, setMenuVisible] = useState(false);

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

  const handleHowToPlay = () => {
    setMenuVisible(false);
    router.push('/how-to-play');
  };

  const handleRestart = () => {
    setMenuVisible(false);
    startNewGame();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <HealthBar current={health} max={maxHealth} />
          <Pressable
            style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
            onPress={() => setMenuVisible(true)}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>
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

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuModal}>
            <Text style={styles.menuTitle}>PAUSED</Text>
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.menuItemText}>Resume</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
              onPress={handleRestart}
            >
              <Text style={styles.menuItemText}>Restart</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
              onPress={handleHowToPlay}
            >
              <Text style={styles.menuItemText}>How to Play</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.menuItem, styles.menuItemDanger, pressed && styles.pressed]}
              onPress={() => { setMenuVisible(false); handleMainMenu(); }}
            >
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Quit to Menu</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  pressed: {
    opacity: 0.7,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  menuModal: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  menuItem: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuItemDanger: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.monster,
  },
  menuItemTextDanger: {
    color: COLORS.monster,
  },
});
