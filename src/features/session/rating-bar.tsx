import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReviewRating } from '../../data/vocab-types';
import { palette, spacing, typography } from '../../theme/tokens';

interface Props {
  onRate: (rating: ReviewRating) => void;
  intervals: Record<ReviewRating, string>;
  disabled?: boolean;
}

const RATINGS: { rating: ReviewRating; label: string }[] = [
  { rating: 'again', label: '다시'   },
  { rating: 'hard',  label: '어려움' },
  { rating: 'good',  label: '알겠어' },
  { rating: 'easy',  label: '완벽해' },
];

export function RatingBar({ onRate, intervals, disabled }: Props) {
  const handlePress = (rating: ReviewRating) => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRate(rating);
  };

  return (
    <View style={styles.row}>
      {RATINGS.map(({ rating, label }) => (
        <Pressable
          key={rating}
          style={({ pressed }) => [styles.btn, (pressed || disabled) && styles.pressed]}
          onPress={() => handlePress(rating)}
          accessibilityRole="button"
          accessibilityLabel={`${label}, ${intervals[rating]}`}
          hitSlop={4}
        >
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.interval}>{intervals[rating]}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xs,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  pressed: {
    opacity: 0.35,
  },
  label: {
    ...typography.subhead,
    fontWeight: '600',
    color: palette.ink as string,
  },
  interval: {
    ...typography.caption,
    color: palette.inkFaint as string,
    marginTop: 2,
  },
});
