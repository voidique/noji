import type { SQLiteDatabase } from 'expo-sqlite';
import { buildSeedEntries, SEED_VERSION } from '../data/vocab-seed';
import { SCHEMA_SQL, SCHEMA_VERSION } from './schema';

export async function migrate(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(SCHEMA_SQL);

  const userVersionRow = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const userVersion = userVersionRow?.user_version ?? 0;

  if (userVersion < SCHEMA_VERSION) {
    // pronunciation_ko was added in schema v2.
    // Try/catch handles both cases:
    //   - upgrade (v0 or v1): ALTER TABLE succeeds
    //   - fresh install: table was created with column already → error is ignored
    if (userVersion < 2) {
      try {
        await db.execAsync(
          `ALTER TABLE vocab ADD COLUMN pronunciation_ko TEXT NOT NULL DEFAULT ''`
        );
      } catch {
        // Column already present — safe to ignore
      }
    }
    await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
  }

  const seedRow = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'seed_version'"
  );
  const currentSeed = seedRow ? Number(seedRow.value) : 0;

  if (currentSeed < SEED_VERSION) {
    await seedVocab(db);
    await db.runAsync(
      "INSERT OR REPLACE INTO settings(key, value) VALUES ('seed_version', ?)",
      String(SEED_VERSION)
    );
  }
}

async function seedVocab(db: SQLiteDatabase): Promise<void> {
  const entries = buildSeedEntries();
  await db.withTransactionAsync(async () => {
    const stmt = await db.prepareAsync(
      `INSERT OR REPLACE INTO vocab(
        id, surface, reading, romaji, level, meaning_ko, short_meaning_ko,
        part_of_speech, example_ja, example_ko, usage_note, priority,
        kanji_used, jmdict_entry_id, jmdict_glosses, pronunciation_ko
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    );
    try {
      for (const e of entries) {
        await stmt.executeAsync([
          e.id,
          e.surface,
          e.reading,
          e.romaji,
          e.level,
          e.meaningKo,
          e.shortMeaningKo,
          JSON.stringify(e.partOfSpeech),
          e.exampleJa,
          e.exampleKo,
          e.usageNote,
          e.priority,
          JSON.stringify(e.kanjiUsed),
          e.jmdictEntryId,
          JSON.stringify(e.jmdictGlosses),
          e.pronunciationKo,
        ]);
      }
    } finally {
      await stmt.finalizeAsync();
    }

    await db.execAsync(
      `INSERT OR IGNORE INTO reviews(id) SELECT id FROM vocab;`
    );
  });
}
