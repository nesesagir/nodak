import mobileAds, {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import type { RewardedAdResult } from './types';

const UNIT_ID = 'ca-app-pub-2861101131790309/4547930264';
const LOAD_MS = 25000;

export async function initNativeAds(): Promise<void> {
  try {
    await mobileAds().initialize();
  } catch {
    return;
  }
}

export function showRewardedNative(): Promise<RewardedAdResult> {
  return new Promise((resolve) => {
    const ad = RewardedAd.createForAdRequest(UNIT_ID);
    let earned = false;
    let settled = false;

    const finish = (result: RewardedAdResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      unsubLoaded();
      unsubEarned();
      unsubError();
      unsubClosed();
      resolve(result);
    };

    const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      void ad.show();
    });
    const unsubEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        earned = true;
      },
    );
    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      finish('failed');
    });
    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      finish(earned ? 'rewarded' : 'dismissed');
    });

    const timer = setTimeout(() => finish('failed'), LOAD_MS);
    ad.load();
  });
}
