import { ScrollView, StyleSheet, Text } from 'react-native';
import { palette, spacing, typography } from '../../theme/tokens';

const ATTRIBUTION = `This app uses JMdict and KANJIDIC2 from the Electronic Dictionary Research and Development Group (EDRDG), licensed under Creative Commons Attribution-ShareAlike 4.0. Pitch accent data from the Kanjium project (Mifune Toshiro et al.), licensed under Creative Commons Attribution-ShareAlike 4.0. If KanjiVG stroke data is included, copyright Ulrich Apel, licensed under Creative Commons Attribution-ShareAlike 3.0.

Korean meanings, Japanese example sentences, Korean translations, quizzes, mnemonics, and learning order are independently created for this app. Modern JLPT does not publish an official complete vocabulary or kanji list; this app provides JLPT N5-N4 level study content, not an official JLPT list.`;

export function AboutScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>출처</Text>
      <Text style={styles.body}>{ATTRIBUTION}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: palette.surface as string,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  heading: {
    ...typography.title3,
    color: palette.ink as string,
  },
  body: {
    ...typography.footnote,
    color: palette.inkMuted as string,
    lineHeight: 20,
  },
});
