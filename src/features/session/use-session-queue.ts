import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReviewRating, VocabWithReview } from '../../data/vocab-types';
import { applySchedule, getDueQueue, getNewQueue } from '../../repositories/review-repo';
import { getSettings } from '../../repositories/settings-repo';
import { applyRating, previewInterval, toScheduled } from '../../srs/scheduler';

export interface SessionState {
  queue: VocabWithReview[];
  index: number;
  current: VocabWithReview | null;
  loading: boolean;
  completed: number;
  total: number;
  intervals: Record<ReviewRating, string>;
  rate: (rating: ReviewRating) => Promise<void>;
}

export function useSessionQueue(): SessionState {
  const db = useSQLiteContext();
  const [queue, setQueue] = useState<VocabWithReview[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const ratingInProgress = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const settings = await getSettings(db);
      const due = await getDueQueue(db, settings.targetLevel);
      const fresh = await getNewQueue(db, settings.targetLevel, settings.newPerDay);
      if (cancelled) return;
      const seen = new Set(due.map((d) => d.id));
      const merged = [...due, ...fresh.filter((f) => !seen.has(f.id))];
      setQueue(merged);
      setIndex(0);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [db]);

  const rate = useCallback(
    async (rating: ReviewRating) => {
      if (ratingInProgress.current) return;
      const card = queue[index];
      if (!card) return;
      ratingInProgress.current = true;
      try {
        const next = applyRating(toScheduled(card), rating);
        await applySchedule(db, card.id, next);
        setIndex((i) => i + 1);
      } finally {
        ratingInProgress.current = false;
      }
    },
    [db, queue, index]
  );

  const current = queue[index] ?? null;

  const intervals = useMemo<Record<ReviewRating, string>>(() => {
    if (!current) return { again: '—', hard: '—', good: '—', easy: '—' };
    const s = toScheduled(current);
    return {
      again: previewInterval(s, 'again'),
      hard:  previewInterval(s, 'hard'),
      good:  previewInterval(s, 'good'),
      easy:  previewInterval(s, 'easy'),
    };
  }, [current]);

  return {
    queue,
    index,
    current,
    loading,
    completed: index,
    total: queue.length,
    intervals,
    rate,
  };
}
