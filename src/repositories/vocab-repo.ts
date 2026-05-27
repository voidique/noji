import type { SQLiteDatabase } from 'expo-sqlite';
import type { JlptLevel, PartOfSpeech, VocabEntry, VocabWithReview } from '../data/vocab-types';

interface VocabRow {
  id: string;
  surface: string;
  reading: string;
  romaji: string;
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
}

interface VocabReviewRow extends VocabRow {
  status: VocabWithReview['status'];
  ease: number;
  interval_days: number;
  due_at: number;
  reps: number;
  lapses: number;
  saved: 0 | 1;
  last_reviewed_at: number | null;
}

function mapVocab(row: VocabRow): VocabEntry {
  return {
    id: row.id,
    surface: row.surface,
    reading: row.reading,
    romaji: row.romaji,
    level: row.level,
    meaningKo: row.meaning_ko,
    shortMeaningKo: row.short_meaning_ko,
    partOfSpeech: JSON.parse(row.part_of_speech) as PartOfSpeech[],
    exampleJa: row.example_ja,
    exampleKo: row.example_ko,
    usageNote: row.usage_note,
    priority: row.priority,
    kanjiUsed: JSON.parse(row.kanji_used) as string[],
    jmdictEntryId: row.jmdict_entry_id,
    jmdictGlosses: JSON.parse(row.jmdict_glosses) as string[],
  };
}

function mapVocabWithReview(row: VocabReviewRow): VocabWithReview {
  return {
    ...mapVocab(row),
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

const BASE_JOIN_SELECT = `
  SELECT v.*, r.status, r.ease, r.interval_days, r.due_at,
         r.reps, r.lapses, r.saved, r.last_reviewed_at
  FROM vocab v
  LEFT JOIN reviews r ON r.id = v.id
`;

export async function listVocabByLevel(
  db: SQLiteDatabase,
  level: JlptLevel,
  search?: string
): Promise<VocabWithReview[]> {
  const trimmed = search?.trim() ?? '';
  if (trimmed.length === 0) {
    const rows = await db.getAllAsync<VocabReviewRow>(
      `${BASE_JOIN_SELECT} WHERE v.level = ? ORDER BY v.priority DESC, v.surface ASC`,
      level
    );
    return rows.map(mapVocabWithReview);
  }
  const like = `%${trimmed}%`;
  const rows = await db.getAllAsync<VocabReviewRow>(
    `${BASE_JOIN_SELECT}
     WHERE v.level = ?
       AND (v.surface LIKE ? OR v.reading LIKE ? OR v.romaji LIKE ?
            OR v.short_meaning_ko LIKE ? OR v.meaning_ko LIKE ?)
     ORDER BY v.priority DESC, v.surface ASC`,
    level,
    like,
    like,
    like,
    like,
    like
  );
  return rows.map(mapVocabWithReview);
}

export async function getVocabById(
  db: SQLiteDatabase,
  id: string
): Promise<VocabWithReview | null> {
  const row = await db.getFirstAsync<VocabReviewRow>(
    `${BASE_JOIN_SELECT} WHERE v.id = ?`,
    id
  );
  return row ? mapVocabWithReview(row) : null;
}

export interface LevelStats {
  level: JlptLevel;
  total: number;
  known: number;
  due: number;
  newCount: number;
}

export async function getLevelStats(
  db: SQLiteDatabase,
  level: JlptLevel,
  now: number = Date.now()
): Promise<LevelStats> {
  const row = await db.getFirstAsync<{
    total: number;
    known: number;
    due: number;
    new_count: number;
  }>(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN r.status = 'known' THEN 1 ELSE 0 END) AS known,
       SUM(CASE WHEN r.status IN ('learning','review') AND r.due_at <= ? THEN 1 ELSE 0 END) AS due,
       SUM(CASE WHEN r.status = 'new' THEN 1 ELSE 0 END) AS new_count
     FROM vocab v
     LEFT JOIN reviews r ON r.id = v.id
     WHERE v.level = ?`,
    now,
    level
  );
  return {
    level,
    total: row?.total ?? 0,
    known: row?.known ?? 0,
    due: row?.due ?? 0,
    newCount: row?.new_count ?? 0,
  };
}
