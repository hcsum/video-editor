import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {FONT_STACK, theme} from '../lib/theme';

const RECOMMENDED_COVER_SAFE_X = 240;

/**
 * Bilibili cover. 16:9 at 1920x1080 — the platform's minimum is 1146x717 and it
 * downscales, so this renders above spec.
 * The text is centred inside the 4:3 recommended cover crop, which is 1440px
 * wide on this 1920x1080 canvas and starts at x=240.
 *
 * Deliberately follows the opening TitleCard's visual language (heavy headline,
 * amber subline over a darkened screen) so the cover and the video's first
 * seconds are recognisably the same thing. The type is centred and larger,
 * because a cover is read at ~300px wide in a feed and the video's left-weighted
 * layout was built to leave the editor visible.
 *
 * The frame is `public/assets/cover-frame-v4.png`, pulled from 7.27s of the
 * full-quality master. Regenerate with:
 *
 *   ffmpeg -ss 7.27 -i public/assets/base-cut-v7-audio-light-v1-asset.mp4 \
 *     -frames:v 1 public/assets/cover-frame-v4.png
 */

export type CoverProps = {
  headline: string;
  subline: string;
  frame: string;
};

export const coverDefaultProps: CoverProps = {
  headline: '使用AI Agent当个人助理',
  subline: '经验分享',
  frame: 'assets/cover-frame-v4.png',
};

export const Cover: React.FC<CoverProps> = ({
  headline,
  subline,
  frame,
}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0b0d0f'}}>
      {/*
        The master is 3024x1964 (1.54:1) and the video composition letterboxes it
        into 16:9 with pillar bars. A cover cannot afford the dead width, so this
        fills instead — the ~167px it crops vertically is the macOS menu bar and
        the editor status bar, neither of which the cover wants.
      */}
      <Img
        src={staticFile(frame)}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
      {/* Scrim, in three passes. A flat wash alone either leaves the file tree
          legible enough to read as clutter at thumbnail size, or is heavy enough
          to kill the webcam — the one thing on the frame worth keeping bright.
          So: a base wash, an extra pass weighted to the left where the tree is,
          and a centre vignette under the type. */}
      <AbsoluteFill style={{backgroundColor: 'rgba(14, 10, 7, 0)'}} />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(100deg, rgba(10, 7, 5, 0.1) 0%, rgba(10, 7, 5, 0.5) 34%, rgba(10, 7, 5, 0) 62%)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(72% 58% at 50% 54%, rgba(10, 7, 5, 0.62) 0%, rgba(10, 7, 5, 0) 76%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: RECOMMENDED_COVER_SAFE_X,
          width: 1920 - RECOMMENDED_COVER_SAFE_X * 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 48px',
          textAlign: 'center',
          color: theme.text,
          fontFamily: FONT_STACK,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            fontSize: 128,
            lineHeight: 1.1,
            fontWeight: 820,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            textShadow: '0 8px 40px rgba(0, 0, 0, 0.55)',
          }}
        >
          {headline}
        </div>
        <div
          style={{
            marginTop: 34,
            fontSize: 120,
            lineHeight: 1.3,
            fontWeight: 600,
            color: theme.accent,
          }}
        >
          {subline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
