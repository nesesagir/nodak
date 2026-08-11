export type RewardedAdResult = 'rewarded' | 'dismissed' | 'failed';
export type InterstitialResult = 'shown' | 'skipped' | 'failed';

let winsSinceAd = 0;

export async function showRewardedHintAd(): Promise<RewardedAdResult> {
  await new Promise((r) => setTimeout(r, 900));
  return 'rewarded';
}

export async function maybeShowVictoryInterstitial(): Promise<InterstitialResult> {
  winsSinceAd += 1;
  if (winsSinceAd < 2) return 'skipped';
  winsSinceAd = 0;
  await new Promise((r) => setTimeout(r, 700));
  return 'shown';
}

export async function maybeShowGameOverInterstitial(): Promise<InterstitialResult> {
  await new Promise((r) => setTimeout(r, 700));
  return 'shown';
}
