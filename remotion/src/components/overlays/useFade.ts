import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Fades an overlay in at its start and out at its end, using frames local to
 * the surrounding Sequence. Keeps every overlay on the same timing feel
 * without each component re-deriving it.
 */
export const useFade = (durationInFrames: number, fadeFrames = 10) => {
  const frame = useCurrentFrame();

  return interpolate(
    frame,
    [
      0,
      fadeFrames,
      Math.max(fadeFrames, durationInFrames - fadeFrames),
      durationInFrames,
    ],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
};

export const useRise = (distance = 12, frames = 14) => {
  const frame = useCurrentFrame();

  return interpolate(frame, [0, frames], [distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const useSecondsIntoVideo = (startAtSeconds: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return startAtSeconds + frame / fps;
};
