import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Card as CardType, Weapon } from '../types';
import { Card } from './Card';
import { COLORS, SUIT_SYMBOLS, RANK_DISPLAY } from '../lib/constants';

interface CardActionModalProps {
  visible: boolean;
  card: CardType | null;
  weapon: Weapon | null;
  onFightBareHanded: () => void;
  onFightWithWeapon: () => void;
  onCancel: () => void;
}

export function CardActionModal({
  visible,
  card,
  weapon,
  onFightBareHanded,
  onFightWithWeapon,
  onCancel,
}: CardActionModalProps) {
  if (!card) return null;

  const canUseWeapon = weapon && card.value <= weapon.maxTarget;
  const weaponDamage = weapon ? Math.max(0, card.value - weapon.card.value) : 0;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.modal}>
          <View style={styles.cardPreview}>
            <Card card={card} size="large" />
          </View>

          <Text style={styles.title}>
            {SUIT_SYMBOLS[card.suit]} {RANK_DISPLAY[card.rank]} ({card.value} DMG)
          </Text>

          <View style={styles.options}>
            <Pressable
              style={({ pressed }) => [styles.option, pressed && styles.pressed]}
              onPress={onFightBareHanded}
            >
              <Text style={styles.optionTitle}>FIGHT BAREHANDED</Text>
              <Text style={styles.optionDamage}>Take {card.value} damage</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.option,
                styles.weaponOption,
                !canUseWeapon && styles.disabled,
                pressed && canUseWeapon && styles.pressed,
              ]}
              onPress={onFightWithWeapon}
              disabled={!canUseWeapon}
            >
              <Text style={[styles.optionTitle, !canUseWeapon && styles.disabledText]}>
                USE WEAPON {weapon ? `(${SUIT_SYMBOLS.diamonds}${weapon.card.value})` : ''}
              </Text>
              {canUseWeapon ? (
                <Text style={styles.optionDamage}>
                  Take {weaponDamage} damage
                </Text>
              ) : !weapon ? (
                <Text style={styles.optionHint}>No weapon equipped</Text>
              ) : (
                <Text style={styles.optionHint}>
                  Weapon can only kill ≤{weapon.maxTarget}
                </Text>
              )}
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
            onPress={onCancel}
          >
            <Text style={styles.cancelText}>CANCEL</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  cardPreview: {
    marginBottom: 16,
  },
  title: {
    color: COLORS.monster,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  options: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  option: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  weaponOption: {
    borderWidth: 2,
    borderColor: COLORS.weapon,
  },
  disabled: {
    opacity: 0.5,
    borderColor: COLORS.textMuted,
  },
  optionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionDamage: {
    color: COLORS.monster,
    fontSize: 14,
    marginTop: 4,
  },
  optionHint: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  cancelText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
