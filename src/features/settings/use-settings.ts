import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import type { JlptLevel } from '../../data/vocab-types';
import {
  getSettings,
  setNewPerDay,
  setTargetLevel,
  type UserSettings,
} from '../../repositories/settings-repo';

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

  return { settings, updateLevel, updateNewPerDay };
}
