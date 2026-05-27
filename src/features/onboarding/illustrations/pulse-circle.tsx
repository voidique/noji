import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { palette } from '../../../theme/tokens';

interface Props {
  active: boolean;
}

export function PulseCircle({ active }: Props) {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0.4);
  const innerScale = useSharedValue(1);

  useEffect(() => {
    if (!active) return;
    scale.value = withRepeat(
      withTiming(1.25, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(0.05, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    innerScale.value = withRepeat(
      withTiming(1.05, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [active, scale, opacity, innerScale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: innerScale.value }],
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.ring, ringStyle]} />
      <Animated.View style={[styles.core, coreStyle]} />
    </View>
  );
}

const SIZE = 140;

const styles = StyleSheet.create({
  wrap: {
    width: SIZE * 1.6,
    height: SIZE * 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    borderColor: palette.ink as string,
  },
  core: {
    width: SIZE * 0.55,
    height: SIZE * 0.55,
    borderRadius: SIZE,
    backgroundColor: palette.ink as string,
  },
});
