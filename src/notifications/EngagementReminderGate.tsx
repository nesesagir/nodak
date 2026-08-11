import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useSettings } from '../settings/SettingsContext';
import { touchReminders } from './engagementReminder';

export function EngagementReminderGate() {
  const { t, language, ready, soundEnabled } = useSettings();

  useEffect(() => {
    if (!ready) return;

    const sync = () => {
      void touchReminders({
        title: 'Nodak',
        body: t('notifyMindExercise'),
        soundEnabled,
      });
    };

    sync();

    const onChange = (state: AppStateStatus) => {
      if (state === 'active') sync();
    };

    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [ready, language, t, soundEnabled]);

  return null;
}
