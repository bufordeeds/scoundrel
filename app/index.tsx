import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SUIT_SYMBOLS } from '../lib/constants';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>SCOUNDREL</Text>
          <View style={styles.suits}>
            <Text style={styles.suitMonster}>{SUIT_SYMBOLS.spades}</Text>
            <Text style={styles.suitMonster}>{SUIT_SYMBOLS.clubs}</Text>
            <Text style={styles.suitWeapon}>{SUIT_SYMBOLS.diamonds}</Text>
            <Text style={styles.suitPotion}>{SUIT_SYMBOLS.hearts}</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <Pressable
            style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.pressed]}
            onPress={() => router.push('/game')}
          >
            <Text style={styles.buttonText}>NEW GAME</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.button, styles.secondaryButton, pressed && styles.pressed]}
            onPress={() => router.push('/how-to-play')}
          >
            <Text style={styles.secondaryButtonText}>HOW TO PLAY</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.button, styles.secondaryButton, pressed && styles.pressed]}
            onPress={() => router.push('/leaderboard')}
          >
            <Text style={styles.secondaryButtonText}>LEADERBOARD</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            A card game by Zach Gage & Kurt Bieg
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    color: COLORS.text,
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  suits: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  suitMonster: {
    fontSize: 32,
    color: COLORS.monster,
  },
  suitWeapon: {
    fontSize: 32,
    color: COLORS.weapon,
  },
  suitPotion: {
    fontSize: 32,
    color: COLORS.potion,
  },
  menu: {
    gap: 16,
  },
  button: {
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.monster,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.textMuted,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
});
