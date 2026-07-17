import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {toPixels, type Rect} from '../../lib/videoRect';
import {accentAlpha, FONT_STACK, theme} from '../../lib/theme';
import type {SpeedOverlay} from './types';
import {useFade, useRise} from './useFade';

const FADE_FRAMES = 10;

const FastForwardIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={theme.accent}>
    <path d="M2 6.5v11a1 1 0 0 0 1.55.83L11 13.2v4.3a1 1 0 0 0 1.55.83l8.25-5.5a1 1 0 0 0 0-1.66l-8.25-5.5A1 1 0 0 0 11 6.5v4.3L3.55 5.67A1 1 0 0 0 2 6.5Z" />
  </svg>
);

export const SpeedBadge: React.FC<{
  overlay: SpeedOverlay;
  durationInFrames: number;
  videoRect: Rect;
}> = ({overlay, durationInFrames, videoRect}) => {
  const frame = useCurrentFrame();
  const opacity = useFade(durationInFrames, FADE_FRAMES);
  const y = useRise();
  const box = toPixels(overlay.anchor, videoRect);
  const scale = overlay.scale ?? 1;
  const centered = overlay.place === 'center';

  // Tops out where the fade-out begins, so the bar is visibly full for the few
  // frames it takes to disappear rather than being cut off around 98%.
  const progress = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - FADE_FRAMES)],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const badge = (
    <div
      style={{
        width: box.width / scale,
        transform: `translateY(${y}px) scale(${scale})`,
        transformOrigin: centered ? 'center center' : 'top center',
        opacity,
        padding: '22px 28px 24px',
        borderRadius: theme.radius,
        background: theme.surface,
        // The sped stretch cuts between a white browser page and the dark
        // editor, and the fill alone has no edge against the latter.
        border: `1px solid ${theme.borderStrong}`,
        boxShadow: theme.shadow,
        color: theme.text,
        fontFamily: FONT_STACK,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 18,
        }}
      >
        <FastForwardIcon size={30} />
        <div style={{fontSize: 34, lineHeight: 1, fontWeight: 760}}>
          {overlay.label}
        </div>
      </div>

      <div
        style={{
          height: 9,
          borderRadius: 5,
          background: 'rgba(255, 255, 255, 0.14)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            borderRadius: 5,
            background: theme.accent,
            boxShadow: `0 0 14px ${accentAlpha(0.55)}`,
          }}
        />
      </div>
    </div>
  );

  if (centered) {
    // Let flexbox find the centre: the badge's height is whatever its content
    // comes to, so nothing here needs to know it.
    return (
      <div
        style={{
          position: 'absolute',
          left: videoRect.left,
          top: videoRect.top,
          width: videoRect.width,
          height: videoRect.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {badge}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: box.left,
        top: box.top,
        pointerEvents: 'none',
      }}
    >
      {badge}
    </div>
  );
};
