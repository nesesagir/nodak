import { Platform } from 'react-native';
import type { InterstitialResult, RewardedAdResult } from './types';

export type { InterstitialResult, RewardedAdResult };

export async function initAds(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const native = await import('./rewardedNative');
    await native.initNativeAds();
  } catch {}
}

export async function showRewardedHintAd(): Promise<RewardedAdResult> {
  if (Platform.OS === 'web') return 'failed';
  try {
    const native = await import('./rewardedNative');
    return await native.showRewardedNative();
  } catch {
    return 'failed';
  }
}

export async function maybeShowVictoryInterstitial(): Promise<InterstitialResult> {
  return 'skipped';
}

export async function maybeShowGameOverInterstitial(): Promise<InterstitialResult> {
  return 'skipped';
}
