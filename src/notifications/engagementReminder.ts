import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ID_PREFIX = 'nodak-engage-';
const LAST_OPEN_KEY = 'nodak.lastOpenDay';
const REMINDER_HOUR = 19;
const REMINDER_MINUTE = 0;
const CHAIN_DAYS = 14;

let playNotificationSound = true;

export function setNotificationSoundEnabled(enabled: boolean): void {
  playNotificationSound = enabled;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: playNotificationSound,
    shouldSetBadge: false,
  }),
});

function dayKey(date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

async function ensureAndroidChannel(soundOn: boolean): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('engagement', {
    name: 'Nodak hatırlatmaları',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: soundOn ? 'notify.wav' : undefined,
    enableVibrate: true,
  });
}

async function cancelEngagementChain(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => item.identifier.startsWith(ID_PREFIX))
      .map((item) =>
        Notifications.cancelScheduledNotificationAsync(item.identifier).catch(
          () => undefined,
        ),
      ),
  );
}

export async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (
    current.granted ||
    current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return true;
  }
  const asked = await Notifications.requestPermissionsAsync();
  return (
    asked.granted ||
    asked.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function scheduleEngagementReminder(options: {
  title: string;
  body: string;
  afterOpen: boolean;
  soundEnabled?: boolean;
}): Promise<void> {
  const ok = await requestNotificationPermission();
  if (!ok) return;

  const soundOn = options.soundEnabled !== false;
  setNotificationSoundEnabled(soundOn);
  await ensureAndroidChannel(soundOn);
  await cancelEngagementChain();

  const start = new Date();
  start.setSeconds(0, 0);
  start.setMilliseconds(0);
  start.setHours(REMINDER_HOUR, REMINDER_MINUTE, 0, 0);

  if (options.afterOpen || start.getTime() <= Date.now()) {
    start.setDate(start.getDate() + 1);
  }

  const sound = soundOn ? 'notify.wav' : false;

  for (let i = 0; i < CHAIN_DAYS; i += 1) {
    const when = new Date(start);
    when.setDate(start.getDate() + i);

    await Notifications.scheduleNotificationAsync({
      identifier: `${ID_PREFIX}${i}`,
      content: {
        title: options.title,
        body: options.body,
        sound,
        ...(Platform.OS === 'android' ? { channelId: 'engagement' } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: when,
        channelId: Platform.OS === 'android' ? 'engagement' : undefined,
      },
    });
  }
}

export async function touchReminders(options: {
  title: string;
  body: string;
  soundEnabled?: boolean;
}): Promise<void> {
  await AsyncStorage.setItem(LAST_OPEN_KEY, dayKey());
  await scheduleEngagementReminder({
    title: options.title,
    body: options.body,
    afterOpen: true,
    soundEnabled: options.soundEnabled,
  });
}
