import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { radius, spacing, typography } from '../../../theme/tokens';

const RATINGS = [
  { label: '다시',   bg: 'rgba(255,59,48,0.13)',  color: '#FF3B30', border: 'rgba(255,59,48,0.28)' },
  { label: '어려움', bg: 'rgba(255,149,0,0.13)',  color: '#FF9500', border: 'rgba(255,149,0,0.28)' },
  { label: '알겠어', bg: 'rgba(52,199,89,0.13)',  color: '#34C759', border: 'rgba(52,199,89,0.28)' },
  { label: '완벽해', bg: 'rgba(0,122,255,0.13)',  color: '#007AFF', border: 'rgba(0,122,255,0.28)' },
] as const;

interface Props {
  active: boolean;
}

export function RatingBarIllustration({ active }: Props) {
  return (
    <View style={styles.wrap}>
      {RATINGS.map(({ label, bg, color, border }, i) => (
        <Pill
          key={label}
          label={label}
          bg={bg}
          color={color}
          border={border}
          delay={i * 100}
          active={active}
        />
      ))}
    </View>
  );
}

function Pill({
  label,
  bg,
  color,
  border,
  delay,
  active,
}: {
  label: string;
  bg: string;
  color: string;
  border: string;
  delay: number;
  active: boolean;
}) {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(28);

  useEffect(() => {
    if (active) {
      opacity.value = withDelay(delay, withSpring(1, { damping: 16, stiffness: 110 }));
      ty.value = withDelay(delay, withSpring(0, { damping: 16, stiffness: 110 }));
    } else {
      opacity.value = 0;
      ty.value = 28;
    }
  }, [active, delay, opacity, ty]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }));

  return (
    <Animated.View
      style={[styles.pill, { backgroundColor: bg, borderColor: border }, animStyle]}
    >
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    maxWidth: 320,
  },
  pill: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 88,
  },
  label: {
    ...typography.subhead,
    fontWeight: '600',
  },
});
