import { Form, Host, Label, Section } from '@expo/ui/swift-ui';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import type { ReviewStatus, VocabWithReview } from '../../data/vocab-types';
import { toggleSaved } from '../../repositories/review-repo';
import { getVocabById } from '../../repositories/vocab-repo';
import { palette, spacing, typography } from '../../theme/tokens';

// ─── SRS status helpers ────────────────────────────────────────────────────────

const STATUS_LABEL: Record<ReviewStatus, string> = {
  new:      '처음 보는 단어',
  learning: '배우는 중',
  review:   '복습 예정',
  known:    '외웠어요',
};

const STATUS_ICON = {
  new:      'sparkle',
  learning: 'arrow.triangle.2.circlepath',
  review:   'clock',
  known:    'checkmark.circle',
} as const;

function formatNextReview(dueAt: number, status: ReviewStatus): string {
  if (status === 'new') return '아직 학습 전';
  if (status === 'known') return '없어요 — 외운 단어예요';
  const diffMs = dueAt - Date.now();
  if (diffMs <= 0) return '지금 복습 대기 중';
  const mins = Math.round(diffMs / 60_000);
  if (mins < 60) return `${mins}분 후`;
  const days = Math.round(diffMs / 86_400_000);
  if (days < 1) return '오늘';
  if (days < 30) return `${days}일 후`;
  return `약 ${Math.round(days / 30)}개월 후`;
}

export function WordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [vocab, setVocab] = useState<VocabWithReview | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      const v = await getVocabById(db, id);
      if (!cancelled) setVocab(v);
    })();
    return () => {
      cancelled = true;
    };
  }, [db, id]);

  const onToggleSave = useCallback(async () => {
    if (!vocab) return;
    const next = vocab.saved ? 0 : 1;
    await toggleSaved(db, vocab.id, next === 1);
    setVocab({ ...vocab, saved: next as 0 | 1 });
  }, [db, vocab]);

  if (!vocab) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: vocab.surface,
          headerRight: () => (
            <Pressable hitSlop={12} onPress={onToggleSave}>
              <SymbolView
                name={vocab.saved ? 'bookmark.fill' : 'bookmark'}
                tintColor={palette.ink as string}
                size={22}
              />
            </Pressable>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.head}>
          <Text style={styles.surface}>{vocab.surface}</Text>
          <Text style={styles.reading}>{vocab.reading}</Text>
          <Text style={styles.pronunciationKo}>{vocab.pronunciationKo}</Text>
        </View>
        <Host style={styles.formHost}>
          <Form>
            <Section title="의미">
              <Label title={vocab.meaningKo} />
            </Section>
            <Section title="예문">
              <Label title={vocab.exampleJa} />
              <Label title={vocab.exampleKo} />
            </Section>
            {vocab.usageNote ? (
              <Section title="메모">
                <Label title={vocab.usageNote} systemImage="text.bubble" />
              </Section>
            ) : null}
            <Section title="상세">
              <Label title={vocab.level} systemImage="square.stack" />
              <Label
                title={vocab.partOfSpeech.join(', ') || '—'}
                systemImage="tag"
              />
              {vocab.kanjiUsed.length > 0 ? (
                <Label title={`한자: ${vocab.kanjiUsed.join(' · ')}`} systemImage="character" />
              ) : null}
            </Section>
            <Section title="학습 현황">
              <Label
                title={STATUS_LABEL[vocab.status]}
                systemImage={STATUS_ICON[vocab.status]}
              />
              <Label
                title={`다음 복습: ${formatNextReview(vocab.dueAt, vocab.status)}`}
                systemImage="calendar"
              />
              {vocab.intervalDays > 0 ? (
                <Label
                  title={`현재 간격: ${Math.round(vocab.intervalDays)}일`}
                  systemImage="arrow.right"
                />
              ) : null}
              {vocab.reps > 0 ? (
                <Label
                  title={`총 복습 ${vocab.reps}회`}
                  systemImage="repeat"
                />
              ) : null}
            </Section>
            {vocab.jmdictGlosses.length > 0 ? (
              <Section title="참고">
                <Label title={vocab.jmdictGlosses.join('; ')} systemImage="book" />
                <Label
                  title={`JMdict #${vocab.jmdictEntryId} · CC BY-SA 4.0`}
                  systemImage="info.circle"
                />
              </Section>
            ) : null}
          </Form>
        </Host>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surfaceGrouped as string,
  },
  head: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  surface: {
    ...typography.cardFace,
    color: palette.ink as string,
  },
  reading: {
    ...typography.cardReading,
    color: palette.inkFaint as string,
  },
  pronunciationKo: {
    ...typography.footnote,
    color: palette.inkFaint as string,
  },
  formHost: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceGrouped as string,
  },
});
