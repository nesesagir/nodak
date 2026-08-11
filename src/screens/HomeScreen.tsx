import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { NodakMark } from '../components/ui/NodakMark';
import { Screen } from '../components/ui/Screen';
import { getLevelCounts } from '../data/levelsCatalog';
import { useGame } from '../game/GameContext';
import { useSettings } from '../settings/SettingsContext';
import { spacing } from '../theme/tokens';
import { useAppColors } from '../theme/useAppColors';
import type { RootStackParamList } from '../navigation/types';

export function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { startFreePlay } = useGame();
  const { t } = useSettings();
  const colors = useAppColors();
  const counts = getLevelCounts();
  const total = counts.easy + counts.medium + counts.hard;

  const brandY = useSharedValue(18);
  const brandOp = useSharedValue(0);
  const actionsOp = useSharedValue(0);

  useEffect(() => {
    brandOp.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) });
    brandY.value = withTiming(0, { duration: 560, easing: Easing.out(Easing.cubic) });
    actionsOp.value = withDelay(160, withTiming(1, { duration: 480 }));
  }, [actionsOp, brandOp, brandY]);

  const brandStyle = useAnimatedStyle(() => ({
    opacity: brandOp.value,
    transform: [{ translateY: brandY.value }],
  }));
  const actionsStyle = useAnimatedStyle(() => ({
    opacity: actionsOp.value,
  }));

  const free = (size: 6 | 8) => {
    startFreePlay(size);
    navigation.navigate('Game');
  };

  const primaryLabelColor =
    colors.primary === '#111111' ||
    colors.primary === '#000000' ||
    colors.primary.toLowerCase() === '#111'
      ? '#FFFFFF'
      : colors.surface;

  return (
    <Screen>
      <View style={styles.foreground}>
        <Animated.View style={[styles.hero, brandStyle]}>
          <View style={styles.brandRow}>
            <NodakMark size={52} />
            <Text style={[styles.brand, { color: colors.ink }]}>Nodak</Text>
          </View>
          <Text style={[styles.tagline, { color: colors.inkMuted }]}>
            {t('tagline')}
          </Text>
          <View style={[styles.metaPill, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.meta, { color: colors.inkMuted }]}>
              {total} {t('readyLevels')}
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.actions, actionsStyle]}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryCta,
              { backgroundColor: colors.primary },
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.navigate('Levels')}
          >
            <Text style={[styles.primaryCtaText, { color: primaryLabelColor }]}>
              {t('levels')}
            </Text>
            <Text style={[styles.primaryCtaHint, { color: primaryLabelColor }]}>
              {t('easy')} · {t('medium')} · {t('hard')}
            </Text>
          </Pressable>

          <Text style={[styles.section, { color: colors.inkMuted }]}>
            {t('freePlay')}
          </Text>
          <View
            style={[
              styles.segment,
              { backgroundColor: colors.surface, borderColor: colors.gridLine },
            ]}
          >
            {([6, 8] as const).map((size) => (
              <Pressable
                key={size}
                style={({ pressed }) => [
                  styles.segmentBtn,
                  pressed && { backgroundColor: colors.primarySoft },
                ]}
                onPress={() => free(size)}
              >
                <Text style={[styles.segmentSize, { color: colors.ink }]}>
                  {size}×{size}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.footerLinks}>
            <Pressable
              onPress={() => navigation.navigate('HowToPlay')}
              hitSlop={10}
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <Text style={[styles.link, { color: colors.ink }]}>{t('howToPlay')}</Text>
            </Pressable>
            <Text style={[styles.dot, { color: colors.inkMuted }]}>·</Text>
            <Pressable
              onPress={() => navigation.navigate('Settings')}
              hitSlop={10}
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <Text style={[styles.link, { color: colors.ink }]}>{t('settings')}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  foreground: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
  },
  hero: {
    paddingTop: spacing.xl * 1.6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  brand: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 56,
    letterSpacing: -2,
    lineHeight: 60,
  },
  tagline: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 19,
    marginTop: spacing.md,
    maxWidth: 280,
    lineHeight: 28,
  },
  metaPill: {
    alignSelf: 'flex-start',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
  },
  meta: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
  },
  actions: {
    gap: spacing.md,
  },
  primaryCta: {
    borderRadius: 18,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  primaryCtaText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 20,
  },
  primaryCtaHint: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    marginTop: 4,
    opacity: 0.75,
  },
  section: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  },
  segment: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  segmentSize: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 18,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  link: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 15,
  },
  dot: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
  },
  pressed: {
    opacity: 0.75,
  },
});
