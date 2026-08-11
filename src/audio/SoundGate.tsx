import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSettings } from '../settings/SettingsContext';
import { preloadSounds, setSoundEnabled, unlockAudio } from './sounds';

export function SoundGate() {
  const { ready, soundEnabled } = useSettings();

  useEffect(() => {
    if (!ready) return;
    setSoundEnabled(soundEnabled);
    if (soundEnabled) {
      void preloadSounds();
    }
  }, [ready, soundEnabled]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const unlock = () => {
      void unlockAudio();
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  return null;
}
