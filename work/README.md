# Work directory

This directory contains generated analysis files and temporary media. Source media stays in `input/`.

## Layout

- `audio/`: extracted working audio.
- `checks/`: small review clips used to verify uncertain moments.
- `frames/`: sampled source frames for visual review.
- `logs/`: process log and command notes.
- `media/`: source media inspection output.
- `models/`: local model files used by transcription tools, if any are stored in the project.
- `plans/`: edit plans in Markdown and JSON.
- `scripts/`: repeatable transcription scripts.
- `transcripts/`: transcription outputs.

## Current Transcript Sources

- MLX transcript:
  - `work/transcripts/mlx/`

## Commands

Run Apple MLX Whisper:

```sh
bash work/scripts/transcribe-mlx.sh
```

## Current state

The current timeline is **v7**. `FinalVideo` renders it.

- Video: `work/base-cut-v7-audio-light-v1.mp4` (643.816s = 19314 frames @30fps)
- Subtitles: `work/subtitles/base-cut-v7-audio-light-v1-clean-v1.json`
- Overlays: `work/overlays/overlays-v3.json`
- Timeline map: `work/timeline-map.json` -> `work/timeline-map-v7.json`
- Proxy (Studio): `public/assets/base-cut-v7-proxy.mp4` (1662x1080@30)

`work/` is the single source of truth. `remotion/src/data/` symlinks to the subtitle and overlay
JSON, so editing them here hot-reloads in Remotion Studio with no copy step.

### Edit the v4 sources, not the v7 files

v7 is generated from v4 in one jump. Both shift scripts read **v4** and rewrite the whole
v4->v7 edit (opening trim + 5x speedup) every run — they are not a relay through v5/v6, and
those are deleted.

```
work/base-cut-v4-audio-light-v1.mp4                       <- the master v7 is cut from
work/subtitles/base-cut-v4-...-clean-v1.json              <- the only subtitle source
work/overlays/overlays-v1.json                            <- the only overlay source (v4 times)
        |  work/scripts/shift-subtitles-for-v7.py
        |  work/scripts/shift-overlays-for-v7.py
        v
work/subtitles/base-cut-v7-...-clean-v1.json
work/overlays/overlays-v3.json                            <- generated, edits here get overwritten
```

Those three v4 files are **live inputs, not history.** Do not delete them.

**A new overlay field carrying a time must be added to `TIME_KEYS` in
`shift-overlays-for-v7.py`.** It remaps by key name, and an unregistered key does not error —
it silently leaves v4 coordinates in the v7 file, off by 1.02s. This has bitten once already
(`namedAt`). Current set: `start`, `end`, `revealAt`, `highlightAt`, `appearAt`, `namedAt`,
`hideAt`.

## Timestamps

The user's review notes were written against the **v2** timeline; subtitle JSON quotes are **v4**. The current timeline is **v7**.
Never assume a bare `mm:ss` is on the current timeline.

- Converted notes: `work/plans/ui-notes.md`
- Converter: `python3 work/scripts/convert-note-time.py v2 08:23 09:12`
- Gaps for a clean cut: `python3 work/scripts/find-subtitle-gaps.py 440 545`
- Rules: `work/timeline-map.json`

## Rendering

Never pass `--browser-executable` — it forces `--concurrency=1` (measured 4.6x slower; see
`work/render-log.md` under "Render performance"). The npm scripts no longer carry it.

Checking layout is a still, not a render — ~2s vs ~16min:

```sh
npm run remotion:still -- out.png --frame=2200
npm run remotion:render                  # full v7, ~16 min
npx remotion render remotion/src/index.ts FinalVideo output/preview-vN.mp4 --frames=0-1799 --concurrency=8
```

`remotion:render` uses the proxy. For a full-resolution master add
`--props='{"asset":"assets/base-cut-v7-audio-light-v1-asset.mp4"}'`.

## Audio

The master sits at **-31.2 LUFS**, ~17 LU under the -14 LUFS short-form target — nothing in the
chain ever normalized it. Normalize the **finished render** with two-pass `loudnorm`, not the
master (the v4 master is a live input to the shift scripts). Command and measurements are in
`work/render-log.md` under "Audio level".
