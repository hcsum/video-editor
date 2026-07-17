import React from 'react';
import {toPixels, type Rect} from '../../lib/videoRect';
import {FONT_STACK, theme} from '../../lib/theme';
import type {NoteOverlay} from './types';
import {useFade, useRise} from './useFade';

export const CorrectionNote: React.FC<{
  overlay: NoteOverlay;
  durationInFrames: number;
  videoRect: Rect;
}> = ({overlay, durationInFrames, videoRect}) => {
  const opacity = useFade(durationInFrames);
  const y = useRise();
  const box = toPixels(overlay.anchor, videoRect);
  const scale = overlay.scale ?? 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: box.left,
        top: box.top,
        width: box.width / scale,
        transform: `translateY(${y}px) scale(${scale})`,
        transformOrigin: 'top left',
        opacity,
        pointerEvents: 'none',
        display: 'flex',
        gap: 20,
        padding: '26px 30px 28px',
        borderRadius: theme.radius,
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderLeft: `5px solid ${theme.accent}`,
        boxShadow: theme.shadow,
        color: theme.text,
        fontFamily: FONT_STACK,
      }}
    >
      <div>
        <div
          style={{
            color: theme.accent,
            fontSize: 26,
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: 0.5,
            marginBottom: 14,
          }}
        >
          {overlay.label}
        </div>
        <div style={{fontSize: 35, lineHeight: 1.36, fontWeight: 660}}>
          {overlay.text}
        </div>
      </div>
    </div>
  );
};
