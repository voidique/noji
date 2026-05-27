import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import type { JlptLevel, VocabWithReview } from '../../data/vocab-types';
import { listVocabByLevel } from '../../repositories/vocab-repo';

export function useBrowseData(level: JlptLevel, search: string) {
  const db = useSQLiteContext();
  const [items, setItems] = useState<VocabWithReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const handle = setTimeout(async () => {
      const rows = await listVocabByLevel(db, level, search);
      if (cancelled) return;
      setItems(rows);
      setLoading(false);
    }, search.length > 0 ? 150 : 0);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [db, level, search]);

  return { items, loading };
}
