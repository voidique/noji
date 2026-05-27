import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerLargeTitleShadowVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: '설정' }} />
      <Stack.Screen name="about" options={{ title: '정보', headerLargeTitle: false }} />
    </Stack>
  );
}
