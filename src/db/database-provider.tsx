import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { type ReactNode, Suspense } from 'react';
import { migrate } from './migrations';

const DB_NAME = 'noji.db';

async function initialize(db: SQLiteDatabase): Promise<void> {
  await migrate(db);
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export function DatabaseProvider({ children, fallback }: Props) {
  return (
    <Suspense fallback={fallback ?? null}>
      <SQLiteProvider databaseName={DB_NAME} onInit={initialize} useSuspense>
        {children}
      </SQLiteProvider>
    </Suspense>
  );
}
