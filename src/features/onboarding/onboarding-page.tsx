import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { palette, spacing, typography } from '../../theme/tokens';
import { Illustration } from './illustration';
import type { OnboardingPage } from './page-content';

interface Props {
  page: OnboardingPage;
  index: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
  activeIndex: number;
}

export function OnboardingPageView({
  page,
  index,
  scrollX,
  pageWidth,
  activeIndex,
}: Props) {
  const { height } = useWindowDimensions();

  const illoStyle = useAnimatedStyle(() => {
    if (pageWidth === 0) return { opacity: 1, transform: [{ translateY: 0 }] };
    const progress = scrollX.value / pageWidth;
    const distance = progress - index;
    const opacity = interpolate(distance, [-1, 0, 1], [0, 1, 0], 'clamp');
    const translateY = interpolate(distance, [-1, 0, 1], [40, 0, -40], 'clamp');
    return { opacity, transform: [{ translateY }] };
  });

  const textStyle = useAnimatedStyle(() => {
    if (pageWidth === 0) return { opacity: 1, transform: [{ translateY: 0 }] };
    const progress = scrollX.value / pageWidth;
    const distance = progress - index;
    const opacity = interpolate(distance, [-1, 0, 1], [0, 1, 0], 'clamp');
    const translateY = interpolate(distance, [-1, 0, 1], [24, 0, -24], 'clamp');
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <View style={[styles.page, { width: pageWidth, minHeight: height }]}>
      <Animated.View style={[styles.illoArea, illoStyle]}>
        <Illustration kind={page.kind} active={activeIndex === index} />
      </Animated.View>
      <Animated.View style={[styles.textArea, textStyle]}>
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.body}>{page.body}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illoArea: {
    flex: 0.55,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
  },
  textArea: {
    flex: 0.45,
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.title1,
    color: palette.ink as string,
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 36,
  },
  body: {
    ...typography.body,
    color: palette.inkMuted as string,
    textAlign: 'center',
    lineHeight: 26,
  },
});
