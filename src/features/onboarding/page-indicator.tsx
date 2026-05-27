import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { palette, spacing } from '../../theme/tokens';

interface Props {
  count: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
}

export function PageIndicator({ count, scrollX, pageWidth }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} index={i} scrollX={scrollX} pageWidth={pageWidth} />
      ))}
    </View>
  );
}

function Dot({
  index,
  scrollX,
  pageWidth,
}: {
  index: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
}) {
  const style = useAnimatedStyle(() => {
    const progress = pageWidth === 0 ? 0 : scrollX.value / pageWidth;
    const distance = Math.abs(progress - index);
    const width = interpolate(distance, [0, 1], [22, 6], 'clamp');
    const opacity = interpolate(distance, [0, 1], [1, 0.3], 'clamp');
    return { width, opacity };
  });

  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.ink as string,
  },
});
