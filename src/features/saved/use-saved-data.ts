import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import type { VocabWithReview } from '../../data/vocab-types';
import { getSavedList } from '../../repositories/review-repo';

export function useSavedData() {
  const db = useSQLiteContext();
  const [items, setItems] = useState<VocabWithReview[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        setLoading(true);
        const rows = await getSavedList(db);
        if (cancelled) return;
        setItems(rows);
        setLoading(false);
      })();
      return () => {
        cancelled = true;
      };
    }, [db])
  );

  return { items, loading };
}
