/**
 * Overlay design tokens.
 *
 * The palette is deliberately *warm*. The recording is a cool blue-grey VS Code
 * window, and this UI used to be dark blue-grey with a light-blue accent
 * (`#9cc7ff`) — near enough to the editor's own chrome that overlays read as
 * part of the app being demoed instead of as commentary on top of it. Amber on
 * warm near-black separates by colour temperature, which survives both the dark
 * editor and the white browser pages the video cuts between.
 *
 * Sizes assume a 1920x1080 canvas and are tuned for phone playback, where the
 * video ends up a few centimetres wide — hence type that looks slightly too big
 * on a desktop preview.
 */

export const FONT_STACK =
  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif';

export const theme = {
  /** Amber. The single accent — use it for emphasis, never for body text. */
  accent: '#ffb545',
  accentRgb: '255, 181, 69',
  accentWash: 'rgba(255, 181, 69, 0.16)',
  accentWashStrong: 'rgba(255, 181, 69, 0.24)',

  /** Warm near-black. Sits on both the dark editor and white pages. */
  surface: 'rgba(25, 18, 15, 0.95)',
  surfaceRaised: 'rgba(41, 30, 24, 0.95)',

  border: 'rgba(255, 235, 214, 0.15)',
  borderStrong: 'rgba(255, 235, 214, 0.26)',

  text: '#fdf7f0',
  textMuted: 'rgba(253, 247, 240, 0.66)',
  textDim: 'rgba(253, 247, 240, 0.44)',

  shadow: '0 22px 58px rgba(0, 0, 0, 0.46)',
  shadowSoft: '0 14px 36px rgba(0, 0, 0, 0.36)',

  radius: 16,
  radiusSmall: 11,
} as const;

/** `rgba()` string for the accent at an arbitrary alpha. */
export const accentAlpha = (alpha: number) =>
  `rgba(${theme.accentRgb}, ${alpha})`;
