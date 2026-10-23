// Values mirror the "Startline / Colour", "Layout" and "Typography" variable
// collections in the v3.1 Figma file. Change them there first, then here.

export const palette = {
  teal50: '#F0FAF8',
  teal100: '#D8F0ED',
  teal200: '#B9E6E2',
  teal300: '#8FD8D3',
  teal700: '#087F7A',
  teal800: '#066965',
  teal900: '#07514E',
  deep: '#052925',
  ink: '#173332',
  slate: '#607371',
  neutral100: '#E6EEEC',
  neutral300: '#C2D0CD',
  neutral500: '#8A9B98',
  mist: '#F3F7F6',
  sand100: '#F8F2E8',
  white: '#FFFFFF',
  amber100: '#FBEFD5',
  amber500: '#E5AE46',
  amber700: '#B57C18',
  green100: '#E4F4EA',
  green600: '#2E8A57',
  red100: '#FCE8E6',
  red600: '#C84F45',
  navActive: '#0D5C63',
  navInactive: '#91A7A8',
} as const;

export const color = {
  textPrimary: palette.ink,
  textSecondary: palette.slate,
  textBrand: palette.teal800,
  textInverse: palette.white,
  textDisabled: palette.neutral500,
  surface: palette.white,
  surfaceWarm: palette.sand100,
  surfaceSubtle: palette.mist,
  brandSubtle: palette.teal50,
  actionPrimary: palette.teal700,
  actionPrimaryPressed: palette.teal900,
  actionSecondary: palette.teal100,
  borderSubtle: palette.neutral100,
  borderDefault: palette.neutral300,
  borderBrand: palette.teal300,
  success: palette.green600,
  successSubtle: palette.green100,
  warning: palette.amber700,
  warningSubtle: palette.amber100,
  error: palette.red600,
  errorSubtle: palette.red100,
  accent: palette.amber500,
  heroScrim: palette.deep,
} as const;

export const space = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32 } as const;

export const radius = { sm: 8, md: 12, lg: 16, card: 20, xl: 24, sheet: 28, pill: 999 } as const;

export const control = { sm: 36, md: 44, lg: 52 } as const;

export const font = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

// Text styles from the Figma "Startline / ..." text styles.
export const type = {
  display: { fontFamily: font.bold, fontSize: 34, lineHeight: 40, letterSpacing: -0.6 },
  screenHeading: { fontFamily: font.bold, fontSize: 24, lineHeight: 30, letterSpacing: -0.3 },
  title: { fontFamily: font.semibold, fontSize: 18, lineHeight: 24 },
  cardTitle: { fontFamily: font.semibold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: font.regular, fontSize: 14, lineHeight: 20 },
  bodyLarge: { fontFamily: font.regular, fontSize: 16, lineHeight: 24 },
  button: { fontFamily: font.semibold, fontSize: 16, lineHeight: 20 },
  label: { fontFamily: font.semibold, fontSize: 12, lineHeight: 16 },
  caption: { fontFamily: font.regular, fontSize: 12, lineHeight: 16 },
} as const;

export const shadow = {
  card: {
    shadowColor: '#0B2B28',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  floating: {
    shadowColor: '#0B2B28',
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
} as const;
