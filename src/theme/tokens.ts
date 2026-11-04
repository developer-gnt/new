/**
 * HRSJM Admin Web Design System Tokens
 * Source of truth: HRSJM Design System (docs/design.md)
 */

export const DesignTokens = {
  // Navy scale
  navy950: '#011F39', // Deepest hero backgrounds, dark overlays
  navy900: '#06294D', // Primary navy background & header
  navy800: '#123F68', // Secondary navy surfaces & active drawer
  navy700: '#174A78', // Links or navy accents

  // Gold accent scale
  gold500: '#FAD465', // Main gold accent & primary buttons
  gold600: '#E9B82E', // Gold emphasis on dark surfaces
  gold700: '#C9971A', // Gold icons & borders
  goldSoft: '#FFF9E6', // Warm light gold surface tint

  // Editorial & Surface backgrounds
  ivory50: '#FAF7F0', // Main warm dashboard page background
  white: '#FFFFFF', // Cards, data tables, modals
  blue100: '#EDF2F7', // Pale blue panels & subtle badges
  blue200: '#DBE5EE', // Light borders & dividers

  // Text tokens
  textPrimary: '#0B2F52', // Main headings and titles
  textBody: '#34516D', // Body text, table cells, labels
  textMuted: '#718096', // Helper text, breadcrumbs, muted labels
  textOnDark: '#FFFFFF', // High-contrast text on navy surfaces

  // Semantic status tokens
  statusSuccess: '#16A34A',
  statusSuccessLight: '#EAF7EE',
  statusWarning: '#D97706',
  statusWarningLight: '#FEF6E7',
  statusDanger: '#DC2626',
  statusDangerLight: '#FDEEEF',
  statusInfo: '#174A78',
  statusInfoLight: '#EDF2F7',

  // Outlines & Borders
  border: '#DCE4EC',
  divider: '#DBE5EE',

  // Typography
  fonts: {
    display: '"Playfair Display", Georgia, serif',
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    quote: '"Caveat", cursive',
  },
} as const;

export type DesignTokenKey = keyof typeof DesignTokens;

