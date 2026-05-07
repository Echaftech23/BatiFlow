/**
 * Brand colour palette — mirrors tailwind.config.js.
 * Use wherever Tailwind class names are not applicable
 * (gradient arrays, inline shadows, SVG fills, etc.).
 */
export const COLORS = {
  primary: '#F27427',
  onPrimary: '#FFFFFF',
  navy: '#1A2B48',
  /** Auth hero gradient — top stop */
  authNavy: '#113362',
  /** Auth hero gradient — bottom stop (85 % opacity) */
  authNavyFade: 'rgba(17, 51, 98, 0.85)',
  background: '#F8F9FB',
  surface: '#FFFFFF',
  border: '#E8EAEF',
  muted: '#EEF0F4',
  mutedForeground: '#6B7280',
  success: '#22C55E',
  warning: '#F59E0B',
  destructive: '#EF4444',
} as const;

/** Semantic layout spacing (maps to tailwind `spacing.screen-x` / `spacing.section-y`). */
export const SPACING = {
  /** Horizontal screen padding */
  screenX: 20,
  /** Vertical gap between major page sections */
  sectionY: 24,
} as const;

/** Semantic border-radius scale. */
export const RADIUS = {
  card: 20,
  button: 12,
  input: 12,
  fab: 28,
  pill: 9999,
} as const;

/** Numeric spacing scale (8 px base). */
export const spacing = {
  1: 8,
  2: 16,
  3: 24,
  4: 32,
  5: 40,
  6: 48,
} as const;

/** Numeric radius scale. */
export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
} as const;
