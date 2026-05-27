import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import type { VocabWithReview } from '../data/vocab-types';
import { palette, spacing, typography } from '../theme/tokens';

interface Props {
  vocab: VocabWithReview;
  showLevel?: boolean;
  showSeparator?: boolean;
}

export function VocabRow({ vocab, showLevel = false, showSeparator = true }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/browse/${vocab.id}`)}
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
      </View>

      {showLevel ? <Text style={styles.level}>{vocab.level}</Text> : null}

      <Text style={styles.meaning} numberOfLines={2}>
        {vocab.shortMeaningKo}
      </Text>

      {showSeparator ? <View style={styles.separator} /> : null}
    </Pressable>
  );
}

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
  level: {
    ...typography.caption,
    color: palette.inkFaint as string,
    letterSpacing: 0.6,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  meaning: {
    ...typography.subhead,
    color: palette.inkMuted as string,
    textAlign: 'right',
    marginLeft: spacing.md,
    maxWidth: '45%',
    flexShrink: 1,
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
