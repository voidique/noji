import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { getLevelStats, type LevelStats } from '../../repositories/vocab-repo';
import { getSettings, type UserSettings } from '../../repositories/settings-repo';
import {
  hasNotificationPermission,
  scheduleDailyNotification,
} from '../../services/notification-service';
import { syncTodayWidget } from '../../services/widget-service';

interface TodayData {
  stats: LevelStats | null;
  settings: UserSettings | null;
  loading: boolean;
  refresh: () => void;
}

export function useTodayData(): TodayData {
  const db = useSQLiteContext();
  const [stats, setStats] = useState<LevelStats | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const s = await getSettings(db);
    const st = await getLevelStats(db, s.targetLevel);
    setSettings(s);
    setStats(st);
    setLoading(false);

    syncTodayWidget(db);

    // Keep the daily notification content fresh: reschedule with today's due count
    if (s.notificationsEnabled && (await hasNotificationPermission())) {
      const dueCount = st.due + Math.min(st.newCount, s.newPerDay);
      scheduleDailyNotification(s.notificationHour, dueCount).catch(() => {});
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { stats, settings, loading, refresh: load };
}
