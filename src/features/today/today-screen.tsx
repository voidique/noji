import { Button, Host } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize, tint } from '@expo/ui/swift-ui/modifiers';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { palette, radius, spacing, typography } from '../../theme/tokens';
import { useTodayData } from './use-today-data';

export function TodayScreen() {
  const router = useRouter();
  const { stats, settings, loading } = useTodayData();

  if (loading || !stats || !settings) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const newToShow = Math.min(stats.newCount, settings.newPerDay);
  const totalQueue = newToShow + stats.due;
  const learned = stats.known;
  const learnedPct = stats.total === 0 ? 0 : Math.round((learned / stats.total) * 100);
  const isCaughtUp = totalQueue === 0;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroLevel}>레벨 {settings.targetLevel}</Text>
          <Text style={styles.heroNumber}>{totalQueue}</Text>
          <Text style={styles.heroLabel}>
            {isCaughtUp ? '오늘 학습 완료' : '개의 단어가 기다려요'}
          </Text>
        </View>

        <SectionTitle>오늘</SectionTitle>
        <Card>
          <StatRow icon="sparkle" label="신규" value={newToShow} />
          <Divider />
          <StatRow icon="arrow.triangle.2.circlepath" label="복습" value={stats.due} />
          <Divider />
          <StatRow icon="checkmark.circle" label="완료" value={learned} />
        </Card>

        <SectionTitle>진도</SectionTitle>
        <Card>
          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>{settings.targetLevel}</Text>
              <Text style={styles.progressPct}>{learnedPct}%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${learnedPct}%` }]} />
            </View>
            <Text style={styles.progressMeta}>
              {stats.total}개 중 {learned}개 학습 완료
            </Text>
          </View>
        </Card>

        <View style={styles.actionBlock}>
          <Host style={styles.actionHost}>
            <Button
              label={isCaughtUp ? '단어 보기' : '학습 시작'}
              systemImage={isCaughtUp ? 'book' : 'play.fill'}
              onPress={() => router.push(isCaughtUp ? '/browse' : '/session')}
              modifiers={[
                buttonStyle('borderedProminent'),
                controlSize('large'),
                tint(palette.ink as string),
              ]}
            />
          </Host>
        </View>
      </ScrollView>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: SFSymbol;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.statRow}>
      <View style={styles.statIconWrap}>
        <SymbolView name={icon} size={18} tintColor={palette.ink as string} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.surfaceGrouped as string,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  heroCard: {
    backgroundColor: palette.surfaceElevated as string,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  heroLevel: {
    ...typography.footnote,
    color: palette.inkFaint as string,
    letterSpacing: 0.6,
  },
  heroNumber: {
    fontSize: 84,
    fontWeight: '700',
    color: palette.ink as string,
    letterSpacing: -3,
    fontVariant: ['tabular-nums'],
    lineHeight: 92,
  },
  heroLabel: {
    ...typography.subhead,
    color: palette.inkFaint as string,
  },
  sectionTitle: {
    ...typography.footnote,
    color: palette.inkFaint as string,
    letterSpacing: 0.4,
    paddingTop: spacing.md,
    paddingLeft: spacing.xs,
    fontWeight: '600',
  },
  card: {
    backgroundColor: palette.surfaceElevated as string,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    minHeight: 52,
  },
  statIconWrap: {
    width: 28,
    alignItems: 'center',
  },
  statLabel: {
    ...typography.body,
    color: palette.ink as string,
    flex: 1,
  },
  statValue: {
    ...typography.body,
    color: palette.ink as string,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.separator as string,
    marginLeft: spacing.lg + 28 + spacing.md,
  },
  progressBlock: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  progressTitle: {
    ...typography.headline,
    color: palette.ink as string,
  },
  progressPct: {
    ...typography.headline,
    color: palette.ink as string,
    fontVariant: ['tabular-nums'],
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.separator as string,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: palette.ink as string,
    borderRadius: 3,
  },
  progressMeta: {
    ...typography.footnote,
    color: palette.inkFaint as string,
    fontVariant: ['tabular-nums'],
  },
  actionBlock: {
    paddingTop: spacing.lg,
  },
  actionHost: {
    height: 52,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceGrouped as string,
  },
});
