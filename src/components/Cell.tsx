import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { CellValue } from '../core';
import type { CellKind } from '../game/types';
import { spacing } from '../theme/tokens';
import { useAppColors } from '../theme/useAppColors';

type Props = {
  value: CellValue;
  kind: CellKind;
  selected: boolean;
  errorToken: number;
  isError: boolean;
  size: number;
  onPress: () => void;
  onErrorDone: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Cell({
  value,
  kind,
  selected,
  errorToken,
  isError,
  size,
  onPress,
  onErrorDone,
}: Props) {
  const colors = useAppColors();
  const flash = useSharedValue(0);

  let baseColor: string = colors.cellEmpty;
  if (kind === 'clue') baseColor = colors.cellClue;
  if (kind === 'blocked') baseColor = colors.cellBlocked;
  if (selected) baseColor = colors.primarySoft;

  useEffect(() => {
    if (!isError || errorToken === 0) return;
    flash.value = withSequence(
      withTiming(1, { duration: 90 }),
      withTiming(0, { duration: 90 }),
      withTiming(1, { duration: 90 }),
      withTiming(0, { duration: 160 }),
    );
    const timer = setTimeout(onErrorDone, 450);
    return () => clearTimeout(timer);
  }, [errorToken, isError, flash, onErrorDone]);

  const danger = colors.danger;
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: flash.value > 0.5 ? danger : baseColor,
  }));

  const disabled = kind !== 'playable';
  const showValue = value !== 0;

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          borderColor: selected ? colors.primary : colors.gridLine,
          borderWidth: selected ? 2 : 1,
          opacity: 1,
        },
        animatedStyle,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: Math.max(18, size * 0.46),
            color: '#000000',
            fontWeight: kind === 'clue' ? '700' : '600',
          },
        ]}
      >
        {showValue ? String(value) : ''}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.xs / 2,
    borderRadius: 6,
  },
  text: {
    fontFamily: 'DMSans_500Medium',
  },
});
