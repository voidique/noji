import { Stack } from 'expo-router';

export default function BrowseLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerLargeTitleShadowVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: '단어' }} />
      <Stack.Screen name="[id]" options={{ headerLargeTitle: false }} />
    </Stack>
  );
}
