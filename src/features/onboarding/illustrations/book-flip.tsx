import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
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

export function BookFlip({ active }: Props) {
  const rotate = useSharedValue(-12);
  const lift = useSharedValue(0);

  useEffect(() => {
    if (!active) return;
    rotate.value = withRepeat(
      withSequence(
        withTiming(12, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(-12, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
    lift.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, [active, rotate, lift]);

  const bookStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateY: `${rotate.value}deg` },
      { translateY: lift.value },
    ],
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.book, bookStyle]}>
        <SymbolView name="book.fill" size={88} tintColor={palette.ink as string} />
      </Animated.View>
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>N5</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>N4</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  book: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.separatorOpaque as string,
  },
  badgeText: {
    ...typography.caption,
    color: palette.inkMuted as string,
    letterSpacing: 0.8,
  },
});
