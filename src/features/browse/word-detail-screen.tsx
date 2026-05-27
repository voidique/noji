import { Form, Host, Label, Section } from '@expo/ui/swift-ui';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import type { VocabWithReview } from '../../data/vocab-types';
import { toggleSaved } from '../../repositories/review-repo';
import { getVocabById } from '../../repositories/vocab-repo';
import { palette, spacing, typography } from '../../theme/tokens';

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
              <Label title={`레벨 ${vocab.level}`} systemImage="square.stack" />
              <Label
                title={vocab.partOfSpeech.join(', ') || '—'}
                systemImage="tag"
              />
              {vocab.kanjiUsed.length > 0 ? (
                <Label title={`한자: ${vocab.kanjiUsed.join(' · ')}`} systemImage="character" />
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
