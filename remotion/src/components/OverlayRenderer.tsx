import React from 'react';
import {Sequence, useVideoConfig} from 'remotion';
import {getVideoRect} from '../lib/videoRect';
import {BlurRegion} from './overlays/BlurRegion';
import {CompareCards} from './overlays/CompareCards';
import {CorrectionNote} from './overlays/CorrectionNote';
import {InfoCard} from './overlays/InfoCard';
import {SpeedBadge} from './overlays/SpeedBadge';
import {TitleCard} from './overlays/TitleCard';
import type {Overlay} from './overlays/types';

/**
 * Turns the declarative overlay list in `work/overlays/*.json` into Sequences.
 * Timings live in the JSON on the edited timeline; nothing here is hardcoded,
 * so text and timing can be changed without touching components.
 */
export const OverlayRenderer: React.FC<{
  overlays: Overlay[];
  video: {width: number; height: number};
}> = ({overlays, video}) => {
  const {fps, width, height} = useVideoConfig();

  const videoRect = getVideoRect({
    canvasWidth: width,
    canvasHeight: height,
    videoWidth: video.width,
    videoHeight: video.height,
  });

  return (
    <>
      {overlays.map((overlay) => {
        const from = Math.round(overlay.start * fps);
        const durationInFrames = Math.max(
          1,
          Math.round(overlay.end * fps) - from
        );

        return (
          <Sequence
            key={overlay.id}
            name={overlay.id}
            from={from}
            durationInFrames={durationInFrames}
          >
            {overlay.type === 'title' ? (
              <TitleCard overlay={overlay} durationInFrames={durationInFrames} />
            ) : null}
            {overlay.type === 'card' ? (
              <InfoCard
                overlay={overlay}
                durationInFrames={durationInFrames}
                videoRect={videoRect}
              />
            ) : null}
            {overlay.type === 'compare' ? (
              <CompareCards
                overlay={overlay}
                durationInFrames={durationInFrames}
                videoRect={videoRect}
              />
            ) : null}
            {overlay.type === 'note' ? (
              <CorrectionNote
                overlay={overlay}
                durationInFrames={durationInFrames}
                videoRect={videoRect}
              />
            ) : null}
            {overlay.type === 'blur' ? (
              <BlurRegion
                overlay={overlay}
                durationInFrames={durationInFrames}
                videoRect={videoRect}
              />
            ) : null}
            {overlay.type === 'speed' ? (
              <SpeedBadge
                overlay={overlay}
                durationInFrames={durationInFrames}
                videoRect={videoRect}
              />
            ) : null}
          </Sequence>
        );
      })}
    </>
  );
};
