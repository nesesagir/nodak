import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { showRewardedHintAd } from '../ads/ads';
import { Board } from '../components/Board';
import { HintAdModal } from '../components/HintAdModal';
import { Numpad } from '../components/Numpad';
import { Screen } from '../components/ui/Screen';
import {
  MAX_HINTS,
  MAX_MISTAKES,
  MAX_REVIVES,
  REVIVE_SECONDS,
} from '../game/constants';
import { formatTime, useGame } from '../game/GameContext';
import { useSettings } from '../settings/SettingsContext';
import { spacing } from '../theme/tokens';
import { useAppColors } from '../theme/useAppColors';
import type { RootStackParamList } from '../navigation/types';

export function GameScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    size,
    elapsedMs,
    mistakes,
    hintsLeft,
    revivesUsed,
    status,
    selected,
    levelId,
    mode,
    useHint,
    grantExtraHint,
    reviveFromAd,
  } = useGame();
  const { t } = useSettings();
  const colors = useAppColors();

  const [adVisible, setAdVisible] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const [reviveVisible, setReviveVisible] = useState(false);
  const [reviveLoading, setReviveLoading] = useState(false);
  const [reviveSec, setReviveSec] = useState(REVIVE_SECONDS);
  const revivePaused = useRef(false);

  useEffect(() => {
    if (status === 'won') navigation.replace('Victory');
  }, [status, navigation]);

  useEffect(() => {
    if (status !== 'lost') {
      setReviveVisible(false);
      return;
    }
    if (revivesUsed >= MAX_REVIVES) {
      navigation.replace('GameOver');
      return;
    }

    setReviveVisible(true);
    setReviveSec(REVIVE_SECONDS);
    revivePaused.current = false;

    const id = setInterval(() => {
      if (revivePaused.current) return;
      setReviveSec((s) => {
        if (s <= 1) {
          clearInterval(id);
          setReviveVisible(false);
          navigation.replace('GameOver');
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [status, revivesUsed, navigation]);

  const levelLabel = levelId
    ? levelId.replace('easy-', 'K').replace('medium-', 'O').replace('hard-', 'Z')
    : `${t('serbest')} ${size}×${size}`;

  const onHelpPress = () => {
    if (status !== 'playing') return;
    if (hintsLeft > 0) {
      useHint();
      return;
    }
    setAdVisible(true);
  };

  const onWatchHintAd = async () => {
    setAdLoading(true);
    try {
      const result = await showRewardedHintAd();
      if (result === 'rewarded') {
        grantExtraHint();
        setAdVisible(false);
      }
    } finally {
      setAdLoading(false);
    }
  };

  const onWatchReviveAd = async () => {
    setReviveLoading(true);
    revivePaused.current = true;
    try {
      const result = await showRewardedHintAd();
      if (result === 'rewarded' && reviveFromAd()) {
        setReviveVisible(false);
        return;
      }
      setReviveVisible(false);
      navigation.replace('GameOver');
    } finally {
      setReviveLoading(false);
      revivePaused.current = false;
    }
  };

  const skipRevive = () => {
    if (reviveLoading) return;
    setReviveVisible(false);
    navigation.replace('GameOver');
  };

  const helpFilled = hintsLeft > 0;
  const helpFg =
    helpFilled &&
    (colors.accent === '#111111' || colors.accent === '#000000')
      ? '#FFFFFF'
      : helpFilled
        ? colors.surface
        : colors.ink;

  const reviveLeft = MAX_REVIVES - revivesUsed;

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable
          onPress={() =>
            navigation.navigate(mode === 'level' ? 'Levels' : 'Home')
          }
          hitSlop={12}
          style={styles.topSide}
        >
          <Text style={[styles.back, { color: colors.primary }]}>{t('back')}</Text>
        </Pressable>
        <View
          style={[
            styles.levelPill,
            { backgroundColor: colors.primarySoft, borderColor: colors.gridLine },
          ]}
        >
          <Text style={[styles.level, { color: colors.ink }]}>{levelLabel}</Text>
        </View>
        <View style={[styles.topSide, styles.topSideEnd]}>
          <Text style={[styles.timer, { color: colors.accent }]}>
            {formatTime(elapsedMs)}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.hintBar,
          { backgroundColor: colors.surface, borderColor: colors.gridLine },
        ]}
      >
        <Text style={[styles.hint, { color: colors.inkMuted }]}>
          {selected ? t('selectDigit') : t('selectCell')}
        </Text>
      </View>

      <View style={styles.boardArea}>
        <Board />
      </View>

      <View style={styles.stats}>
        <View
          style={[
            styles.statPill,
            { backgroundColor: colors.primarySoft, borderColor: colors.gridLine },
          ]}
        >
          <Text style={[styles.stat, { color: colors.ink }]}>
            {t('mistakes')} {mistakes}/{MAX_MISTAKES}
          </Text>
        </View>
        <Pressable
          disabled={status !== 'playing'}
          onPress={onHelpPress}
          style={({ pressed }) => [
            styles.helpBtn,
            {
              backgroundColor: helpFilled ? colors.accent : colors.surface,
              borderColor: colors.primary,
            },
            status !== 'playing' && styles.helpDisabled,
            pressed && status === 'playing' && styles.pressed,
          ]}
        >
          <Text style={[styles.helpText, { color: helpFg }]}>
            {hintsLeft > 0
              ? `${t('help')} ${hintsLeft}/${MAX_HINTS}`
              : t('helpAd')}
          </Text>
        </Pressable>
      </View>

      <Numpad />

      <HintAdModal
        visible={adVisible}
        loading={adLoading}
        title={t('extraHelpTitle')}
        body={t('extraHelpBody')}
        watchLabel={t('watchAd')}
        onWatch={() => {
          void onWatchHintAd();
        }}
        onClose={() => {
          if (!adLoading) setAdVisible(false);
        }}
      />

      <HintAdModal
        visible={reviveVisible}
        loading={reviveLoading}
        title={t('continueTitle')}
        body={`${t('continueBody')} (${reviveSec} ${t('continueSec')}) · ${reviveLeft}/${MAX_REVIVES}`}
        watchLabel={t('continueWatch')}
        onWatch={() => {
          void onWatchReviveAd();
        }}
        onClose={skipRevive}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  topSide: { minWidth: 72 },
  topSideEnd: { alignItems: 'flex-end' },
  back: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
  },
  levelPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  level: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
  },
  timer: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
  hintBar: {
    marginHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  hint: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  boardArea: {
    flex: 1,
    justifyContent: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  statPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  stat: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
  },
  helpBtn: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm + 2,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  helpDisabled: { opacity: 0.4 },
  helpText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
  },
  pressed: { opacity: 0.85 },
});
