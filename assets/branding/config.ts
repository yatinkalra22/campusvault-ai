/**
 * White-label branding configuration.
 * Replace values here to rebrand for any campus/university.
 */
export const branding = {
  // University identity
  name: 'Indiana Tech',
  appName: 'CampusVault AI',
  tagline: 'Snap. Place. Find.',
  domain: 'indianatech.edu',
  supportEmail: 'support@campusvault.dev',

  // Bundle identifiers
  ios: { bundleId: 'edu.indianatech.campusvault' },
  android: { packageName: 'edu.indianatech.campusvault' },

  // Theme colors
  colors: {
    primary: '#6C63FF',
    primaryLight: '#9b9be4',
    secondary: '#FF6584',
    background: '#0f0f1a',
    surface: '#1a1a2e',
    surfaceLight: '#1e1e30',
    surfaceAlt: '#2a2a45',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textMuted: '#666666',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#FF5252',
    border: '#2a2a45',
  },

  // Typography
  fonts: {
    heading: 'System',
    body: 'System',
  },
} as const;

export type BrandingConfig = typeof branding;
