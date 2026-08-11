export function setNotificationSoundEnabled(_enabled: boolean): void {
  return;
}

export async function requestNotificationPermission(): Promise<boolean> {
  return false;
}

export async function scheduleEngagementReminder(_options: {
  title: string;
  body: string;
  afterOpen: boolean;
  soundEnabled?: boolean;
}): Promise<void> {
  return;
}

export async function touchReminders(_options: {
  title: string;
  body: string;
  soundEnabled?: boolean;
}): Promise<void> {
  return;
}
