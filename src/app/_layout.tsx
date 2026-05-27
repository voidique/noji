import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DatabaseProvider } from '../db/database-provider';
import { palette } from '../theme/tokens';

const buildTheme = (scheme: 'light' | 'dark') => {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const ink = scheme === 'dark' ? '#F2F2F2' : '#111111';
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: ink,
      background: scheme === 'dark' ? '#000000' : '#FFFFFF',
      card: scheme === 'dark' ? '#000000' : '#FFFFFF',
      text: ink,
      border: scheme === 'dark' ? '#38383A' : '#C6C6C8',
    },
  };
};

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = buildTheme(scheme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={theme}>
        <DatabaseProvider>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerShadowVisible: false,
              headerTintColor: palette.ink as string,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="session"
              options={{
                presentation: 'fullScreenModal',
                gestureEnabled: false,
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="onboarding"
              options={{
                headerShown: false,
                gestureEnabled: false,
                presentation: 'fullScreenModal',
                animation: 'fade',
              }}
            />
            <Stack.Screen name="+not-found" options={{ title: '없음' }} />
          </Stack>
        </DatabaseProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
