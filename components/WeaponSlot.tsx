import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Weapon } from '../types';
import { Card } from './Card';
import { COLORS } from '../lib/constants';

interface WeaponSlotProps {
  weapon: Weapon | null;
}

export function WeaponSlot({ weapon }: WeaponSlotProps) {
  if (!weapon) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <View style={styles.emptySlot}>
            <Text style={styles.emptyText}>No Weapon</Text>
          </View>
          <Text style={styles.hint}>Equip a diamond card to reduce damage from monsters</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>EQUIPPED WEAPON</Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>Attack: {weapon.card.value}</Text>
          <Text style={styles.stat}>
            Can kill: {weapon.maxTarget >= 14 ? 'Any' : weapon.maxTarget > 0 ? `≤ ${weapon.maxTarget}` : 'None'}
          </Text>
        </View>
      </View>

      <View style={styles.weaponDisplay}>
        <Card card={weapon.card} size="large" />

        {weapon.killStack.length > 0 && (
          <View style={styles.killStackContainer}>
            <Text style={styles.killLabel}>KILLS ({weapon.killStack.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.killScroll}>
              <View style={styles.killStack}>
                {weapon.killStack.map((card, index) => (
                  <View key={card.id} style={[styles.killedCard, { marginLeft: index > 0 ? -30 : 0 }]}>
                    <Card card={card} size="medium" disabled />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptySlot: {
    width: 90,
    height: 130,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  hint: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  label: {
    color: COLORS.weapon,
    fontSize: 14,
    fontWeight: 'bold',
  },
  stats: {
    alignItems: 'flex-end',
  },
  stat: {
    color: COLORS.text,
    fontSize: 14,
  },
  weaponDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  killStackContainer: {
    flex: 1,
  },
  killLabel: {
    color: COLORS.monster,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  killScroll: {
    flex: 1,
  },
  killStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  killedCard: {
    opacity: 0.9,
  },
});
