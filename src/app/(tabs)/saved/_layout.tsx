import { Stack } from 'expo-router';

export default function SavedLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerLargeTitleShadowVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: '저장' }} />
    </Stack>
  );
}
