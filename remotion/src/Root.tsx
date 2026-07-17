import React from 'react';
import {Composition} from 'remotion';
import {Cover, coverDefaultProps} from './compositions/Cover';
import {DemoVideo} from './compositions/DemoVideo';
import {FinalVideo, PROXY_ASSET} from './compositions/FinalVideo';

export const Root: React.FC = () => {
  return (
    <>
      {/* work/base-cut-v7-audio-light-v1.mp4 is 643.816s -> 19314 frames @30fps. */}
      <Composition
        id="FinalVideo"
        component={FinalVideo}
        durationInFrames={19314}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{asset: PROXY_ASSET}}
      />
      {/* Bilibili cover. Still only — durationInFrames is a formality. */}
      <Composition
        id="Cover"
        component={Cover}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={coverDefaultProps}
      />
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
