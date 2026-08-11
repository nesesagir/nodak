import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmbientLayer } from '../AmbientLayer';
import { useAppColors } from '../../theme/useAppColors';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  withAmbient?: boolean;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
};

export function Screen({
  children,
  style,
  withAmbient = true,
  edges,
}: Props) {
  const colors = useAppColors();
  const washEnd =
    colors.bg.toLowerCase() === '#ffffff' || colors.bg.toLowerCase() === '#fff'
      ? '#ECEEF1'
      : colors.primarySoft;

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <LinearGradient
        colors={[colors.bg, washEnd]}
        locations={[0.15, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {withAmbient ? <AmbientLayer /> : null}
      <SafeAreaView edges={edges} style={[styles.safe, style]}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, zIndex: 1 },
});
