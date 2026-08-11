import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LevelsScreen } from '../screens/LevelsScreen';
import { GameScreen } from '../screens/GameScreen';
import { VictoryScreen } from '../screens/VictoryScreen';
import { GameOverScreen } from '../screens/GameOverScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HowToPlayScreen } from '../screens/HowToPlayScreen';
import { useAppColors } from '../theme/useAppColors';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const colors = useAppColors();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Levels" component={LevelsScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Victory" component={VictoryScreen} />
        <Stack.Screen name="GameOver" component={GameOverScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
