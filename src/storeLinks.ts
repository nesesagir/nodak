import { Linking, Platform } from 'react-native';

const PACKAGE_ID = 'com.nodak.puzzle';
export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PACKAGE_ID}`;
const MARKET_URL = `market://details?id=${PACKAGE_ID}`;

export async function openPlayStoreListing(): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      await Linking.openURL(MARKET_URL);
      return;
    }
  } catch {}
  await Linking.openURL(PLAY_STORE_URL);
}
