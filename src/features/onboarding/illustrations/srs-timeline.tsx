import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { palette, spacing, typography } from '../../../theme/tokens';

interface Props {
  active: boolean;
}

const STOPS = ['1d', '3d', '7d', '14d', '30d'];

export function SrsTimeline({ active }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!active) return;
    progress.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [active, progress]);

  const dotStyle = useAnimatedStyle(() => ({
    left: `${progress.value * 100}%`,
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.trackArea}>
        <View style={styles.track} />
        <Animated.View style={[styles.fill, fillStyle]} />
        {STOPS.map((_, i) => {
          const left = (i / (STOPS.length - 1)) * 100;
          return (
            <View
              key={i}
              style={[styles.stop, { left: `${left}%` }]}
            />
          );
        })}
        <Animated.View style={[styles.movingDot, dotStyle]} />
      </View>
      <View style={styles.labelRow}>
        {STOPS.map((s) => (
          <Text key={s} style={styles.label}>
            {s}
          </Text>
        ))}
      </View>
    </View>
  );
}

const TRACK_W = 260;
const TRACK_H = 4;
const DOT = 16;
const STOP_DOT = 8;

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.lg,
    alignItems: 'center',
  },
  trackArea: {
    width: TRACK_W,
    height: DOT,
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    backgroundColor: palette.separator as string,
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    backgroundColor: palette.ink as string,
  },
  stop: {
    position: 'absolute',
    width: STOP_DOT,
    height: STOP_DOT,
    borderRadius: STOP_DOT / 2,
    backgroundColor: palette.surface as string,
    borderWidth: 2,
    borderColor: palette.ink as string,
    marginLeft: -STOP_DOT / 2,
    top: (DOT - STOP_DOT) / 2,
  },
  movingDot: {
    position: 'absolute',
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: palette.ink as string,
    marginLeft: -DOT / 2,
  },
  labelRow: {
    width: TRACK_W,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...typography.caption,
    color: palette.inkFaint as string,
    fontVariant: ['tabular-nums'],
  },
});
