import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSettings } from '../settings/SettingsContext';
import { spacing } from '../theme/tokens';
import { useAppColors } from '../theme/useAppColors';

type Props = {
  title: string;
};

function CrackLine({
  top,
  color,
  thick,
  wind,
  index,
}: {
  top: number;
  color: string;
  thick: boolean;
  wind: boolean;
  index: number;
}) {
  const crack = useSharedValue(0);
  const drift = useSharedValue(0);

  useEffect(() => {
    crack.value = withTiming(1, {
      duration: wind ? 900 : 700,
      easing: Easing.out(Easing.cubic),
    });
    if (wind) {
      drift.value = withTiming(1, {
        duration: 1100,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [crack, drift, wind]);

  const style = useAnimatedStyle(() => ({
    opacity: crack.value * 0.85,
    transform: [
      { scaleX: Math.max(0.02, crack.value) },
      { translateX: wind ? drift.value * (40 + index * 12) : 0 },
      { rotate: `${(index - 1) * 8}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.line,
        {
          top,
          backgroundColor: color,
          height: thick ? 3 : StyleSheet.hairlineWidth * 2,
        },
        style,
      ]}
    />
  );
}

export function VictoryEffect({ title }: Props) {
  const { theme } = useSettings();
  const colors = useAppColors();
  const overlay = useSharedValue(theme.victory === 'none' ? 0 : 1);
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.92);

  useEffect(() => {
    if (theme.victory === 'none') {
      titleOpacity.value = withTiming(1, { duration: 400 });
      titleScale.value = withTiming(1, { duration: 400 });
      return;
    }

    overlay.value = 1;
    titleOpacity.value = 0;
    overlay.value = withDelay(
      280,
      withTiming(0, { duration: 700, easing: Easing.inOut(Easing.quad) }),
    );
    titleOpacity.value = withDelay(420, withTiming(1, { duration: 450 }));
    titleScale.value = withDelay(
      420,
      withSequence(
        withTiming(1.04, { duration: 280 }),
        withTiming(1, { duration: 220 }),
      ),
    );
  }, [theme.victory, overlay, titleOpacity, titleScale]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlay.value }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const lineColor =
    theme.victory === 'fireBurn'
      ? 'rgba(224,138,93,0.75)'
      : theme.victory === 'woodBreak'
        ? 'rgba(176,137,104,0.8)'
        : theme.victory === 'iceCrack'
          ? 'rgba(180,220,240,0.9)'
          : theme.victory === 'blossomBloom'
            ? 'rgba(212,160,181,0.7)'
            : theme.victory === 'nightFade'
              ? 'rgba(143,168,200,0.65)'
              : 'rgba(255,255,255,0.55)';

  const wind = theme.victory === 'windBlow';
  const thick = theme.victory === 'fireBurn';

  return (
    <View style={styles.wrap}>
      {theme.victory !== 'none' ? (
        <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="none">
          {[0, 1, 2].map((i) => (
            <CrackLine
              key={`${theme.id}-${i}`}
              index={i}
              top={36 + i * 22}
              color={lineColor}
              thick={thick}
              wind={wind}
            />
          ))}
        </Animated.View>
      ) : null}

      <Animated.View style={titleStyle}>
        <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 120,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
  },
  line: {
    position: 'absolute',
    left: '8%',
    width: '84%',
    borderRadius: 2,
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 44,
  },
});
