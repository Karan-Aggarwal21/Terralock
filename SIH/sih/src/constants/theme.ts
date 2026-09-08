/**
 * TERRA LOCK Centralized Design Tokens
 * Single source of truth for the Light Premium Enterprise / Government Infrastructure visual language.
 */

export const THEME_TOKENS = {
  colors: {
    // Canvas & Surfaces
    background: '#F7F8F6', // Neutral canvas background
    surface: '#FFFFFF', // Clean white card surface
    surfaceMuted: '#f4f7f5', // soft surface
    surfaceHover: '#edf4ef', // hover highlight surface

    // Primary Accents (Terra Lock Primary)
    deepNavy: '#101827',
    darkBlueGray: '#334155',
    primary: '#244d3b', // deep muted forest green
    primaryHover: '#1b3d2e', // dark pine active/hover
    primarySubtle: '#edf7f1', // light forest tint for tags/pills
    primaryBorder: '#c6e6d2', // delicate green border

    // Secondary & Sage Tones
    sage: '#527568',
    sageLight: '#e8f2ec',
    sageBorder: '#d4e5dc',

    // Typography (Terra Lock Palette)
    text: '#101827', // Deep navy primary heading
    textBody: '#374151', // Dark gray body text
    textMuted: '#64748B', // Neutral muted text
    textSubtle: '#94a3b8', // Low-emphasis metadata

    // Borders & Dividers
    border: '#E2E7E4', // Subtle 1px border
    borderSubtle: '#edf2ee', // Hairline table dividers
    borderFocus: '#244d3b', // Forest green focus ring

    // Standard 4-Tier Risk Telemetry
    risk: {
      low: {
        color: '#2d7a4f',
        bg: '#edf7f1',
        border: '#c6e6d2',
        text: '#1e5637',
        label: 'LOW',
      },
      moderate: {
        color: '#d97706',
        bg: '#fef9ee',
        border: '#fde68a',
        text: '#92400e',
        label: 'MODERATE',
      },
      high: {
        color: '#dc2626',
        bg: '#fef2f2',
        border: '#fecaca',
        text: '#991b1b',
        label: 'HIGH',
      },
      critical: {
        color: '#991b1b',
        bg: '#fef2f2',
        border: '#fecaca',
        text: '#7f1d1d',
        label: 'CRITICAL',
      },
    },
  },

  // Elevation & Shadows
  shadows: {
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
    cardHover: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
    popover: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
  },

  // Radii
  radius: {
    sm: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    card: '0.875rem', // 14px
    full: '9999px',
  },

  // Standard Spacing Units
  spacing: {
    cardPadding: '1.5rem', // 24px
    sectionGap: '1.5rem', // 24px
    widgetPadding: '1.25rem', // 20px
  },

  // Typography Stacks
  typography: {
    fontSans: '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
} as const;

export default THEME_TOKENS;
