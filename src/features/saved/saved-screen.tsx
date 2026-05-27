import { FlatList, StyleSheet, View } from 'react-native';
import { EmptyState } from '../../components/empty-state';
import { VocabRow } from '../../components/vocab-row';
import { palette, spacing } from '../../theme/tokens';
import { useSavedData } from './use-saved-data';

export function SavedScreen() {
  const { items, loading } = useSavedData();

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <VocabRow
          vocab={item}
          showLevel
          showSeparator={index !== items.length - 1}
        />
      )}
      ListEmptyComponent={
        loading ? null : (
          <View style={styles.empty}>
            <EmptyState
              title="저장된 단어가 없어요"
              systemImage="bookmark"
              description="단어 상세에서 북마크를 누르면 여기에 모여요."
            />
          </View>
        )
      }
      ListFooterComponent={items.length > 0 ? <View style={styles.footer} /> : null}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: palette.surface as string,
  },
  footer: {
    height: spacing.xxl,
  },
  empty: {
    paddingTop: spacing.xxl,
    alignItems: 'center',
  },
});
