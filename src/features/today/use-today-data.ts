import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { getLevelStats, type LevelStats } from '../../repositories/vocab-repo';
import { getSettings, type UserSettings } from '../../repositories/settings-repo';

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
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { stats, settings, loading, refresh: load };
}
