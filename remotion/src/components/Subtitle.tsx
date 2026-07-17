import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT_STACK, theme} from '../lib/theme';

export type SubtitleItem = {
  start: number;
  end: number;
  text: string;
};

type SubtitleProps = {
  subtitles: SubtitleItem[];
  startAtSeconds?: number;
};

/**
 * Short lines, sized for a phone. The old splitter only ever produced two
 * lines, which overflows once the type grows — the transcript has segments up
 * to ~56 characters, since Whisper sometimes merges several sentences into one.
 */
const MAX_CHARS_PER_LINE = 20;

const BREAK_CHARS = new Set(['，', '。', '！', '？', '、', '；', '：']);

const wrapText = (text: string): string[] => {
  // Clause-sized chunks, punctuation kept on the clause it closes.
  const segments: string[] = [];
  let chunk = '';
  for (const char of text) {
    chunk += char;
    if (BREAK_CHARS.has(char)) {
      segments.push(chunk);
      chunk = '';
    }
  }
  if (chunk) {
    segments.push(chunk);
  }

  const lines: string[] = [];
  let line = '';

  const flush = () => {
    if (line.trim()) {
      lines.push(line.trim());
    }
    line = '';
  };

  for (const segment of segments) {
    if (line && line.length + segment.length > MAX_CHARS_PER_LINE) {
      flush();
    }

    if (segment.length > MAX_CHARS_PER_LINE) {
      // Nothing to break on: fall back to a hard wrap.
      let rest = line + segment;
      line = '';
      while (rest.length > MAX_CHARS_PER_LINE) {
        lines.push(rest.slice(0, MAX_CHARS_PER_LINE));
        rest = rest.slice(MAX_CHARS_PER_LINE);
      }
      line = rest;
    } else {
      line += segment;
    }
  }
  flush();

  return lines;
};

export const Subtitle: React.FC<SubtitleProps> = ({
  subtitles,
  startAtSeconds = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentTime = frame / fps + startAtSeconds;

  const activeSubtitle = subtitles.find(
    (subtitle) => currentTime >= subtitle.start && currentTime < subtitle.end
  );

  if (!activeSubtitle) {
    return null;
  }

  const lines = wrapText(activeSubtitle.text);

  return (
    <div
      style={{
        position: 'absolute',
        left: 100,
        right: 100,
        bottom: 84,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          padding: '22px 38px 26px',
          borderRadius: theme.radius,
          background: 'rgba(18, 13, 10, 0.84)',
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadowSoft,
          color: theme.text,
          fontFamily: FONT_STACK,
          fontSize: 60,
          lineHeight: 1.3,
          fontWeight: 700,
          textAlign: 'center',
          textShadow: '0 2px 6px rgba(0, 0, 0, 0.6)',
        }}
      >
        {lines.map((line, index) => (
          <div key={`${index}-${line}`}>{line}</div>
        ))}
      </div>
    </div>
  );
};
