export const colors = {
  primary: '#FFD166',
  success: '#06D6A0',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#8A8A8A',
  border: '#F0F0F0',
  pink: '#FFB3C6',
  lavender: '#C5B3FF',
  amber: '#FF8C00',
  amberTint: '#FFF3E0',
  red: '#FF3B30',
  mintTint: '#E8FFF8',
  yellowTint: '#FFF9E6',
  camera: '#111111',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
};

export const typography = {
  hero: {fontSize: 28, fontWeight: '800' as const},
  h1: {fontSize: 22, fontWeight: '800' as const},
  h2: {fontSize: 18, fontWeight: '700' as const},
  body: {fontSize: 14, fontWeight: '400' as const},
  label: {fontSize: 14, fontWeight: '700' as const},
  caption: {fontSize: 12, fontWeight: '400' as const},
  micro: {fontSize: 10, fontWeight: '400' as const},
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
};
