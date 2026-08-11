import { Audio, type AVPlaybackSource } from 'expo-av';

export type SfxId = 'victory' | 'error' | 'reject' | 'tap' | 'notify';

const SOURCES: Record<Exclude<SfxId, 'error'>, AVPlaybackSource> = {
  victory: require('../../assets/sounds/victory.wav'),
  reject: require('../../assets/sounds/reject.wav'),
  tap: require('../../assets/sounds/tap.wav'),
  notify: require('../../assets/sounds/notify.wav'),
};

let enabled = true;
let configured = false;
const cache = new Map<string, Audio.Sound>();

export function setSoundEnabled(value: boolean): void {
  enabled = value;
}

export function getSoundEnabled(): boolean {
  return enabled;
}

export async function unlockAudio(): Promise<void> {
  await ensureAudioMode();
}

async function ensureAudioMode(): Promise<void> {
  if (configured) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    configured = true;
  } catch {}
}

function resolveId(id: SfxId): Exclude<SfxId, 'error'> {
  return id === 'error' ? 'reject' : id;
}

async function load(id: Exclude<SfxId, 'error'>): Promise<Audio.Sound | null> {
  const existing = cache.get(id);
  if (existing) return existing;
  try {
    await ensureAudioMode();
    const { sound } = await Audio.Sound.createAsync(SOURCES[id], {
      shouldPlay: false,
      volume: 1,
    });
    cache.set(id, sound);
    return sound;
  } catch {
    return null;
  }
}

export async function preloadSounds(): Promise<void> {
  if (!enabled) return;
  await Promise.all((['victory', 'reject', 'tap'] as const).map((id) => load(id)));
}

export async function playSfx(id: SfxId): Promise<void> {
  if (!enabled) return;
  const key = resolveId(id);
  try {
    const sound = await load(key);
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    }
  } catch {}
}

export async function unloadSounds(): Promise<void> {
  const sounds = [...cache.values()];
  cache.clear();
  await Promise.all(
    sounds.map((sound) => sound.unloadAsync().catch(() => undefined)),
  );
}
