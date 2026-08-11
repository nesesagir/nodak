import { useFonts as useDmSans, DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import { useFonts as useFraunces, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SoundGate } from './src/audio/SoundGate';
import { GameProvider } from './src/game/GameContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { EngagementReminderGate } from './src/notifications/EngagementReminderGate';
import { SettingsProvider, useSettings } from './src/settings/SettingsContext';
import { ProgressProvider } from './src/storage/ProgressContext';
import { colors } from './src/theme/tokens';

const bootBg = colors.bg;

function AppShell() {
  const { isDark, ready } = useSettings();

  if (!ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color="#111111" />
      </View>
    );
  }

  return (
    <>
      <ProgressProvider>
        <GameProvider>
          <SoundGate />
          <EngagementReminderGate />
          <RootNavigator />
          <StatusBar style={isDark ? 'light' : 'dark'} />
        </GameProvider>
      </ProgressProvider>
    </>
  );
}

export default function App() {
  const [dmLoaded] = useDmSans({
    DMSans_400Regular,
    DMSans_500Medium,
  });
  const [frauncesLoaded] = useFraunces({
    Fraunces_600SemiBold,
  });

  if (!dmLoaded || !frauncesLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color="#111111" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <SettingsProvider>
          <AppShell />
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: bootBg,
  },
});
