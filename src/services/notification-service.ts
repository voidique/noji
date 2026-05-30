import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are presented when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function hasNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

/**
 * Schedule (or reschedule) the daily review reminder.
 * Cancels any previously scheduled notifications first.
 * Pass dueCount = 0 to still schedule with a generic message.
 */
let lastScheduledSignature: string | null = null;

export async function scheduleDailyNotification(
  hour: number,
  dueCount: number
): Promise<void> {
  const signature = `${hour}:${dueCount}`;
  if (signature === lastScheduledSignature) return;
  lastScheduledSignature = signature;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const body =
    dueCount > 0
      ? `오늘 ${dueCount}개 복습이 기다려요`
      : '오늘의 복습을 시작해볼까요?';

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'noji',
      body,
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: 0,
    },
  });
}

export async function cancelAllNotifications(): Promise<void> {
  lastScheduledSignature = null;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
