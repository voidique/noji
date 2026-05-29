import type { SQLiteDatabase } from 'expo-sqlite';
import type { JlptLevel, VocabWithReview } from '../data/vocab-types';
import type { Scheduled } from '../srs/scheduler';

interface VocabReviewRow {
  id: string;
  surface: string;
  reading: string;
  romaji: string;
  pronunciation_ko: string;
  level: JlptLevel;
  meaning_ko: string;
  short_meaning_ko: string;
  part_of_speech: string;
  example_ja: string;
  example_ko: string;
  usage_note: string | null;
  priority: number;
  kanji_used: string;
  jmdict_entry_id: string;
  jmdict_glosses: string;
  status: VocabWithReview['status'];
  ease: number;
  interval_days: number;
  due_at: number;
  reps: number;
  lapses: number;
  saved: 0 | 1;
  last_reviewed_at: number | null;
}

function mapRow(row: VocabReviewRow): VocabWithReview {
  return {
    id: row.id,
    surface: row.surface,
    reading: row.reading,
    romaji: row.romaji,
    pronunciationKo: row.pronunciation_ko,
    level: row.level,
    meaningKo: row.meaning_ko,
    shortMeaningKo: row.short_meaning_ko,
    partOfSpeech: JSON.parse(row.part_of_speech),
    exampleJa: row.example_ja,
    exampleKo: row.example_ko,
    usageNote: row.usage_note,
    priority: row.priority,
    kanjiUsed: JSON.parse(row.kanji_used),
    jmdictEntryId: row.jmdict_entry_id,
    jmdictGlosses: JSON.parse(row.jmdict_glosses),
    status: row.status,
    ease: row.ease,
    intervalDays: row.interval_days,
    dueAt: row.due_at,
    reps: row.reps,
    lapses: row.lapses,
    saved: row.saved,
    lastReviewedAt: row.last_reviewed_at,
  };
}

const SESSION_SELECT = `
  SELECT v.*, r.status, r.ease, r.interval_days, r.due_at,
         r.reps, r.lapses, r.saved, r.last_reviewed_at
  FROM vocab v
  JOIN reviews r ON r.id = v.id
`;

export async function getDueQueue(
  db: SQLiteDatabase,
  level: JlptLevel,
  now: number = Date.now()
): Promise<VocabWithReview[]> {
  const rows = await db.getAllAsync<VocabReviewRow>(
    `${SESSION_SELECT}
     WHERE v.level = ?
       AND r.status IN ('learning','review')
       AND r.due_at <= ?
     ORDER BY r.due_at ASC
     LIMIT 50`,
    level,
    now
  );
  return rows.map(mapRow);
}

export async function getNewQueue(
  db: SQLiteDatabase,
  level: JlptLevel,
  limit: number
): Promise<VocabWithReview[]> {
  const rows = await db.getAllAsync<VocabReviewRow>(
    `${SESSION_SELECT}
     WHERE v.level = ? AND r.status = 'new'
     ORDER BY v.priority DESC, v.surface ASC
     LIMIT ?`,
    level,
    limit
  );
  return rows.map(mapRow);
}

export async function getSavedList(db: SQLiteDatabase): Promise<VocabWithReview[]> {
  const rows = await db.getAllAsync<VocabReviewRow>(
    `${SESSION_SELECT} WHERE r.saved = 1 ORDER BY v.level ASC, v.priority DESC`
  );
  return rows.map(mapRow);
}

export async function applySchedule(
  db: SQLiteDatabase,
  id: string,
  next: Scheduled
): Promise<void> {
  await db.runAsync(
    `UPDATE reviews
     SET status = ?, ease = ?, interval_days = ?, due_at = ?,
         reps = ?, lapses = ?, last_reviewed_at = ?
     WHERE id = ?`,
    next.status,
    next.ease,
    next.intervalDays,
    next.dueAt,
    next.reps,
    next.lapses,
    next.lastReviewedAt,
    id
  );
}

export async function toggleSaved(
  db: SQLiteDatabase,
  id: string,
  saved: boolean
): Promise<void> {
  await db.runAsync('UPDATE reviews SET saved = ? WHERE id = ?', saved ? 1 : 0, id);
}

export async function resetAllProgress(db: SQLiteDatabase): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `UPDATE reviews SET status = 'new', ease = 2.5, interval_days = 0,
       due_at = 0, reps = 0, lapses = 0, last_reviewed_at = NULL`
    );
  });
}
