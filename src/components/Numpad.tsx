import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DIGITS, type Digit } from '../core';
import { useGame } from '../game/GameContext';
import { useSettings } from '../settings/SettingsContext';
import { spacing } from '../theme/tokens';
import { useAppColors } from '../theme/useAppColors';

export function Numpad() {
  const { placeDigit, clearCell, selected, status } = useGame();
  const { language } = useSettings();
  const colors = useAppColors();
  const disabled = status !== 'playing' || !selected;
  const clearLabel =
    language === 'tr'
      ? 'Sil'
      : language === 'de'
        ? 'Löschen'
        : language === 'es'
          ? 'Borrar'
          : 'Clear';
  const [pressedDigit, setPressedDigit] = useState<Digit | null>(null);

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.surface,
          borderColor: colors.gridLine,
        },
      ]}
    >
      <View style={styles.row}>
        {DIGITS.map((digit: Digit) => {
          const pressed = pressedDigit === digit;
          const on = pressed && !disabled;
          return (
            <Pressable
              key={digit}
              disabled={disabled}
              onPress={() => placeDigit(digit)}
              onPressIn={() => setPressedDigit(digit)}
              onPressOut={() => setPressedDigit(null)}
              style={[
                styles.key,
                {
                  backgroundColor: on ? colors.primary : colors.primarySoft,
                  borderColor: on ? colors.primary : 'transparent',
                },
                disabled && styles.keyDisabled,
              ]}
            >
              <Text
                style={[
                  styles.keyText,
                  {
                    color: on
                      ? colors.primary === '#111111' || colors.primary === '#000000'
                        ? '#FFFFFF'
                        : colors.surface
                      : colors.ink,
                  },
                ]}
              >
                {digit}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          disabled={disabled}
          onPress={clearCell}
          style={({ pressed }) => [
            styles.key,
            styles.clearKey,
            {
              backgroundColor: colors.bg,
              borderColor: colors.gridLine,
            },
            disabled && styles.keyDisabled,
            pressed && !disabled && { opacity: 0.85 },
          ]}
        >
          <Text style={[styles.clearText, { color: colors.inkMuted }]}>
            {clearLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 20,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  key: {
    flex: 1,
    minHeight: 52,
    maxHeight: 64,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  clearKey: {
    flex: 1.15,
  },
  keyDisabled: {
    opacity: 0.4,
  },
  keyText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 22,
    fontWeight: '700',
  },
  clearText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 15,
  },
});
