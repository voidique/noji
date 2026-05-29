import { Button, Host } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize, tint } from '@expo/ui/swift-ui/modifiers';
import { Stack, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { markOnboarded } from '../../repositories/settings-repo';
import { palette, spacing, typography } from '../../theme/tokens';
import { OnboardingPageView } from './onboarding-page';
import { ONBOARDING_PAGES } from './page-content';
import { PageIndicator } from './page-indicator';

export function OnboardingScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const isLast = activeIndex === ONBOARDING_PAGES.length - 1;

  const goNext = () => {
    if (isLast) {
      complete();
      return;
    }
    scrollRef.current?.scrollTo({ x: width * (activeIndex + 1), animated: true });
  };

  const complete = async () => {
    await markOnboarded(db);
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace('/');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <View style={styles.root}>
        <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
          {!isLast ? (
            <Pressable hitSlop={12} onPress={complete} style={styles.skipBtn}>
              <Text style={styles.skipText}>건너뛰기</Text>
            </Pressable>
          ) : (
            <View />
          )}
        </View>

        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          onMomentumScrollEnd={onMomentumEnd}
          scrollEventThrottle={16}
          bounces={false}
        >
          {ONBOARDING_PAGES.map((page, i) => (
            <OnboardingPageView
              key={i}
              page={page}
              index={i}
              scrollX={scrollX}
              pageWidth={width}
              activeIndex={activeIndex}
            />
          ))}
        </Animated.ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.lg }]}>
          <PageIndicator
            count={ONBOARDING_PAGES.length}
            scrollX={scrollX}
            pageWidth={width}
          />
          <Host style={styles.cta}>
            <Button
              label={isLast ? '시작하기' : '다음'}
              onPress={goNext}
              modifiers={[
                buttonStyle('borderedProminent'),
                controlSize('large'),
                tint('#007AFF'),
              ]}
            />
          </Host>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.surface as string,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  skipBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  skipText: {
    ...typography.subhead,
    color: palette.inkFaint as string,
  },
  bottomBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  cta: {
    height: 52,
  },
});
