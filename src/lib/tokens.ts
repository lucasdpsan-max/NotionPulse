// Design System tokens for NotionPulse.
// Values mirror the Figma variables (read via the Figma Dev Mode MCP).

export const colors = {
  // Text
  textDefault: '#242320',
  textStrong: '#000000',
  textSoft: '#5f5b57',
  textSubtle: '#78736f',
  textInverse: '#ffffff',

  // Surface / background
  white: '#ffffff',
  bgLightest: '#fbfbfa',
  bgLighter: '#f7f7f5',
  bgLight: '#edeceb',
  bgDarkest: '#000000',

  // Stroke
  strokeLighter: '#edeceb',
  strokeLight: '#d8d6d3',
  strokeDark: '#5f5b57',
  strokeDarkest: '#000000',

  // Support — Purple (Pomodoro / Team)
  purpleLighter: '#fcfaff',
  purpleLight: '#eadbfa',
  purpleBase: '#7237ae',
  purpleDarker: '#391c57',
  purpleDarkest: '#1c0e2c',

  // Support — Blue (Voice)
  blueLighter: '#f7fbff',
  blueLight: '#e6f3fe',
  blueBase: '#005bab',
  blueDarker: '#00396b',
  blueDarkest: '#002a4f',

  // Support — Green (Calendar)
  greenLighter: '#f7fcf8',
  greenLight: '#d0f4d8',
  greenDark: '#0f6220',
  greenDarker: '#0a4216',
  greenDarkest: '#05210b',

  // Support — Orange
  orangeLight: '#ffdec4',
  orangeBase: '#dd5b00',

  // Support — Yellow
  yellowBase: '#e89d01',
} as const;

// Grouped for rendering in Storybook.
export const colorGroups: { name: string; tokens: { key: keyof typeof colors; label: string }[] }[] = [
  {
    name: 'Text',
    tokens: [
      { key: 'textDefault', label: 'text/default' },
      { key: 'textStrong', label: 'text/strong' },
      { key: 'textSoft', label: 'text/soft' },
      { key: 'textSubtle', label: 'text/subtle' },
      { key: 'textInverse', label: 'text/inverse' },
    ],
  },
  {
    name: 'Surface',
    tokens: [
      { key: 'white', label: 'base/white' },
      { key: 'bgLightest', label: 'bg/lightest' },
      { key: 'bgLighter', label: 'bg/lighter' },
      { key: 'bgLight', label: 'bg/light' },
      { key: 'bgDarkest', label: 'bg/darkest' },
    ],
  },
  {
    name: 'Stroke',
    tokens: [
      { key: 'strokeLighter', label: 'stroke/lighter' },
      { key: 'strokeLight', label: 'stroke/light' },
      { key: 'strokeDark', label: 'stroke/dark' },
      { key: 'strokeDarkest', label: 'stroke/darkest' },
    ],
  },
  {
    name: 'Purple',
    tokens: [
      { key: 'purpleLighter', label: 'purple/lighter' },
      { key: 'purpleLight', label: 'purple/light' },
      { key: 'purpleBase', label: 'purple/base' },
      { key: 'purpleDarker', label: 'purple/darker' },
      { key: 'purpleDarkest', label: 'purple/darkest' },
    ],
  },
  {
    name: 'Blue',
    tokens: [
      { key: 'blueLighter', label: 'blue/lighter' },
      { key: 'blueLight', label: 'blue/light' },
      { key: 'blueBase', label: 'blue/base' },
      { key: 'blueDarker', label: 'blue/darker' },
      { key: 'blueDarkest', label: 'blue/darkest' },
    ],
  },
  {
    name: 'Green',
    tokens: [
      { key: 'greenLighter', label: 'green/lighter' },
      { key: 'greenLight', label: 'green/light' },
      { key: 'greenDark', label: 'green/dark' },
      { key: 'greenDarker', label: 'green/darker' },
      { key: 'greenDarkest', label: 'green/darkest' },
    ],
  },
  {
    name: 'Accent',
    tokens: [
      { key: 'orangeLight', label: 'orange/light' },
      { key: 'orangeBase', label: 'orange/base' },
      { key: 'yellowBase', label: 'yellow/base' },
    ],
  },
];

export const typography = {
  fontHeading: 'var(--font-sans), Roboto, system-ui, sans-serif',
  fontBody: 'var(--font-sans), Roboto, system-ui, sans-serif',

  // Font sizes (px)
  size: {
    '2xs': '10px',
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    h5: '28px',
    h3: '40px',
    h2: '48px',
  },

  // Line heights (px)
  lineHeight: {
    '2xs': '16px',
    sm: '22px',
    base: '24px',
    lg: '27px',
    h6: '31px',
    h3: '50px',
  },

  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
  },

  letterSpacing: {
    normal: '0',
    tight: '-0.4px',
  },
} as const;

export const spacing = {
  '4': '4px',
  '6': '6px',
  '8': '8px',
  '10': '10px',
  '12': '12px',
  '14': '14px',
  '16': '16px',
  '24': '24px',
  '32': '32px',
  '40': '40px',
  '48': '48px',
} as const;

export const borderRadius = {
  '3xl': '16px',
  full: '9999px',
} as const;

export const shadows = {
  card: '0px 2px 6px 0px rgba(95,91,87,0.08)',
  blue: '0px 2px 2px 0px rgba(0,57,107,0.1), 0px 8px 12px 0px rgba(0,57,107,0.1)',
  green: '0px 2px 2px 0px rgba(10,66,22,0.1), 0px 8px 12px 0px rgba(10,66,22,0.1)',
  purple: '0px 2px 2px 0px rgba(57,28,87,0.1), 0px 8px 12px 0px rgba(57,28,87,0.1)',
} as const;

export const tokens = {
  colors,
  colorGroups,
  typography,
  spacing,
  borderRadius,
  shadows,
} as const;

export default tokens;
