/**
 * The source recording is 3024x1964 (aspect ~1.54) but renders into a 16:9
 * canvas with `objectFit: contain`, so it is pillarboxed. Overlay positions in
 * `work/overlays/*.json` are fractions of the *displayed video rectangle*, not
 * of the canvas — otherwise every anchor would need redoing at another
 * resolution or aspect ratio.
 */

export type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type FractionalRect = {
  x: number;
  y: number;
  width: number;
  height?: number;
};

export const getVideoRect = ({
  canvasWidth,
  canvasHeight,
  videoWidth,
  videoHeight,
}: {
  canvasWidth: number;
  canvasHeight: number;
  videoWidth: number;
  videoHeight: number;
}): Rect => {
  const scale = Math.min(canvasWidth / videoWidth, canvasHeight / videoHeight);
  const width = videoWidth * scale;
  const height = videoHeight * scale;

  return {
    left: (canvasWidth - width) / 2,
    top: (canvasHeight - height) / 2,
    width,
    height,
  };
};

export const toPixels = (fraction: FractionalRect, video: Rect) => ({
  left: video.left + fraction.x * video.width,
  top: video.top + fraction.y * video.height,
  width: fraction.width * video.width,
  height:
    fraction.height === undefined ? undefined : fraction.height * video.height,
});
