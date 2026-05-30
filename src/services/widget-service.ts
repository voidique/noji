import { ExtensionStorage } from '@bacons/apple-targets';
import type { SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';
import { getSettings } from '../repositories/settings-repo';
import { getLevelStats } from '../repositories/vocab-repo';

export const APP_GROUP = 'group.com.xira.life.noji';
const SNAPSHOT_KEY = 'todaySnapshot';

export interface WidgetSnapshot {
  level: string;
  newCount: number;
  due: number;
  known: number;
  total: number;
  updatedAt: number;
}

let storage: ExtensionStorage | null = null;
let storageReady = false;

function getStorage(): ExtensionStorage | null {
  if (Platform.OS !== 'ios') return null;
  if (storageReady) return storage;
  storageReady = true;
  try {
    storage = new ExtensionStorage(APP_GROUP);
  } catch {
    storage = null;
  }
  return storage;
}

export async function syncTodayWidget(db: SQLiteDatabase): Promise<void> {
  const store = getStorage();
  if (!store) return;
  try {
    const settings = await getSettings(db);
    const stats = await getLevelStats(db, settings.targetLevel);
    const snapshot: WidgetSnapshot = {
      level: settings.targetLevel,
      newCount: Math.min(stats.newCount, settings.newPerDay),
      due: stats.due,
      known: stats.known,
      total: stats.total,
      updatedAt: Date.now(),
    };
    store.set(SNAPSHOT_KEY, JSON.stringify(snapshot));
    ExtensionStorage.reloadWidget();
  } catch {
    // Widget sync is best-effort; never block the app on it.
  }
}
