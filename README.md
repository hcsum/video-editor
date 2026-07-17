# video-editor

An AI-assisted video editing pipeline for turning raw screen recordings into
finished talking-head / demo videos. Built to be driven by a coding agent
(Claude Code / opencode), but the workflow works by hand too.

The core idea: **FFmpeg does the destructive cutting, Remotion does the visual
composition**, and everything is verified on extracted stills before rendering.

## How it works

1. Inspect source media with `ffprobe`.
2. Generate a timestamped transcript (local `mlx_whisper`).
3. Analyze the transcript + key frames, write `work/edit-plan.md` / `edit-plan.json`.
4. Produce a clean **base cut** with FFmpeg (trim mistakes, pauses, speed-ups).
5. Compose subtitles, titles, callouts, zooms, intro/outro in **Remotion**.
6. Iterate on **stills first**, then render and re-check with `ffprobe` + frames.

The full agent playbook — safety rules, per-episode sequence, and the
hard-won failures that shaped it — lives in [`AGENTS.md`](./AGENTS.md).

## Layout

| Path | What |
|---|---|
| `input/` | Original source recordings (gitignored) |
| `work/` | Transcripts, edit plans, scripts, intermediate media |
| `remotion/` | Remotion project — reusable composition components |
| `public/assets/` | Render assets / proxy media (gitignored) |
| `output/` | Final exports and covers (gitignored) |

Media, renders, and dependencies are gitignored; only code and the workflow
knowledge are tracked. Folder structure is preserved via `.gitkeep`.

## Run

```bash
npm install
npm run remotion:studio      # preview compositions in the browser
npm run remotion:render      # render FinalVideo to output/
```

Requires `ffmpeg` / `ffprobe` on PATH. Transcription uses `mlx_whisper`
(Apple Silicon); swap in any Whisper backend if you're elsewhere.
