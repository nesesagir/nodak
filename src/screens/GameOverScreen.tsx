import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { maybeShowGameOverInterstitial } from '../ads/ads';
import { Screen } from '../components/ui/Screen';
import { MAX_MISTAKES } from '../game/constants';
import { formatTime, useGame } from '../game/GameContext';
import { useSettings } from '../settings/SettingsContext';
import { spacing } from '../theme/tokens';
import { useAppColors } from '../theme/useAppColors';
import type { RootStackParamList } from '../navigation/types';

export function GameOverScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { elapsedMs, size, levelId, mode, startLevel, startFreePlay } =
    useGame();
  const { t } = useSettings();
  const colors = useAppColors();

  useEffect(() => {
    void maybeShowGameOverInterstitial();
  }, []);

  const retry = () => {
    if (mode === 'level' && levelId) {
      if (startLevel(levelId)) navigation.replace('Game');
      return;
    }
    startFreePlay(size);
    navigation.replace('Game');
  };

  const primaryFg =
    colors.primary === '#111111' || colors.primary === '#000000'
      ? '#FFFFFF'
      : colors.surface;

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('gameOver')}</Text>
        <Text style={[styles.sub, { color: colors.danger }]}>
          {MAX_MISTAKES} {t('mistakesOut')}
        </Text>
        <Text style={[styles.time, { color: colors.inkMuted }]}>
          {formatTime(elapsedMs)}
        </Text>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: colors.primary },
              pressed && styles.pressed,
            ]}
            onPress={retry}
          >
            <Text style={[styles.primaryText, { color: primaryFg }]}>
              {t('retry')}
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            onPress={() =>
              navigation.navigate(mode === 'level' ? 'Levels' : 'Home')
            }
          >
            <Text style={[styles.secondaryText, { color: colors.inkMuted }]}>
              {mode === 'level' ? t('levels') : t('menu')}
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 44,
    letterSpacing: -1,
  },
  sub: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 17,
    marginTop: spacing.sm,
  },
  time: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 24,
    marginTop: spacing.lg,
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
