import type { SQLiteDatabase } from 'expo-sqlite';
import type { JlptLevel } from '../data/vocab-types';

export interface UserSettings {
  targetLevel: JlptLevel;
  newPerDay: number;
  notificationsEnabled: boolean;
  notificationHour: number;
}

const DEFAULTS: UserSettings = {
  targetLevel: 'N5',
  newPerDay: 10,
  notificationsEnabled: false,
  notificationHour: 9,
};

export async function getSettings(db: SQLiteDatabase): Promise<UserSettings> {
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    "SELECT key, value FROM settings WHERE key IN ('target_level','new_per_day','notifications_enabled','notification_hour')"
  );
  const map = new Map(rows.map((r) => [r.key, r.value]));

  const levelRaw = map.get('target_level');
  const level: JlptLevel =
    levelRaw === 'N4' || levelRaw === 'N3' ? (levelRaw as JlptLevel) : DEFAULTS.targetLevel;

  const newPerDayRaw = map.get('new_per_day');
  const newPerDay = newPerDayRaw
    ? Math.max(1, Math.min(50, Number(newPerDayRaw)))
    : DEFAULTS.newPerDay;

  const notificationsEnabled = map.get('notifications_enabled') === '1';

  const notificationHourRaw = map.get('notification_hour');
  const notificationHour = notificationHourRaw
    ? Math.max(0, Math.min(23, Number(notificationHourRaw)))
    : DEFAULTS.notificationHour;

  return { targetLevel: level, newPerDay, notificationsEnabled, notificationHour };
}

export async function setTargetLevel(db: SQLiteDatabase, level: JlptLevel): Promise<void> {
  await db.runAsync(
    "INSERT OR REPLACE INTO settings(key, value) VALUES ('target_level', ?)",
    level
  );
}

export async function setNewPerDay(db: SQLiteDatabase, value: number): Promise<void> {
  const clamped = Math.max(1, Math.min(50, Math.round(value)));
  await db.runAsync(
    "INSERT OR REPLACE INTO settings(key, value) VALUES ('new_per_day', ?)",
    String(clamped)
  );
}

export async function setNotificationsEnabled(
  db: SQLiteDatabase,
  enabled: boolean
): Promise<void> {
  await db.runAsync(
    "INSERT OR REPLACE INTO settings(key, value) VALUES ('notifications_enabled', ?)",
    enabled ? '1' : '0'
  );
}

export async function setNotificationHour(
  db: SQLiteDatabase,
  hour: number
): Promise<void> {
  const clamped = Math.max(0, Math.min(23, Math.round(hour)));
  await db.runAsync(
    "INSERT OR REPLACE INTO settings(key, value) VALUES ('notification_hour', ?)",
    String(clamped)
  );
}

export function isOnboardedSync(db: SQLiteDatabase): boolean {
  const row = db.getFirstSync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'onboarded'"
  );
  return row?.value === '1';
}

export async function markOnboarded(db: SQLiteDatabase): Promise<void> {
  await db.runAsync(
    "INSERT OR REPLACE INTO settings(key, value) VALUES ('onboarded', '1')"
  );
}
