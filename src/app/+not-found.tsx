import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { palette, spacing, typography } from '../theme/tokens';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>페이지를 찾을 수 없어요</Text>
      <Link href="/" style={styles.link}>
        홈으로
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: palette.surface as string,
  },
  title: {
    ...typography.title2,
    color: palette.ink as string,
  },
  link: {
    ...typography.body,
    color: palette.ink as string,
    textDecorationLine: 'underline',
  },
});
