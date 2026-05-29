import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { EmptyState } from '../../components/empty-state';
import { palette, spacing, typography } from '../../theme/tokens';
import { RatingBar } from './rating-bar';
import { SessionCard } from './session-card';
import { useSessionQueue } from './use-session-queue';

export function SessionScreen() {
  const router = useRouter();
  const { current, completed, total, loading, rate, intervals } = useSessionQueue();

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: '' }} />
        <View style={styles.center} />
      </>
    );
  }

  if (!current) {
    return (
      <>
        <Stack.Screen options={{ title: '완료' }} />
        <View style={styles.center}>
          <EmptyState
            title="학습 완료"
            systemImage="checkmark.circle"
            description={`${completed}개의 단어를 학습했어요.`}
          />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <SymbolView name="xmark" tintColor={palette.ink as string} size={20} />
            </Pressable>
          ),
          headerTitle: () => (
            <Text style={styles.headerTitle}>
              {completed + 1} / {total}
            </Text>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.cardArea} key={current.id}>
          <SessionCard vocab={current} />
        </View>
        <RatingBar onRate={rate} intervals={intervals} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surfaceGrouped as string,
  },
  cardArea: {
    flex: 1,
    paddingVertical: spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceGrouped as string,
  },
  headerTitle: {
    ...typography.subhead,
    color: palette.inkMuted as string,
    fontVariant: ['tabular-nums'],
  },
});
