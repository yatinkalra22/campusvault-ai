/**
 * White-label theme. Change these values to rebrand for any university.
 * All colors, spacing, and typography are derived from this config.
 */
export const theme = {
  // University branding
  brand: {
    name: 'Indiana Tech',
    appName: 'CampusVault AI',
    tagline: 'Snap. Place. Find.',
  },

  colors: {
    primary: '#6C63FF',
    primaryLight: '#9b9be4',
    primaryDark: '#4a42d4',
    secondary: '#FF6584',
    accent: '#00D9FF',

    background: '#0f0f1a',
    surface: '#1a1a2e',
    surfaceLight: '#1e1e30',
    surfaceAlt: '#2a2a45',
    card: '#16162a',

    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textMuted: '#888888',
    textDim: '#555555',

    success: '#4CAF50',
    warning: '#FFC107',
    error: '#FF5252',
    info: '#2196F3',

    border: '#2a2a45',
    borderLight: '#3a3a55',

    // Status colors
    available: '#4CAF50',
    borrowed: '#FFC107',
    overdue: '#FF5252',
    maintenance: '#2196F3',
    missing: '#9E9E9E',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },

  radius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    full: 9999,
  },

  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    title: 32,
  },

  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export type Theme = typeof theme;
