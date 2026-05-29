import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { VocabWithReview } from '../../data/vocab-types';
import { LevelPill } from '../../components/level-pill';
import { glassPalette, palette, spacing, typography } from '../../theme/tokens';

interface Props {
  vocab: VocabWithReview;
}

const SPRING = { damping: 14, stiffness: 95, mass: 0.85 } as const;
const CARD_RADIUS = 28;

export function SessionCard({ vocab }: Props) {
  const flip = useSharedValue(0);
  const gp = glassPalette[useColorScheme() === 'dark' ? 'dark' : 'light'];

  const toggle = useCallback(() => {
    flip.value = withSpring(flip.value < 0.5 ? 1 : 0, SPRING);
  }, [flip]);

  // Front: 0° → -180° (flips backward)
  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(flip.value, [0, 1], [0, -180])}deg` },
    ],
    backfaceVisibility: 'hidden',
  }));

  // Back: 180° → 0° (comes from the other side)
  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(flip.value, [0, 1], [180, 0])}deg` },
    ],
    backfaceVisibility: 'hidden',
  }));

  // Light sheen: peaks at midpoint of flip (edge-on moment)
  const sheenStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      flip.value,
      [0, 0.35, 0.5, 0.65, 1],
      [0, 0, 0.42, 0, 0],
    );
    return { opacity };
  });

  const faceStyle = {
    backgroundColor: gp.cardBg,
    borderColor: gp.cardBorder,
  };

  const containerShadow = {
    shadowColor: gp.cardGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 12,
  };

  return (
    <Pressable style={[styles.container, containerShadow]} onPress={toggle}>
      {/* ── Front face ── */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.face, faceStyle, frontStyle]}>
        <View style={styles.headRow}>
          <LevelPill level={vocab.level} />
        </View>

        <View style={styles.faceSection}>
          <Text style={styles.surface} adjustsFontSizeToFit numberOfLines={1}>
            {vocab.surface}
          </Text>
          <Text style={styles.reading} numberOfLines={1}>
            {vocab.reading}
          </Text>
          <Text style={styles.pronunciationKo} numberOfLines={1}>
            {vocab.pronunciationKo}
          </Text>
        </View>

        <View style={styles.hintWrap}>
          <Text style={styles.hint}>탭하여 의미 보기</Text>
        </View>
      </Animated.View>

      {/* ── Back face ── */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.face, faceStyle, backStyle]}>
        <View style={styles.headRow}>
          <LevelPill level={vocab.level} />
        </View>

        <View style={styles.backSection}>
          <Text style={styles.meaning} numberOfLines={3}>
            {vocab.meaningKo}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.exampleJa}>{vocab.exampleJa}</Text>
          <Text style={styles.exampleKo}>{vocab.exampleKo}</Text>
          {vocab.usageNote ? (
            <Text style={styles.note}>{vocab.usageNote}</Text>
          ) : null}
        </View>

        <View style={styles.hintWrap}>
          <Text style={styles.hint}>탭하여 앞면 보기</Text>
        </View>
      </Animated.View>

      {/* ── Light sheen overlay ── */}
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.sheen, sheenStyle]}
        pointerEvents="none"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: spacing.lg,
    borderRadius: CARD_RADIUS,
  },
  face: {
    flex: 1,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    overflow: 'hidden',
  },
  headRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  // ── Front ──────────────────────────
  faceSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  surface: {
    ...typography.cardFace,
    color: palette.ink as string,
    textAlign: 'center',
  },
  reading: {
    ...typography.cardReading,
    color: palette.inkFaint as string,
    textAlign: 'center',
  },
  pronunciationKo: {
    ...typography.footnote,
    color: palette.inkFaint as string,
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  // ── Back ───────────────────────────
  backSection: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  meaning: {
    ...typography.title2,
    color: palette.ink as string,
    textAlign: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.separator as string,
    marginVertical: spacing.xs,
  },
  exampleJa: {
    ...typography.body,
    color: palette.ink as string,
    lineHeight: 26,
  },
  exampleKo: {
    ...typography.subhead,
    color: palette.inkMuted as string,
    lineHeight: 22,
  },
  note: {
    ...typography.footnote,
    color: palette.inkFaint as string,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },

  // ── Common ─────────────────────────
  hintWrap: {
    alignItems: 'center',
    paddingBottom: spacing.sm,
  },
  hint: {
    ...typography.caption,
    color: palette.inkFaint as string,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sheen: {
    borderRadius: CARD_RADIUS,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
});
