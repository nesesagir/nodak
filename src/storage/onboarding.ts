import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'nodak.onboarding.seen.v1';

export async function hasSeenHowToPlay(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw === '1';
}

export async function markHowToPlaySeen(): Promise<void> {
  await AsyncStorage.setItem(KEY, '1');
}
