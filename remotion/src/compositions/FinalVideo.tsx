import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';
import {OverlayRenderer} from '../components/OverlayRenderer';
import {Subtitle, type SubtitleItem} from '../components/Subtitle';
import overlayData from '../data/overlays-v3.json';
import subtitleData from '../data/subtitles-v7.json';
import type {OverlayFile} from '../components/overlays/types';

const overlays = overlayData as OverlayFile;
const subtitles = (subtitleData as {subtitles: SubtitleItem[]}).subtitles;

export const PROXY_ASSET = 'assets/base-cut-v7-proxy.mp4';
export const FULL_ASSET = 'assets/base-cut-v7-audio-light-v1-asset.mp4';

export type FinalVideoProps = {
  /**
   * Defaults to the 1664x1080@30 proxy. The full 3024x1964@120 asset decodes
   * several times slower for no visible gain, since the video is displayed at
   * ~1663x1080 anyway.
   */
  asset: string;
};

export const FinalVideo: React.FC<FinalVideoProps> = ({asset}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0b0d0f'}}>
      <OffthreadVideo
        src={staticFile(asset)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          backgroundColor: '#0b0d0f',
        }}
      />
      <OverlayRenderer overlays={overlays.overlays} video={overlays.video} />
      <Subtitle subtitles={subtitles} />
    </AbsoluteFill>
  );
};
