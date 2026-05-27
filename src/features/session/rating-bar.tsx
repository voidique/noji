import { Button, HStack, Host } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize, tint } from '@expo/ui/swift-ui/modifiers';
import { StyleSheet, View } from 'react-native';
import type { ReviewRating } from '../../data/vocab-types';
import { palette, spacing } from '../../theme/tokens';

interface Props {
  onRate: (rating: ReviewRating) => void;
  disabled?: boolean;
}

const RATINGS: { rating: ReviewRating; label: string }[] = [
  { rating: 'again', label: '다시' },
  { rating: 'hard', label: '어려움' },
  { rating: 'good', label: '보통' },
  { rating: 'easy', label: '쉬움' },
];

export function RatingBar({ onRate, disabled }: Props) {
  return (
    <View style={styles.wrap}>
      <Host matchContents>
        <HStack spacing={spacing.sm}>
          {RATINGS.map((r) => (
            <Button
              key={r.rating}
              label={r.label}
              onPress={() => !disabled && onRate(r.rating)}
              modifiers={[
                buttonStyle('bordered'),
                controlSize('large'),
                tint(palette.ink as string),
              ]}
            />
          ))}
        </HStack>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
