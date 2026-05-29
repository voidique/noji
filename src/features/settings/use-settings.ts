import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import type { JlptLevel } from '../../data/vocab-types';
import {
  getSettings,
  setNewPerDay,
  setNotificationHour,
  setNotificationsEnabled,
  setTargetLevel,
  type UserSettings,
} from '../../repositories/settings-repo';
import {
  cancelAllNotifications,
  requestNotificationPermission,
  scheduleDailyNotification,
} from '../../services/notification-service';

export function useSettings() {
  const db = useSQLiteContext();
  const [settings, setSettings] = useState<UserSettings | null>(null);

  const refresh = useCallback(async () => {
    const s = await getSettings(db);
    setSettings(s);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const updateLevel = useCallback(
    async (level: JlptLevel) => {
      await setTargetLevel(db, level);
      setSettings((prev) => (prev ? { ...prev, targetLevel: level } : prev));
    },
    [db]
  );

  const updateNewPerDay = useCallback(
    async (value: number) => {
      await setNewPerDay(db, value);
      setSettings((prev) =>
        prev ? { ...prev, newPerDay: Math.max(1, Math.min(50, Math.round(value))) } : prev
      );
    },
    [db]
  );

  const updateNotificationsEnabled = useCallback(
    async (enabled: boolean) => {
      if (enabled) {
        const granted = await requestNotificationPermission();
        if (!granted) return; // permission denied — don't flip the toggle
        await setNotificationsEnabled(db, true);
        const current = await getSettings(db);
        await scheduleDailyNotification(current.notificationHour, 0);
        setSettings((prev) => (prev ? { ...prev, notificationsEnabled: true } : prev));
      } else {
        await setNotificationsEnabled(db, false);
        await cancelAllNotifications();
        setSettings((prev) => (prev ? { ...prev, notificationsEnabled: false } : prev));
      }
    },
    [db]
  );

  const updateNotificationHour = useCallback(
    async (hour: number) => {
      const clamped = Math.max(0, Math.min(23, Math.round(hour)));
      await setNotificationHour(db, clamped);
      setSettings((prev) =>
        prev ? { ...prev, notificationHour: clamped } : prev
      );
      // Reschedule with new time (due count unknown here, use 0 → generic message)
      await scheduleDailyNotification(clamped, 0);
    },
    [db]
  );

  return {
    settings,
    updateLevel,
    updateNewPerDay,
    updateNotificationsEnabled,
    updateNotificationHour,
  };
}
