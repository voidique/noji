import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SymbolView } from 'expo-symbols';
import { palette } from '../../../theme/tokens';

interface Props {
  active: boolean;
}

export function Checkmark({ active }: Props) {
  const ringScale = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      ringScale.value = 0;
      checkScale.value = 0;
      return;
    }
    ringScale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    checkScale.value = withDelay(
      300,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.5)) })
    );
    pulse.value = withDelay(
      900,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      )
    );
  }, [active, ringScale, checkScale, pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringScale.value,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.3 }],
    opacity: 0.4 - pulse.value * 0.4,
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.pulseRing, pulseStyle]} />
      <Animated.View style={[styles.ring, ringStyle]}>
        <Animated.View style={checkStyle}>
          <SymbolView
            name="checkmark"
            size={64}
            tintColor={palette.surface as string}
            weight="bold"
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const SIZE = 140;

const styles = StyleSheet.create({
  wrap: {
    width: SIZE * 1.4,
    height: SIZE * 1.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: palette.ink as string,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    borderColor: palette.ink as string,
  },
});
