import { StyleSheet, Text, View } from 'react-native';
import type { JlptLevel } from '../data/vocab-types';
import { palette, radius, spacing, typography } from '../theme/tokens';

interface Props {
  level: JlptLevel;
}

export function LevelPill({ level }: Props) {
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.separatorOpaque as string,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    color: palette.inkMuted as string,
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
  },
});
