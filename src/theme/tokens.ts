import { DynamicColorIOS, Platform } from 'react-native';

type DynamicColor = ReturnType<typeof DynamicColorIOS> | string;

const dyn = (light: string, dark: string): DynamicColor =>
  Platform.OS === 'ios' ? DynamicColorIOS({ light, dark }) : light;

export const palette = {
  ink: dyn('#111111', '#F2F2F2'),
  inkMuted: dyn('#3C3C43', '#EBEBF5'),
  inkFaint: dyn('#3C3C4399', '#EBEBF599'),
  surface: dyn('#FFFFFF', '#000000'),
  surfaceGrouped: dyn('#F2F2F7', '#000000'),
  surfaceElevated: dyn('#FFFFFF', '#1C1C1E'),
  separator: dyn('#3C3C4329', '#54545899'),
  separatorOpaque: dyn('#C6C6C8', '#38383A'),
  destructive: dyn('#1A1A1A', '#F2F2F2'),
  warning: dyn('#7A7A7A', '#A1A1A6'),
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const typography = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const, letterSpacing: 0.37 },
  title1: { fontSize: 28, fontWeight: '700' as const },
  title2: { fontSize: 22, fontWeight: '600' as const },
  title3: { fontSize: 20, fontWeight: '600' as const },
  headline: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 17, fontWeight: '400' as const },
  callout: { fontSize: 16, fontWeight: '400' as const },
  subhead: { fontSize: 15, fontWeight: '400' as const },
  footnote: { fontSize: 13, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  cardFace: { fontSize: 52, fontWeight: '600' as const, letterSpacing: -0.5 },
  cardReading: { fontSize: 20, fontWeight: '400' as const },
} as const;
