import original from './seed/app-original.json';
import sa from './seed/app-sa-reference.json';
import type { VocabEntry, VocabSeedOriginal, VocabSeedSa } from './vocab-types';

const originals = original as VocabSeedOriginal[];
const refs = sa as VocabSeedSa[];

export function buildSeedEntries(): VocabEntry[] {
  const refById = new Map(refs.map((r) => [r.id, r]));
  return originals.map((o) => {
    const ref = refById.get(o.id);
    return {
      id: o.id,
      surface: o.surface,
      reading: o.reading,
      romaji: o.romaji,
      pronunciationKo: o.pronunciationKo,
      level: o.targetLevel,
      meaningKo: o.meaningKo,
      shortMeaningKo: o.shortMeaningKo,
      partOfSpeech: o.partOfSpeech,
      exampleJa: o.exampleJa,
      exampleKo: o.exampleKo,
      usageNote: o.usageNote,
      priority: o.priority,
      kanjiUsed: o.kanjiUsed,
      jmdictEntryId: ref?.jmdictEntryId ?? '',
      jmdictGlosses: ref?.jmdictSenseGlosses ?? [],
    };
  });
}

export const SEED_VERSION = 2;
