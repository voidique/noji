import { useColorScheme } from 'react-native';
import { palette } from './tokens';

export type ThemeMode = 'light' | 'dark';

export function useThemeMode(): ThemeMode {
  const scheme = useColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}

export function usePalette() {
  return palette;
}
