# Source media inspection

Source: `input/Screen Recording 2026-07-15 at 12.36.24.mov`

Inspected with: `ffprobe`

## Format

- Container: `mov,mp4,m4a,3gp,3g2,mj2`
- Duration: `1017.375500s` (`00:16:57.38`)
- Size: `2474877369` bytes
- Bitrate: `19460876` bps
- Creation time: `2026-07-15T04:36:35.000000Z`
- Author: `ReplayKitRecording`

## Video stream

- Codec: H.264 / AVC (`h264`)
- Profile: Main
- Resolution: `3024x1964`
- Pixel format: `yuv420p`
- Color: `bt709`
- Nominal frame rate: `120/1`
- Average frame rate: `23332200/610411` (~`38.22fps`)
- Duration: `1017.351667s`
- Bitrate: `19337451` bps
- Frames: `38887`

## Audio stream

- Codec: AAC LC (`aac`)
- Sample rate: `48000Hz`
- Channels: stereo
- Start time: `0.026417s`
- Duration: `1017.349083s`
- Bitrate: `117151` bps

## Notes

- Source is a screen recording with both audio and video tracks.
- Preserve source aspect ratio unless a target output format is requested.
- Use `work/source-media-info.json` for the full structured `ffprobe` output.
