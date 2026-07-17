# Edit plan v2

Source: `input/Screen Recording 2026-07-15 at 12.36.24.mov`

Basis:

- `work/media/source-media-info.json`
- `work/transcripts/mlx/source-audio.json`
- `work/frames/source-samples-v1/`

## Source summary

- Duration: `1017.375500s` (`00:16:57.38`)
- Resolution: `3024x1964`
- Video: H.264, average frame rate ~`38.22fps`
- Audio: AAC stereo; extracted working audio is `work/audio/source-audio.wav`

## Content structure

- `00:00-01:22`: Intro and framing: why people ask about AI agents, this is a personal workflow demo.
- `01:22-04:28`: Scope and prerequisites: command-line agents, model/tool choices, persistent context files.
- `04:29-06:42`: Core setup: give the agent a stable place to store context and browser/network capability.
- `06:43-11:44`: Demo 1: agent researches Xiaohongshu / US visa renewal and summarizes findings.
- `12:00-14:47`: Summary and implementation detail: two key abilities, `web access` skill, Brave vs Chrome separation.
- `14:38-16:29`: Demo 2: agent uses daily browser to research ergonomic standing desks.
- `16:31-16:53`: Outro and next-video framing.

## Approved base cut

Produce a minimal base cut first. Do not add subtitles or visual effects yet.

Confirmed cut:

- Remove `790.36-994.24` (`13:10.36-16:34.24`).
- Keep everything before `790.36`.
- Keep outro from `994.24` onward.

Reason:

- The argument has already reached a natural close at `790.36`: two capabilities are enough, and examples include research and financial-news gathering.
- The removed section reopens the topic with implementation details about `web access`, project directory, Brave vs Chrome, daily browser permissions, and a second standing-desk demo.
- Cutting directly to the outro keeps the video focused and avoids a second ending.

Estimated result:

- Original duration: ~`16:57.38`
- Removed duration: ~`03:23.88`
- Base cut duration: ~`13:33.50`

## Review items

- Transcript may still need review for tool names and mixed simplified/traditional Chinese.
- Final subtitles should be regenerated from the edited audio and converted/corrected to simplified Chinese.

## Proposed cut list

| Source time | Action | Reason |
| --- | --- | --- |
| `00:00.00-13:10.36` | keep | Main argument and Web Access demo reach a natural close. |
| `13:10.36-16:34.24` | remove | Implementation tangent and second demo after the argument has closed. |
| `16:34.24-16:57.38` | keep | Outro and next-video framing. |

## Next step

Generate `work/base-cut-v1.mp4` and create `work/timeline-map.json`.
