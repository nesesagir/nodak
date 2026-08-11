import { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSettings } from '../settings/SettingsContext';
import { spacing } from '../theme/tokens';
import { useAppColors } from '../theme/useAppColors';

const BALLOON_COLORS = [
  '#F4A89A',
  '#F2D08A',
  '#8EC9B0',
  '#7EB6D9',
  '#E8A4C0',
  '#D4C4A8',
  '#F0B27A',
  '#9AD0C0',
];

type BalloonSpec = {
  id: number;
  left: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  drift: number;
};

function Balloon({ spec, height }: { spec: BalloonSpec; height: number }) {
  const y = useSharedValue(height * 0.62);
  const x = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(spec.delay, withTiming(1, { duration: 280 }));
    y.value = withDelay(
      spec.delay,
      withTiming(-height * 0.25, {
        duration: spec.duration,
        easing: Easing.out(Easing.quad),
      }),
    );
    x.value = withDelay(
      spec.delay,
      withRepeat(
        withSequence(
          withTiming(spec.drift, {
            duration: Math.floor(spec.duration / 3),
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(-spec.drift, {
            duration: Math.floor(spec.duration / 3),
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0, {
            duration: Math.floor(spec.duration / 3),
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        false,
      ),
    );
  }, [height, opacity, spec, x, y]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }, { translateX: x.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.balloonWrap,
        { left: spec.left, width: spec.size },
        style,
      ]}
      pointerEvents="none"
    >
      <View
        style={[
          styles.balloon,
          {
            width: spec.size,
            height: spec.size * 1.2,
            backgroundColor: spec.color,
            borderRadius: spec.size / 2,
          },
        ]}
      />
      <View style={[styles.knot, { borderTopColor: spec.color }]} />
      <View style={[styles.string, { height: spec.size * 0.85 }]} />
    </Animated.View>
  );
}

type Props = {
  visible: boolean;
};

export function RecordBreakCelebration({ visible }: Props) {
  const { t } = useSettings();
  const colors = useAppColors();
  const { width, height } = Dimensions.get('window');
  const spin = useSharedValue(0);
  const pop = useSharedValue(0.88);
  const glow = useSharedValue(0.5);

  const balloons = useMemo<BalloonSpec[]>(() => {
    if (!visible) return [];
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: width * ((i * 0.13 + 0.04) % 0.9),
      size: 22 + (i % 5) * 5,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      delay: 60 + i * 65,
      duration: 4200 + (i % 4) * 700,
      drift: 10 + (i % 3) * 8,
    }));
  }, [visible, width]);

  useEffect(() => {
    if (!visible) return;
    spin.value = withRepeat(
      withTiming(360, { duration: 10000, easing: Easing.linear }),
      -1,
      false,
    );
    pop.value = withSequence(
      withTiming(1.05, { duration: 420, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 260 }),
    );
    glow.value = withRepeat(
      withSequence(
        withTiming(0.88, { duration: 900 }),
        withTiming(0.48, { duration: 900 }),
      ),
      -1,
      true,
    );
  }, [visible, spin, pop, glow]);

  const wheelSpinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
    shadowOpacity: glow.value * 0.4,
  }));

  if (!visible) return null;

  const label = t('timeRecordBroken').toLocaleUpperCase();

  return (
    <>
      <View style={styles.balloonLayer} pointerEvents="none">
        {balloons.map((spec) => (
          <Balloon key={spec.id} spec={spec} height={height} />
        ))}
      </View>

      <View style={styles.root} pointerEvents="none">
        <Animated.View
          style={[
            styles.badge,
            {
              backgroundColor: colors.surface,
              borderColor: colors.accent,
              shadowColor: colors.accent,
            },
            badgeStyle,
          ]}
        >
          <Animated.View style={[styles.wheelRing, wheelSpinStyle]}>
            {Array.from({ length: 12 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.candy,
                  {
                    backgroundColor:
                      i % 2 === 0 ? colors.accent : colors.primarySoft,
                    transform: [{ rotate: `${i * 30}deg` }, { translateY: -92 }],
                  },
                ]}
              />
            ))}
            <View style={[styles.wheelRim, { borderColor: colors.accent }]} />
          </Animated.View>

          <View
            style={[
              styles.wheelCenter,
              {
                backgroundColor: colors.bg,
                borderColor: colors.primarySoft,
              },
            ]}
          >
            <Text
              style={[styles.recordText, { color: colors.ink }]}
              numberOfLines={3}
            >
              {label}
            </Text>
          </View>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  balloonLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
    overflow: 'hidden',
  },
  root: {
    alignItems: 'center',
    marginBottom: spacing.md,
    minHeight: 228,
    justifyContent: 'center',
    zIndex: 2,
  },
  balloonWrap: {
    position: 'absolute',
    bottom: '8%',
    alignItems: 'center',
  },
  balloon: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  knot: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
  string: {
    width: StyleSheet.hairlineWidth * 2,
    backgroundColor: 'rgba(80,80,80,0.35)',
  },
  badge: {
    width: 228,
    height: 228,
    borderRadius: 114,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 8,
    zIndex: 2,
  },
  wheelRing: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  candy: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  wheelRim: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  wheelCenter: {
    width: 164,
    height: 164,
    borderRadius: 82,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    zIndex: 2,
  },
  recordText: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 19,
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
});
