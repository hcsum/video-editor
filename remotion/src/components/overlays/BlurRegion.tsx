import React from 'react';
import {toPixels, type Rect} from '../../lib/videoRect';
import type {BlurOverlay} from './types';
import {useFade} from './useFade';

/**
 * Obscures private on-screen content. The rects deliberately stop short of the
 * webcam picture-in-picture in the top right, so the speaker stays sharp while
 * the editor pane behind him is blurred.
 */
export const BlurRegion: React.FC<{
  overlay: BlurOverlay;
  durationInFrames: number;
  videoRect: Rect;
}> = ({overlay, durationInFrames, videoRect}) => {
  const opacity = useFade(durationInFrames, 8);
  const blurPx = overlay.blurPx ?? 24;

  return (
    <>
      {overlay.rects.map((rect, index) => {
        const box = toPixels(rect, videoRect);

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: box.left,
              top: box.top,
              width: box.width,
              height: box.height,
              opacity,
              backdropFilter: `blur(${blurPx}px) saturate(0.7)`,
              WebkitBackdropFilter: `blur(${blurPx}px) saturate(0.7)`,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </>
  );
};
