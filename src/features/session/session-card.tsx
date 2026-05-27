import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { VocabWithReview } from '../../data/vocab-types';
import { LevelPill } from '../../components/level-pill';
import { palette, radius, spacing, typography } from '../../theme/tokens';

interface Props {
  vocab: VocabWithReview;
}

export function SessionCard({ vocab }: Props) {
  const [revealed, setRevealed] = useState(false);

  const toggle = useCallback(() => setRevealed((v) => !v), []);

  return (
    <Pressable style={styles.card} onPress={toggle}>
      <View style={styles.headRow}>
        <LevelPill level={vocab.level} />
      </View>
      <View style={styles.faceSection}>
        <Text style={styles.surface} adjustsFontSizeToFit numberOfLines={1}>
          {vocab.surface}
        </Text>
        <Text style={styles.reading} numberOfLines={1}>
          {vocab.reading}
        </Text>
      </View>
      {revealed ? (
        <View style={styles.revealSection}>
          <Text style={styles.meaning}>{vocab.meaningKo}</Text>
          <View style={styles.exampleBlock}>
            <Text style={styles.exampleJa}>{vocab.exampleJa}</Text>
            <Text style={styles.exampleKo}>{vocab.exampleKo}</Text>
          </View>
          {vocab.usageNote ? <Text style={styles.note}>{vocab.usageNote}</Text> : null}
        </View>
      ) : (
        <View style={styles.tapHintWrap}>
          <Text style={styles.tapHint}>탭하여 의미 보기</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: palette.surfaceElevated as string,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.separatorOpaque as string,
  },
  headRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  faceSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  surface: {
    ...typography.cardFace,
    color: palette.ink as string,
    textAlign: 'center',
  },
  reading: {
    ...typography.cardReading,
    color: palette.inkFaint as string,
    textAlign: 'center',
  },
  tapHintWrap: {
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  tapHint: {
    ...typography.footnote,
    color: palette.inkFaint as string,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  revealSection: {
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.separator as string,
    gap: spacing.md,
  },
  meaning: {
    ...typography.title2,
    color: palette.ink as string,
    textAlign: 'center',
  },
  exampleBlock: {
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  exampleJa: {
    ...typography.body,
    color: palette.ink as string,
  },
  exampleKo: {
    ...typography.subhead,
    color: palette.inkMuted as string,
  },
  note: {
    ...typography.footnote,
    color: palette.inkFaint as string,
    fontStyle: 'italic',
  },
});
