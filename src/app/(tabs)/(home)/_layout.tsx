import { Stack } from 'expo-router';

export default function TodayLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerLargeTitleShadowVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: '오늘' }} />
    </Stack>
  );
}
