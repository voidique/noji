import { useRouter } from 'expo-router';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import type { ReviewStatus, VocabWithReview } from '../data/vocab-types';
import { palette, ratingColors, spacing, typography } from '../theme/tokens';

interface Props {
  vocab: VocabWithReview;
  showLevel?: boolean;
  showSeparator?: boolean;
}

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<ReviewStatus, string> = {
  new:      '처음',
  learning: '배우는 중',
  review:   '복습',
  known:    '외웠어요',
};

function statusColor(status: ReviewStatus): string {
  switch (status) {
    case 'new':      return palette.inkFaint as string;
    case 'learning': return ratingColors.hard.text as string;
    case 'review':   return ratingColors.easy.text as string;
    case 'known':    return ratingColors.good.text as string;
  }
}

function formatDue(dueAt: number, status: ReviewStatus): string {
  if (status === 'new' || status === 'known') return '';
  const diffMs = dueAt - Date.now();
  if (diffMs <= 0) return '지금';
  const mins = Math.round(diffMs / 60_000);
  if (mins < 60) return `${mins}분 후`;
  const days = Math.round(diffMs / 86_400_000);
  if (days < 1) return '오늘';
  return `${days}일 후`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const VocabRow = memo(function VocabRow({ vocab, showLevel = false, showSeparator = true }: Props) {
  const router = useRouter();
  const onPress = useCallback(() => {
    router.push(`/browse/${vocab.id}`);
  }, [router, vocab.id]);

  const due = formatDue(vocab.dueAt, vocab.status);
  const statusText = STATUS_LABEL[vocab.status] + (due ? ` · ${due}` : '');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      android_ripple={{ color: palette.separator as string }}
    >
      <View style={styles.leading}>
        <View style={styles.surfaceRow}>
          <Text style={styles.surface} numberOfLines={1}>
            {vocab.surface}
          </Text>
          {vocab.saved ? (
            <SymbolView
              name="bookmark.fill"
              size={11}
              tintColor={palette.inkFaint as string}
            />
          ) : null}
        </View>
        <Text style={styles.reading} numberOfLines={1}>
          {vocab.reading}
        </Text>
        <Text style={styles.pronunciationKo} numberOfLines={1}>
          {vocab.pronunciationKo}
        </Text>
      </View>

      {showLevel ? <Text style={styles.level}>{vocab.level}</Text> : null}

      <View style={styles.trailing}>
        <Text style={styles.meaning} numberOfLines={2}>
          {vocab.shortMeaningKo}
        </Text>
        <Text style={[styles.status, { color: statusColor(vocab.status) }]} numberOfLines={1}>
          {statusText}
        </Text>
      </View>

      {showSeparator ? <View style={styles.separator} /> : null}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: palette.surface as string,
    minHeight: 64,
  },
  pressed: {
    opacity: 0.55,
  },
  leading: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  surfaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  surface: {
    ...typography.headline,
    color: palette.ink as string,
    fontSize: 19,
  },
  reading: {
    ...typography.footnote,
    color: palette.inkFaint as string,
  },
  pronunciationKo: {
    ...typography.caption,
    color: palette.inkFaint as string,
  },
  level: {
    ...typography.caption,
    color: palette.inkFaint as string,
    letterSpacing: 0.6,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: 3,
    marginLeft: spacing.md,
    flexShrink: 1,
    maxWidth: '45%',
  },
  meaning: {
    ...typography.subhead,
    color: palette.inkMuted as string,
    textAlign: 'right',
  },
  status: {
    ...typography.caption,
    textAlign: 'right',
  },
  separator: {
    position: 'absolute',
    left: spacing.lg,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.separator as string,
  },
});
