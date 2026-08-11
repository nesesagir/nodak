import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/ui/Screen';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { DIFFICULTIES, type Difficulty } from '../data/levelTypes';
import { getLevels } from '../data/levelsCatalog';
import { isLevelUnlocked } from '../data/levelUnlock';
import { formatTime, useGame } from '../game/GameContext';
import { useSettings } from '../settings/SettingsContext';
import { useProgress } from '../storage/ProgressContext';
import { spacing } from '../theme/tokens';
import { useAppColors } from '../theme/useAppColors';
import type { RootStackParamList } from '../navigation/types';

export function LevelsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { startLevel } = useGame();
  const { isLevelCompleted, getBestTime } = useProgress();
  const { t } = useSettings();
  const colors = useAppColors();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const levels = useMemo(() => getLevels(difficulty), [difficulty]);

  const labelFor = (key: Difficulty) =>
    key === 'easy' ? t('easy') : key === 'medium' ? t('medium') : t('hard');

  return (
    <Screen>
      <ScreenHeader
        title={t('levels')}
        backLabel={t('back')}
        onBack={() => navigation.goBack()}
      />

      <Text style={[styles.lockHint, { color: colors.inkMuted }]}>
        {t('lockHint')}
      </Text>

      <View
        style={[
          styles.tabs,
          { backgroundColor: colors.surface, borderColor: colors.gridLine },
        ]}
      >
        {DIFFICULTIES.map((key) => {
          const active = key === difficulty;
          return (
            <Pressable
              key={key}
              onPress={() => setDifficulty(key)}
              style={[
                styles.tab,
                active && { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: active
                      ? colors.primary === '#111111' || colors.primary === '#000000'
                        ? '#FFFFFF'
                        : colors.surface
                      : colors.inkMuted,
                  },
                ]}
              >
                {labelFor(key)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={levels}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={4}
        renderItem={({ item, index }) => {
          const done = isLevelCompleted(item.id);
          const unlocked = isLevelUnlocked(item.id, isLevelCompleted);
          const best = getBestTime(item.id);
          return (
            <Pressable
              disabled={!unlocked}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: done ? colors.primarySoft : colors.surface,
                  borderColor: done ? colors.primary : colors.gridLine,
                },
                !unlocked && styles.cardLocked,
                pressed && unlocked && styles.pressed,
              ]}
              onPress={() => {
                if (!unlocked) return;
                if (startLevel(item.id)) navigation.navigate('Game');
              }}
            >
              <Text
                style={[
                  styles.cardNum,
                  { color: !unlocked ? colors.inkMuted : colors.ink },
                ]}
              >
                {unlocked ? index + 1 : '—'}
              </Text>
              <Text style={[styles.cardMeta, { color: colors.inkMuted }]}>
                {!unlocked
                  ? t('locked')
                  : done && best != null
                    ? formatTime(best)
                    : `${item.size}×${item.size}`}
              </Text>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lockHint: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    lineHeight: 18,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: 11,
    alignItems: 'center',
  },
  tabText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    flex: 1,
    margin: spacing.xs,
    minHeight: 76,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: '25%',
  },
  cardLocked: { opacity: 0.4 },
  cardNum: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 18,
  },
  cardMeta: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    marginTop: 3,
  },
  pressed: { opacity: 0.85 },
});
