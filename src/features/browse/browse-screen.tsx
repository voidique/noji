import { Host, Picker, Text } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text as RNText, View } from 'react-native';
import { EmptyState } from '../../components/empty-state';
import { VocabRow } from '../../components/vocab-row';
import type { JlptLevel, VocabWithReview } from '../../data/vocab-types';
import { palette, spacing, typography } from '../../theme/tokens';
import { useBrowseData } from './use-browse-data';

export function BrowseScreen() {
  const [level, setLevel] = useState<JlptLevel>('N5');
  const [search, setSearch] = useState('');
  const { items, loading } = useBrowseData(level, search);

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: '단어, 가나, 한국어 검색',
            onChangeText: (e: { nativeEvent: { text: string } }) =>
              setSearch(e.nativeEvent.text),
            hideWhenScrolling: false,
            obscureBackground: true,
          },
        }}
      />
      <FlatList<VocabWithReview>
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <VocabRow vocab={item} showSeparator={index !== items.length - 1} />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Host style={styles.pickerHost}>
              <Picker
                selection={level}
                onSelectionChange={(value) => setLevel(value as JlptLevel)}
                modifiers={[pickerStyle('segmented')]}
              >
                <Text modifiers={[tag('N5')]}>N5</Text>
                <Text modifiers={[tag('N4')]}>N4</Text>
              </Picker>
            </Host>
            <View style={styles.metaRow}>
              <RNText style={styles.metaLabel}>
                {level} · {loading ? '…' : `${items.length}개`}
              </RNText>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.center}>
              <ActivityIndicator />
            </View>
          ) : (
            <View style={styles.empty}>
              <EmptyState
                title="검색 결과 없음"
                systemImage="magnifyingglass"
                description={search ? `"${search}"에 해당하는 단어가 없어요` : undefined}
              />
            </View>
          )
        }
        ListFooterComponent={items.length > 0 ? <View style={styles.footer} /> : null}
        style={styles.list}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: palette.surface as string,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
    backgroundColor: palette.surface as string,
    gap: spacing.md,
  },
  pickerHost: {
    height: 36,
  },
  metaRow: {
    paddingHorizontal: spacing.xs,
  },
  metaLabel: {
    ...typography.footnote,
    color: palette.inkFaint as string,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  footer: {
    height: spacing.xxl,
  },
  center: {
    paddingTop: spacing.xxl,
    alignItems: 'center',
  },
  empty: {
    paddingTop: spacing.xxl,
    alignItems: 'center',
  },
});
