import React from 'react';
import {AbsoluteFill} from 'remotion';

export const DemoVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#101418',
        color: 'white',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{fontSize: 72, fontWeight: 700}}>Remotion is ready</div>
    </AbsoluteFill>
  );
};
