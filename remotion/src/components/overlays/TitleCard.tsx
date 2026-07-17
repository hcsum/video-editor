import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT_STACK, theme} from '../../lib/theme';
import type {TitleOverlay} from './types';
import {useFade, useRise} from './useFade';

export const TitleCard: React.FC<{
  overlay: TitleOverlay;
  durationInFrames: number;
}> = ({overlay, durationInFrames}) => {
  const opacity = useFade(durationInFrames, 14);
  const y = useRise(18, 18);

  return (
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(90deg, rgba(16,11,8,0.94) 0%, rgba(16,11,8,0.84) 46%, rgba(16,11,8,0.1) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          paddingLeft: 150,
          paddingRight: 150,
          color: theme.text,
          fontFamily: FONT_STACK,
        }}
      >
        <div style={{transform: `translateY(${y}px)`, maxWidth: 1220}}>
          {overlay.kicker ? (
            <div
              style={{
                display: 'inline-block',
                fontSize: 30,
                lineHeight: 1,
                color: theme.accent,
                fontWeight: 780,
                letterSpacing: 1.2,
                marginBottom: 28,
                padding: '12px 18px',
                borderRadius: theme.radiusSmall,
                background: theme.accentWash,
                border: `1px solid ${theme.accentWashStrong}`,
              }}
            >
              {overlay.kicker}
            </div>
          ) : null}
          <div style={{fontSize: 92, lineHeight: 1.08, fontWeight: 820}}>
            {overlay.title}
          </div>
          {overlay.subtitle ? (
            <div
              style={{
                marginTop: 30,
                fontSize: 40,
                lineHeight: 1.32,
                fontWeight: 600,
                color: theme.textMuted,
              }}
            >
              {overlay.subtitle}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
