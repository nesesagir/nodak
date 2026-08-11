export type SfxId = 'victory' | 'error' | 'reject' | 'tap' | 'notify';

let enabled = true;
let ctx: AudioContext | null = null;

export function setSoundEnabled(value: boolean): void {
  enabled = value;
}

export function getSoundEnabled(): boolean {
  return enabled;
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  return ctx;
}

export async function unlockAudio(): Promise<void> {
  const audio = getCtx();
  if (!audio) return;
  if (audio.state === 'suspended') {
    try {
      await audio.resume();
    } catch {}
  }
}

function toneAt(
  audio: AudioContext,
  start: number,
  freq: number,
  duration: number,
  gain = 0.14,
  type: OscillatorType = 'square',
): void {
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(g);
  g.connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function playPattern(
  notes: { freq: number; dur: number; gap?: number; type?: OscillatorType; gain?: number }[],
): void {
  const audio = getCtx();
  if (!audio) return;
  void audio.resume();
  let t = audio.currentTime;
  for (const note of notes) {
    toneAt(audio, t, note.freq, note.dur, note.gain ?? 0.14, note.type ?? 'square');
    t += note.dur + (note.gap ?? 0.02);
  }
}

export async function preloadSounds(): Promise<void> {
  await unlockAudio();
}

function playId(id: SfxId): void {
  switch (id) {
    case 'reject':
    case 'error':
      playPattern([
        { freq: 480, dur: 0.05, gap: 0.025, gain: 0.2 },
        { freq: 260, dur: 0.1, gain: 0.18 },
      ]);
      return;
    case 'victory':
      playPattern([
        { freq: 523, dur: 0.1, type: 'triangle', gain: 0.18 },
        { freq: 659, dur: 0.1, type: 'triangle', gain: 0.18 },
        { freq: 784, dur: 0.12, type: 'triangle', gain: 0.2 },
        { freq: 1046, dur: 0.22, type: 'triangle', gain: 0.17 },
      ]);
      return;
    case 'tap':
      playPattern([{ freq: 740, dur: 0.04, gain: 0.1, type: 'triangle' }]);
      return;
    case 'notify':
      playPattern([
        { freq: 880, dur: 0.08, type: 'sine', gain: 0.14 },
        { freq: 1175, dur: 0.12, type: 'sine', gain: 0.14 },
      ]);
      return;
    default:
      return;
  }
}

export async function playSfx(id: SfxId): Promise<void> {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;

  if (audio.state === 'suspended') {
    try {
      await audio.resume();
    } catch {
      return;
    }
  }

  playId(id);
}

export async function unloadSounds(): Promise<void> {
  if (ctx) {
    try {
      await ctx.close();
    } catch {}
    ctx = null;
  }
}
