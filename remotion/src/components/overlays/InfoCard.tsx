import React from 'react';
import {toPixels, type Rect} from '../../lib/videoRect';
import {FONT_STACK, theme} from '../../lib/theme';
import type {CardOverlay} from './types';
import {useFade, useRise, useSecondsIntoVideo} from './useFade';

const surface: React.CSSProperties = {
  padding: '32px 36px 34px',
  borderRadius: theme.radius,
  // Opaque enough to stay readable over busy terminal text underneath.
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  boxShadow: theme.shadow,
  color: theme.text,
  fontFamily: FONT_STACK,
};

const Kicker: React.FC<{children: string}> = ({children}) => (
  <div
    style={{
      color: theme.accent,
      fontSize: 27,
      lineHeight: 1,
      fontWeight: 780,
      letterSpacing: 0.5,
      marginBottom: 16,
    }}
  >
    {children}
  </div>
);

export const InfoCard: React.FC<{
  overlay: CardOverlay;
  durationInFrames: number;
  videoRect: Rect;
}> = ({overlay, durationInFrames, videoRect}) => {
  const opacity = useFade(durationInFrames);
  const y = useRise();
  const now = useSecondsIntoVideo(overlay.start);
  const box = toPixels(overlay.anchor, videoRect);
  const scale = overlay.scale ?? 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: box.left,
        top: box.top,
        // Scaling from the top left, so `anchor.width` stays the footprint the
        // card actually occupies on screen whatever the scale is.
        width: box.width / scale,
        transform: `translateY(${y}px) scale(${scale})`,
        transformOrigin: 'top left',
        opacity,
        pointerEvents: 'none',
        ...surface,
      }}
    >
      {overlay.kicker ? <Kicker>{overlay.kicker}</Kicker> : null}

      <div style={{fontSize: 46, lineHeight: 1.2, fontWeight: 800}}>
        {overlay.title}
      </div>

      {overlay.lines?.length ? (
        <div style={{marginTop: 22}}>
          {overlay.lines.map((line) => (
            <div
              key={line}
              style={{
                fontSize: 32,
                lineHeight: 1.45,
                fontWeight: 560,
                color: theme.textMuted,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      ) : null}

      {overlay.groups?.length ? (
        <div style={{marginTop: 26, display: 'grid', gap: 24}}>
          {overlay.groups.map((group) => (
            <div key={group.label}>
              <div
                style={{
                  fontSize: 27,
                  lineHeight: 1.2,
                  fontWeight: 720,
                  color: theme.textDim,
                  marginBottom: 12,
                }}
              >
                {group.label}
              </div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
                {group.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: 30,
                      lineHeight: 1,
                      fontWeight: 640,
                      padding: '13px 18px',
                      borderRadius: theme.radiusSmall,
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
              {group.highlight ? (
                <div
                  style={{
                    marginTop: 13,
                    fontSize: 27,
                    lineHeight: 1.3,
                    fontWeight: 700,
                    color: theme.accent,
                  }}
                >
                  ← {group.highlight}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {overlay.steps?.length ? (
        <div style={{marginTop: 26, display: 'grid', gap: 22}}>
          {overlay.steps.map((step) => {
            const revealed = step.revealAt === undefined || now >= step.revealAt;

            return (
              <div
                key={step.index}
                style={{
                  display: 'flex',
                  gap: 18,
                  opacity: revealed ? 1 : 0,
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    background: theme.accent,
                    color: '#1a120c',
                    fontSize: 25,
                    fontWeight: 820,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step.index}
                </div>
                <div>
                  <div style={{fontSize: 35, lineHeight: 1.3, fontWeight: 700}}>
                    {step.text}
                  </div>
                  {step.hint ? (
                    <div
                      style={{
                        marginTop: 7,
                        fontSize: 27,
                        lineHeight: 1.38,
                        fontWeight: 540,
                        color: theme.textDim,
                      }}
                    >
                      {step.hint}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {overlay.footnote ? (
        <div
          style={{
            marginTop: 24,
            fontSize: 25,
            lineHeight: 1.38,
            fontWeight: 540,
            color: theme.textDim,
          }}
        >
          {overlay.footnote}
        </div>
      ) : null}
    </div>
  );
};
