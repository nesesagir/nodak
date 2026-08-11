import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NodakMark } from '../components/ui/NodakMark';
import { Screen } from '../components/ui/Screen';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import type { TranslationKey } from '../i18n/types';
import { useSettings } from '../settings/SettingsContext';
import { spacing } from '../theme/tokens';
import { useAppColors } from '../theme/useAppColors';
import type { RootStackParamList } from '../navigation/types';

const STEPS: TranslationKey[] = [
  'howToPlay1',
  'howToPlay2',
  'howToPlay3',
  'howToPlay4',
  'howToPlay5',
  'howToPlay6',
  'howToPlay7',
];

export function HowToPlayScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useSettings();
  const colors = useAppColors();

  return (
    <Screen>
      <ScreenHeader
        title={t('howToPlay')}
        backLabel={t('back')}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.introCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.gridLine,
            },
          ]}
        >
          <View style={styles.introRow}>
            <NodakMark size={36} />
            <View style={styles.introCopy}>
              <Text style={[styles.brand, { color: colors.ink }]}>Nodak</Text>
              <Text style={[styles.intro, { color: colors.inkMuted }]}>
                {t('howToPlayIntro')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.list}>
          {STEPS.map((key) => (
            <View
              key={key}
              style={[
                styles.item,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.gridLine,
                },
              ]}
            >
              <View style={styles.bullet}>
                <NodakMark size={22} />
              </View>
              <Text style={[styles.itemText, { color: colors.ink }]}>
                {t(key)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footerMark}>
          <NodakMark size={48} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 1.5,
    gap: spacing.md,
  },
  introCard: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
  },
  introRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  introCopy: {
    flex: 1,
    gap: 4,
  },
  brand: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 26,
    letterSpacing: -0.5,
  },
  intro: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    lineHeight: 22,
  },
  list: {
    gap: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  bullet: {
    marginTop: 2,
  },
  itemText: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    lineHeight: 23,
  },
  footerMark: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});
