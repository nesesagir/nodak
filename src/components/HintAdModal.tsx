import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing } from '../theme/tokens';
import { useAppColors } from '../theme/useAppColors';
import { useSettings } from '../settings/SettingsContext';

type Props = {
  visible: boolean;
  loading: boolean;
  title: string;
  body: string;
  watchLabel: string;
  onWatch: () => void;
  onClose: () => void;
};

export function HintAdModal({
  visible,
  loading,
  title,
  body,
  watchLabel,
  onWatch,
  onClose,
}: Props) {
  const colors = useAppColors();
  const { t } = useSettings();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
          <Text style={[styles.body, { color: colors.inkMuted }]}>{body}</Text>

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.inkMuted }]}>
                {t('adLoading')}
              </Text>
            </View>
          ) : (
            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  { backgroundColor: colors.primary },
                  pressed && styles.pressed,
                ]}
                onPress={onWatch}
              >
                <Text style={[styles.primaryText, { color: colors.surface }]}>
                  {watchLabel}
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  pressed && styles.pressed,
                ]}
                onPress={onClose}
              >
                <Text style={[styles.secondaryText, { color: colors.inkMuted }]}>
                  {t('cancel')}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(47, 58, 68, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    borderRadius: 18,
    padding: spacing.lg,
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 26,
  },
  body: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.sm,
  },
  primaryBtn: {
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryBtn: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  primaryText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
  },
  secondaryText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 15,
  },
  loadingWrap: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  loadingText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
  },
  pressed: {
    opacity: 0.88,
  },
});
