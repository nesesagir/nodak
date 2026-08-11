import { Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing } from '../../theme/tokens';
import { useAppColors } from '../../theme/useAppColors';

type Props = {
  title: string;
  backLabel: string;
  onBack: () => void;
};

export function ScreenHeader({ title, backLabel, onBack }: Props) {
  const colors = useAppColors();

  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} hitSlop={14} style={styles.side}>
        <Text style={[styles.back, { color: colors.primary }]}>{backLabel}</Text>
      </Pressable>
      <Text style={[styles.title, { color: colors.ink }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  side: { minWidth: 72 },
  back: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 22,
    flexShrink: 1,
    textAlign: 'center',
  },
});
