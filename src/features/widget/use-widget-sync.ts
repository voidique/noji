import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { syncTodayWidget } from '../../services/widget-service';

export function useWidgetSync(): void {
  const db = useSQLiteContext();

  useEffect(() => {
    syncTodayWidget(db);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'inactive' || state === 'background') {
        syncTodayWidget(db);
      }
    });
    return () => sub.remove();
  }, [db]);
}
