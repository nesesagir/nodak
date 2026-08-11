import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/ui/Screen';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { LANGS, LANG_LABELS } from '../i18n/translations';
import { useSettings } from '../settings/SettingsContext';
import {
  BG_PRESETS,
  BOARD_PRESETS,
  THEMES,
  type ThemeId,
} from '../settings/themes';
import { spacing } from '../theme/tokens';
import { useAppColors } from '../theme/useAppColors';
import type { RootStackParamList } from '../navigation/types';

export function SettingsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    t,
    language,
    setLanguage,
    themeId,
    applyThemeDefaults,
    backgroundColor,
    boardColor,
    setBackgroundColor,
    setBoardColor,
    soundEnabled,
    setSoundEnabled,
    resetToPlain,
    isPlain,
  } = useSettings();
  const colors = useAppColors();

  const onPickTheme = (id: ThemeId) => {
    if (id === 'mist') {
      resetToPlain();
      return;
    }
    applyThemeDefaults(id);
  };

  return (
    <Screen>
      <ScreenHeader
        title={t('settings')}
        backLabel={t('back')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.section, { color: colors.inkMuted }]}>{t('sound')}</Text>
        <View style={styles.chips}>
          {([true, false] as const).map((on) => {
            const active = soundEnabled === on;
            return (
              <Pressable
                key={on ? 'on' : 'off'}
                onPress={() => setSoundEnabled(on)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.primarySoft : colors.surface,
                    borderColor: active ? colors.primary : colors.gridLine,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: colors.ink }]}>
                  {on ? t('soundOn') : t('soundOff')}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.hint, { color: colors.inkMuted }]}>{t('soundHint')}</Text>

        <Text style={[styles.section, { color: colors.inkMuted }]}>{t('language')}</Text>
        <View style={styles.chips}>
          {LANGS.map((lang) => {
            const active = language === lang;
            return (
              <Pressable
                key={lang}
                onPress={() => setLanguage(lang)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.primarySoft : colors.surface,
                    borderColor: active ? colors.primary : colors.gridLine,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: colors.ink }]}>
                  {LANG_LABELS[lang]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.section, { color: colors.inkMuted }]}>{t('theme')}</Text>
        <View style={styles.chips}>
          {THEMES.map((theme) => {
            const active = themeId === theme.id;
            const label = language === 'tr' ? theme.labelTr : theme.labelEn;
            return (
              <Pressable
                key={theme.id}
                onPress={() => onPickTheme(theme.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.primarySoft : colors.surface,
                    borderColor: active ? theme.accent : colors.gridLine,
                  },
                ]}
              >
                <View style={[styles.swatch, { backgroundColor: theme.accent }]} />
                <Text style={[styles.chipText, { color: colors.ink }]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.hint, { color: colors.inkMuted }]}>
          {language === 'tr'
            ? 'Varsayılan siyah-beyazdır. Diğer temalar renk ve atmosfer ekler.'
            : 'Default is black & white. Other themes add color and atmosphere.'}
        </Text>
        {!isPlain ? (
          <Pressable
            onPress={resetToPlain}
            style={[
              styles.resetBtn,
              { borderColor: colors.gridLine, backgroundColor: colors.surface },
            ]}
          >
            <Text style={[styles.resetText, { color: colors.ink }]}>
              {language === 'tr' ? 'Varsayılana dön' : 'Reset to default'}
            </Text>
          </Pressable>
        ) : null}

        <Text style={[styles.section, { color: colors.inkMuted }]}>{t('bgColor')}</Text>
        <View style={styles.palette}>
          {BG_PRESETS.map((hex) => (
            <Pressable
              key={`bg-${hex}`}
              onPress={() => setBackgroundColor(hex)}
              style={[
                styles.colorDot,
                {
                  backgroundColor: hex,
                  borderColor:
                    backgroundColor === hex ? colors.primary : colors.gridLine,
                  borderWidth: backgroundColor === hex ? 2 : StyleSheet.hairlineWidth,
                },
              ]}
            />
          ))}
        </View>

        <Text style={[styles.section, { color: colors.inkMuted }]}>{t('boardColor')}</Text>
        <View style={styles.palette}>
          {BOARD_PRESETS.map((hex) => (
            <Pressable
              key={`board-${hex}`}
              onPress={() => setBoardColor(hex)}
              style={[
                styles.colorDot,
                {
                  backgroundColor: hex,
                  borderColor:
                    boardColor === hex ? colors.primary : colors.gridLine,
                  borderWidth: boardColor === hex ? 2 : StyleSheet.hairlineWidth,
                },
              ]}
            />
          ))}
        </View>

        <Text style={[styles.section, { color: colors.inkMuted }]}>{t('preview')}</Text>
        <View
          style={[
            styles.preview,
            { backgroundColor: colors.bg, borderColor: colors.gridLine },
          ]}
        >
          <View style={[styles.previewBoard, { backgroundColor: colors.board }]}>
            {[0, 1, 2].map((r) => (
              <View key={r} style={styles.previewRow}>
                {[0, 1, 2].map((c) => (
                  <View
                    key={c}
                    style={[
                      styles.previewCell,
                      {
                        backgroundColor:
                          r === 1 && c === 1 ? colors.primarySoft : colors.cellEmpty,
                        borderColor: colors.gridLine,
                      },
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  section: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  hint: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  resetBtn: {
    marginTop: spacing.md,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  resetText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  preview: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  previewBoard: {
    padding: 8,
    borderRadius: 10,
  },
  previewRow: {
    flexDirection: 'row',
  },
  previewCell: {
    width: 28,
    height: 28,
    margin: 2,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
