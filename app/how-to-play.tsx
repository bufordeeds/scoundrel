import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SUIT_SYMBOLS } from '../lib/constants';

export default function HowToPlayScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{'\u2190'} Back</Text>
        </Pressable>
        <Text style={styles.title}>HOW TO PLAY</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goal</Text>
          <Text style={styles.text}>
            Survive the dungeon with as much health as possible. Clear rooms by interacting with 3 of 4 cards, leaving 1 for the next room.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Types</Text>

          <View style={styles.cardType}>
            <Text style={styles.suitMonster}>{SUIT_SYMBOLS.spades} {SUIT_SYMBOLS.clubs}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>Monsters</Text>
              <Text style={styles.text}>Fight barehanded (take full damage) or with a weapon (take the difference).</Text>
            </View>
          </View>

          <View style={styles.cardType}>
            <Text style={styles.suitWeapon}>{SUIT_SYMBOLS.diamonds}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>Weapons</Text>
              <Text style={styles.text}>Equip to reduce damage from monsters. Replaces your current weapon.</Text>
            </View>
          </View>

          <View style={styles.cardType}>
            <Text style={styles.suitPotion}>{SUIT_SYMBOLS.hearts}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>Potions</Text>
              <Text style={styles.text}>Heal by the card's value (max 20 HP). Only 1 heals per room.</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weapon Rules</Text>
          <Text style={styles.text}>
            After killing a monster, your weapon can only kill monsters with a lower value than the last kill. Choose your targets wisely!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avoiding Rooms</Text>
          <Text style={styles.text}>
            You can avoid a room once, sending all cards to the bottom of the deck. You cannot avoid twice in a row.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scoring</Text>
          <Text style={styles.text}>
            {'\u2022'} Death: Negative sum of remaining monsters{'\n'}
            {'\u2022'} Survival: Your remaining HP{'\n'}
            {'\u2022'} Perfect (20 HP + potion last): Bonus points!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  backButton: {
    marginBottom: 8,
  },
  backText: {
    color: COLORS.weapon,
    fontSize: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
  },
  cardType: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  suitMonster: {
    fontSize: 24,
    color: COLORS.monster,
    width: 50,
  },
  suitWeapon: {
    fontSize: 24,
    color: COLORS.weapon,
    width: 50,
  },
  suitPotion: {
    fontSize: 24,
    color: COLORS.potion,
    width: 50,
  },
});
