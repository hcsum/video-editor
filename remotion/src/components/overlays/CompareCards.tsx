import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {toPixels, type Rect} from '../../lib/videoRect';
import {accentAlpha, FONT_STACK, theme} from '../../lib/theme';
import type {CompareBox, CompareItem, CompareOverlay} from './types';
import {useFade, useSecondsIntoVideo} from './useFade';

/**
 * Two boxes side by side, one per category. Each box appears on its own cue and
 * can be highlighted later, so the graphic tracks what is being said instead of
 * dumping both categories on screen at once.
 */

const normalizeItems = (items: CompareBox['items']): CompareItem[] =>
  items.map((item) => (typeof item === 'string' ? {text: item} : item));

/**
 * Rises fast then decays, so naming a product reads as a flick of light across
 * its border rather than a state that sits there competing with the next name.
 */
const flareAt = (secondsSince: number) => {
  if (secondsSince < 0) {
    return 0;
  }
  const rise = Math.min(1, secondsSince / 0.12);
  const decay = Math.exp(-Math.max(0, secondsSince - 0.12) * 1.7);
  return rise * decay;
};

const Chip: React.FC<{item: CompareItem; now: number; lit: boolean}> = ({
  item,
  now,
  lit,
}) => {
  const named = item.namedAt !== undefined && now >= item.namedAt;
  const flare = item.namedAt === undefined ? 0 : flareAt(now - item.namedAt);

  // Settles lit rather than reverting, so the box accumulates a record of what
  // was covered — but only the flare goes full accent. A chip that stays as
  // loud as the moment it was named competes with whatever is being said next.
  const borderAlpha = named ? 0.4 + 0.6 * flare : lit ? 0.22 : 0.14;

  return (
    <span
      style={{
        fontSize: 36,
        lineHeight: 1,
        fontWeight: 680,
        padding: '17px 22px',
        borderRadius: theme.radiusSmall,
        background: named
          ? accentAlpha(0.09 + 0.16 * flare)
          : 'rgba(255, 255, 255, 0.08)',
        border: `2px solid ${
          named
            ? accentAlpha(borderAlpha)
            : `rgba(255, 235, 214, ${borderAlpha})`
        }`,
        boxShadow:
          flare > 0.01
            ? `0 0 ${26 * flare}px ${accentAlpha(0.5 * flare)}`
            : 'none',
        color: flare > 0.5 ? theme.accent : theme.text,
        transform: `scale(${1 + 0.05 * flare})`,
        display: 'inline-block',
      }}
    >
      {item.text}
    </span>
  );
};

export const CompareCards: React.FC<{
  overlay: CompareOverlay;
  durationInFrames: number;
  videoRect: Rect;
}> = ({overlay, durationInFrames, videoRect}) => {
  const opacity = useFade(durationInFrames, 12);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = useSecondsIntoVideo(overlay.start);
  const box = toPixels(overlay.anchor, videoRect);

  // Once one category is the point being made, the other recedes. Without this
  // the chips already lit in the other box keep pulling the eye away from it.
  const anyHighlighted = overlay.boxes.some(
    (item) => item.highlightAt !== undefined && now >= item.highlightAt
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: box.left,
        top: box.top,
        width: box.width,
        opacity,
        display: 'flex',
        gap: 40,
        alignItems: 'stretch',
        pointerEvents: 'none',
        fontFamily: FONT_STACK,
      }}
    >
      {overlay.boxes.map((item) => {
        const revealFrame = Math.round((item.revealAt - overlay.start) * fps);
        const entrance = spring({
          frame: frame - revealFrame,
          fps,
          config: {damping: 20, stiffness: 110},
        });
        const revealed = now >= item.revealAt;

        const highlighted =
          item.highlightAt !== undefined && now >= item.highlightAt;
        const highlightFrame =
          item.highlightAt === undefined
            ? 0
            : Math.round((item.highlightAt - overlay.start) * fps);
        const sinceHighlight = frame - highlightFrame;

        // A slow pulse rather than a blink: draws the eye without flicker.
        const pulse = highlighted
          ? 0.5 + 0.5 * Math.sin((sinceHighlight / fps) * Math.PI * 1.1)
          : 0;
        const pop = highlighted
          ? spring({
              frame: sinceHighlight,
              fps,
              config: {damping: 12, stiffness: 170},
            })
          : 0;

        const scale =
          (revealed ? 0.94 + 0.06 * entrance : 0.94) + 0.03 * pop * (1 - pop);

        const exit =
          item.hideAt === undefined
            ? 1
            : Math.max(0, Math.min(1, 1 - (now - item.hideAt) / 0.6));

        return (
          <div
            key={item.id}
            style={{
              flex: 1,
              opacity:
                (revealed ? entrance : 0) *
                (anyHighlighted && !highlighted ? 0.5 : 1) *
                exit,
              transform: `translateY(${(1 - entrance) * 16}px) scale(${scale})`,
              transformOrigin: 'center center',
              padding: '38px 40px 42px',
              borderRadius: theme.radius,
              background: highlighted ? theme.surfaceRaised : theme.surface,
              border: `2px solid ${
                highlighted ? accentAlpha(0.5 + 0.5 * pulse) : theme.border
              }`,
              boxShadow: highlighted
                ? `0 0 ${30 + 28 * pulse}px ${accentAlpha(
                    0.18 + 0.22 * pulse
                  )}, ${theme.shadow}`
                : theme.shadow,
              color: theme.text,
            }}
          >
            <div
              style={{
                fontSize: 32,
                lineHeight: 1,
                fontWeight: 780,
                letterSpacing: 0.5,
                color: highlighted ? theme.accent : theme.textDim,
                marginBottom: 18,
              }}
            >
              {item.label}
            </div>

            <div
              style={{
                fontSize: 52,
                lineHeight: 1.14,
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                fontSize: 30,
                lineHeight: 1.38,
                fontWeight: 560,
                color: theme.textMuted,
                marginBottom: 30,
              }}
            >
              {item.sublabel}
            </div>

            <div style={{display: 'flex', flexWrap: 'wrap', gap: 14}}>
              {normalizeItems(item.items).map((chip) => (
                <Chip key={chip.text} item={chip} now={now} lit={highlighted} />
              ))}
            </div>

            {item.note ? (
              <div
                style={{
                  marginTop: 28,
                  fontSize: 31,
                  lineHeight: 1.3,
                  fontWeight: 720,
                  color: highlighted ? theme.accent : theme.textDim,
                  opacity: highlighted ? 0.6 + 0.4 * pulse : 1,
                }}
              >
                {item.note}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
