import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { palette, radius, spacing, typography } from '../../../theme/tokens';

interface Props {
  active: boolean;
}

const RATINGS = ['Again', 'Hard', 'Good', 'Easy'];

export function CardFlip({ active }: Props) {
  const flip = useSharedValue(0);
  const highlight = useSharedValue(0);

  useEffect(() => {
    if (!active) return;
    flip.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1400 }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.cubic) }),
        withTiming(1, { duration: 1400 }),
        withTiming(0, { duration: 700, easing: Easing.inOut(Easing.cubic) })
      ),
      -1,
      false
    );
    highlight.value = withRepeat(
      withTiming(4, { duration: 4200, easing: Easing.linear }),
      -1,
      false
    );
  }, [active, flip, highlight]);

  const frontStyle = useAnimatedStyle(() => {
    const rotate = interpolate(flip.value, [0, 1], [0, 180]);
    const opacity = flip.value < 0.5 ? 1 : 0;
    return {
      transform: [{ perspective: 800 }, { rotateY: `${rotate}deg` }],
      opacity,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotate = interpolate(flip.value, [0, 1], [180, 360]);
    const opacity = flip.value >= 0.5 ? 1 : 0;
    return {
      transform: [{ perspective: 800 }, { rotateY: `${rotate}deg` }],
      opacity,
    };
  });

  return (
    <View style={styles.wrap}>
      <View style={styles.cardArea}>
        <Animated.View style={[styles.card, frontStyle]}>
          <Text style={styles.surface}>食べる</Text>
          <Text style={styles.reading}>たべる</Text>
        </Animated.View>
        <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
          <Text style={styles.meaning}>먹다</Text>
          <Text style={styles.example}>パンを食べます。</Text>
        </Animated.View>
      </View>

      <View style={styles.ratingRow}>
        {RATINGS.map((r, i) => (
          <RatingChip key={r} label={r} index={i} highlight={highlight} />
        ))}
      </View>
    </View>
  );
}

function RatingChip({
  label,
  index,
  highlight,
}: {
  label: string;
  index: number;
  highlight: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const active = Math.floor(highlight.value) === index;
    return {
      opacity: withTiming(active ? 1 : 0.35, { duration: 200 }),
      transform: [{ scale: withTiming(active ? 1.05 : 1, { duration: 200 }) }],
    };
  });

  return (
    <Animated.View style={[styles.chip, style]}>
      <Text style={styles.chipText}>{label}</Text>
    </Animated.View>
  );
}

const CARD_W = 220;
const CARD_H = 140;

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  cardArea: {
    width: CARD_W,
    height: CARD_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_H,
    borderRadius: radius.lg,
    backgroundColor: palette.surfaceElevated as string,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.separatorOpaque as string,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    gap: 4,
  },
  cardBack: {
    backgroundColor: palette.surfaceElevated as string,
  },
  surface: {
    fontSize: 40,
    fontWeight: '600',
    color: palette.ink as string,
  },
  reading: {
    ...typography.subhead,
    color: palette.inkFaint as string,
  },
  meaning: {
    ...typography.title2,
    color: palette.ink as string,
  },
  example: {
    ...typography.footnote,
    color: palette.inkFaint as string,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.separatorOpaque as string,
  },
  chipText: {
    ...typography.caption,
    color: palette.ink as string,
    fontWeight: '600',
  },
});
