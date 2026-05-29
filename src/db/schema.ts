export const SCHEMA_VERSION = 2;

export const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS vocab (
  id TEXT PRIMARY KEY NOT NULL,
  surface TEXT NOT NULL,
  reading TEXT NOT NULL,
  romaji TEXT NOT NULL,
  level TEXT NOT NULL,
  meaning_ko TEXT NOT NULL,
  short_meaning_ko TEXT NOT NULL,
  part_of_speech TEXT NOT NULL,
  example_ja TEXT NOT NULL,
  example_ko TEXT NOT NULL,
  usage_note TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  kanji_used TEXT NOT NULL DEFAULT '[]',
  jmdict_entry_id TEXT NOT NULL DEFAULT '',
  jmdict_glosses TEXT NOT NULL DEFAULT '[]',
  pronunciation_ko TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_vocab_level_priority ON vocab(level, priority DESC);
CREATE INDEX IF NOT EXISTS idx_vocab_surface ON vocab(surface);
CREATE INDEX IF NOT EXISTS idx_vocab_reading ON vocab(reading);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  ease REAL NOT NULL DEFAULT 2.5,
  interval_days REAL NOT NULL DEFAULT 0,
  due_at INTEGER NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  saved INTEGER NOT NULL DEFAULT 0,
  last_reviewed_at INTEGER,
  FOREIGN KEY (id) REFERENCES vocab(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reviews_status_due ON reviews(status, due_at);
CREATE INDEX IF NOT EXISTS idx_reviews_saved ON reviews(saved);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
`;
