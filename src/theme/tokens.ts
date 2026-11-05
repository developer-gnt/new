/**
 * HRSJM Official Design System Tokens
 * Source of truth: docs/design.md
 */

export const DesignTokens = {
  // Navy scale (docs/design.md Section 2)
  navy950: '#011F39', // Deepest hero backgrounds, dark overlays
  navy900: '#06294D', // Primary navy background & strong dark surfaces
  navy800: '#123F68', // Secondary navy surfaces & supporting graphics
  navy700: '#174A78', // Links or navy accents

  // Blue scale
  blue100: '#EDF2F7', // Pale blue panels and subtle section backgrounds
  blue200: '#DBE5EE', // Light borders and dividers

  // Gold accent scale
  gold500: '#FAD465', // Main gold accent, navigation strip, prominent buttons
  gold600: '#E9B82E', // Gold emphasis on dark backgrounds and highlighted headlines
  gold700: '#C9971A', // Gold icons, fine rules, and decorative details
  goldSoft: '#FFF9E6', // Warm light gold surface tint

  // Editorial & Surface backgrounds
  ivory50: '#FAF7F0', // Main warm page background and editorial content sections
  white: '#FFFFFF', // Cards, navigation header, button text
  overlay: '#031B31', // Image overlays; use with transparency over photography

  // Text tokens
  textPrimary: '#0B2F52', // Main headings and primary text on light surfaces
  textBody: '#34516D', // Paragraphs and descriptive text
  textMuted: '#718096', // Secondary descriptions, breadcrumbs, helper text
  textOnDark: '#FFFFFF', // High-contrast text on navy surfaces

  // Outlines & Borders
  border: '#DCE4EC', // Card outlines, separators, input borders
  divider: '#DBE5EE', // Subtle section dividers

  // Status tokens (aligned with design system)
  statusSuccess: '#16A34A',
  statusSuccessLight: '#EAF7EE',
  statusWarning: '#D97706',
  statusWarningLight: '#FEF6E7',
  statusDanger: '#DC2626',
  statusDangerLight: '#FDEEEF',
  statusInfo: '#174A78',
  statusInfoLight: '#EDF2F7',

  // Typography (docs/design.md Section 3)
  fonts: {
    display: '"Playfair Display", Georgia, serif',
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    quote: '"Caveat", cursive',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },

  // 8px Spacing System (docs/design.md Section 4)
  spacing: {
    space1: '4px',
    space2: '8px',
    space3: '12px',
    space4: '16px',
    space5: '24px',
    space6: '32px',
    space7: '48px',
    space8: '64px',
    space9: '80px',
    space10: '96px',
  },

  // Radii & Layout (docs/design.md Section 8 & 13)
  radius: {
    card: '12px',
    button: '12px',
    badge: '9999px',
  },

  containerWidth: '1200px',
} as const;

export type DesignTokenKey = keyof typeof DesignTokens;
export default DesignTokens;
