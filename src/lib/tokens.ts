// Design System Tokens for NotionPulse

export const colors = {
  // Primary
  primaryNavy: '#0D2137',
  accentYellow: '#F5A623',

  // Backgrounds
  lightBlueBg: '#E8F0F7',
  cream: '#F5F5F0',
  white: '#FFFFFF',

  // Purple scale
  purple: '#8B5CF6',
  purpleDark: '#7C3AED',
  purpleMedium: '#C4B5FD',
  purpleLight: '#EDE9FE',

  // Neutrals
  gray100: '#F5F5F5',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',

  // Text
  textPrimary: '#0D2137',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export const typography = {
  // Font families
  fontSans: 'var(--font-geist-sans), system-ui, sans-serif',
  fontMono: 'var(--font-geist-mono), monospace',

  // Font sizes
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px

  // Font weights
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',

  // Line heights
  lineHeightTight: '1.25',
  lineHeightSnug: '1.375',
  lineHeightNormal: '1.5',
  lineHeightRelaxed: '1.625',
  lineHeightLoose: '2',

  // Letter spacing
  trackingTighter: '-0.05em',
  trackingTight: '-0.025em',
  trackingNormal: '0em',
  trackingWide: '0.025em',
  trackingWider: '0.05em',
  trackingWidest: '0.1em',
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  card: '0 2px 12px 0 rgb(0 0 0 / 0.08)',
} as const;

export const tokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} as const;

export default tokens;
