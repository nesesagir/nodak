import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { maybeShowVictoryInterstitial } from '../ads/ads';
import { RecordBreakCelebration } from '../components/RecordBreakCelebration';
import { VictoryEffect } from '../components/VictoryEffect';
import { Screen } from '../components/ui/Screen';
import { getNextLevelId } from '../data/levelsCatalog';
import { formatTime, useGame } from '../game/GameContext';
import { useSettings } from '../settings/SettingsContext';
import { useProgress } from '../storage/ProgressContext';
import { spacing } from '../theme/tokens';
import { useAppColors } from '../theme/useAppColors';
import type { RootStackParamList } from '../navigation/types';

export function VictoryScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    elapsedMs,
    mistakes,
    size,
    levelId,
    difficulty,
    mode,
    startLevel,
    startFreePlay,
  } = useGame();
  const { markCompleted, getBestTime } = useProgress();
  const { t } = useSettings();
  const colors = useAppColors();
  const saved = useRef(false);
  const [timeRecordBroken] = useState(() => {
    if (mode !== 'level' || !levelId) return false;
    const prevBest = getBestTime(levelId);
    return prevBest === undefined || elapsedMs < prevBest;
  });

  useEffect(() => {
    if (mode !== 'level' || !levelId || saved.current) return;
    saved.current = true;
    void markCompleted(levelId, elapsedMs, mistakes);
  }, [mode, levelId, elapsedMs, mistakes, markCompleted]);

  useEffect(() => {
    void maybeShowVictoryInterstitial();
  }, []);

  const best = levelId ? getBestTime(levelId) : undefined;
  const nextId = levelId ? getNextLevelId(levelId) : undefined;
  const canPlayNext = mode === 'level' && !!nextId;

  const difficultyLabel =
    difficulty === 'easy'
      ? t('easy')
      : difficulty === 'medium'
        ? t('medium')
        : difficulty === 'hard'
          ? t('hard')
          : '';

  const label = mode === 'free' ? t('serbest') : difficultyLabel;
  const primaryFg =
    colors.primary === '#111111' || colors.primary === '#000000'
      ? '#FFFFFF'
      : colors.surface;

  return (
    <Screen>
      <View style={styles.foreground}>
        {timeRecordBroken ? (
          <RecordBreakCelebration visible />
        ) : (
          <VictoryEffect title={t('victory')} />
        )}
        {timeRecordBroken ? (
          <Text style={[styles.victorySoft, { color: colors.ink }]}>
            {t('victory')}
          </Text>
        ) : null}
        <Text style={[styles.sub, { color: colors.inkMuted }]}>
          {mode === 'free' ? t('boardComplete') : t('levelComplete')}
        </Text>
        <Text style={[styles.time, { color: colors.accent }]}>
          {formatTime(elapsedMs)}
        </Text>
        <Text style={[styles.meta, { color: colors.inkMuted }]}>
          {label} · {size}×{size} · {mistakes} {t('mistakes').toLowerCase()}
          {best != null ? ` · ${formatTime(best)}` : ''}
          {timeRecordBroken ? ` · ★` : ''}
        </Text>

        <View style={styles.actions}>
          {mode === 'level' && canPlayNext && nextId ? (
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                { backgroundColor: colors.primary },
                pressed && styles.pressed,
              ]}
              onPress={() => {
                if (startLevel(nextId)) navigation.replace('Game');
              }}
            >
              <Text style={[styles.primaryText, { color: primaryFg }]}>
                {t('next')}
              </Text>
            </Pressable>
          ) : null}

          {mode === 'free' ? (
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                { backgroundColor: colors.primary },
                pressed && styles.pressed,
              ]}
              onPress={() => {
                startFreePlay(size);
                navigation.replace('Game');
              }}
            >
              <Text style={[styles.primaryText, { color: primaryFg }]}>
                {t('newBoard')}
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              mode === 'free' || canPlayNext
                ? styles.secondaryBtn
                : [styles.primaryBtn, { backgroundColor: colors.primary }],
              pressed && styles.pressed,
            ]}
            onPress={() =>
              navigation.navigate(mode === 'level' ? 'Levels' : 'Home')
            }
          >
            <Text
              style={
                mode === 'free' || canPlayNext
                  ? [styles.secondaryText, { color: colors.inkMuted }]
                  : [styles.primaryText, { color: primaryFg }]
              }
            >
              {mode === 'level' ? t('levels') : t('menu')}
            </Text>
          </Pressable>

          {mode === 'level' ? (
            <Pressable
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && styles.pressed,
              ]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={[styles.secondaryText, { color: colors.inkMuted }]}>
                {t('menu')}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  foreground: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  victorySoft: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 28,
    marginTop: spacing.xs,
  },
  sub: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 18,
    marginTop: spacing.sm,
  },
  time: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 32,
    marginTop: spacing.lg,
  },
  meta: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  actions: {
    gap: spacing.md,
  },
  primaryBtn: {
    borderRadius: 18,
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
  },
  secondaryBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  primaryText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 17,
  },
  secondaryText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
  },
  pressed: {
    opacity: 0.88,
  },
});
