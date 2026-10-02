import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioSource,
} from 'expo-audio';

export type SfxId = 'victory' | 'error' | 'reject' | 'tap' | 'notify';

const SOURCES: Record<Exclude<SfxId, 'error'>, AudioSource> = {
  victory: require('../../assets/sounds/victory.wav'),
  reject: require('../../assets/sounds/reject.wav'),
  tap: require('../../assets/sounds/tap.wav'),
  notify: require('../../assets/sounds/notify.wav'),
};

let enabled = true;
let configured = false;
const cache = new Map<string, AudioPlayer>();

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
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
      interruptionMode: 'mixWithOthers',
    });
    configured = true;
  } catch {}
}

function resolveId(id: SfxId): Exclude<SfxId, 'error'> {
  return id === 'error' ? 'reject' : id;
}

async function load(id: Exclude<SfxId, 'error'>): Promise<AudioPlayer | null> {
  const existing = cache.get(id);
  if (existing) return existing;
  try {
    await ensureAudioMode();
    const player = createAudioPlayer(SOURCES[id]);
    player.volume = 1;
    cache.set(id, player);
    return player;
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
    const player = await load(key);
    if (!player) return;
    await player.seekTo(0);
    player.play();
  } catch {}
}

export async function unloadSounds(): Promise<void> {
  const players = [...cache.values()];
  cache.clear();
  for (const player of players) {
    try {
      player.remove();
    } catch {}
  }
}
