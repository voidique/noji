export type JlptLevel = 'N5' | 'N4' | 'N3';

export type PartOfSpeech =
  | 'noun'
  | 'pronoun'
  | 'verb-godan'
  | 'verb-ichidan'
  | 'verb-suru'
  | 'verb-irregular'
  | 'adjective-i'
  | 'adjective-na'
  | 'adverb'
  | 'particle'
  | 'counter'
  | 'numeric'
  | 'expression'
  | 'conjunction'
  | 'interjection'
  | 'copula'
  | 'auxiliary';

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export type ReviewStatus = 'new' | 'learning' | 'review' | 'known';

export interface VocabSeedOriginal {
  id: string;
  surface: string;
  reading: string;
  romaji: string;
  targetLevel: JlptLevel;
  meaningKo: string;
  shortMeaningKo: string;
  partOfSpeech: PartOfSpeech[];
  exampleJa: string;
  exampleKo: string;
  distractorsKo: string[];
  usageNote: string | null;
  priority: number;
  tags: string[];
  reviewStatus: 'needs_review' | 'approved';
  sentencePatterns: string[];
  kanjiUsed: string[];
}

export interface VocabSeedSa {
  id: string;
  jmdictEntryId: string;
  jmdictSenseGlosses: string[];
  jmdictPartOfSpeechTags: string[];
  jmdictSenseIdx: number;
  jmdictSensePos: string[];
}

export interface VocabEntry {
  id: string;
  surface: string;
  reading: string;
  romaji: string;
  level: JlptLevel;
  meaningKo: string;
  shortMeaningKo: string;
  partOfSpeech: PartOfSpeech[];
  exampleJa: string;
  exampleKo: string;
  usageNote: string | null;
  priority: number;
  kanjiUsed: string[];
  jmdictEntryId: string;
  jmdictGlosses: string[];
}

export interface ReviewState {
  id: string;
  status: ReviewStatus;
  ease: number;
  intervalDays: number;
  dueAt: number;
  reps: number;
  lapses: number;
  saved: 0 | 1;
  lastReviewedAt: number | null;
}

export interface VocabWithReview extends VocabEntry, Omit<ReviewState, 'id'> {}
