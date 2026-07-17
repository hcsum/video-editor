# Render log

## base-cut-v1

Date: `2026-07-15 22:47:29 CST`

Input:

- `input/Screen Recording 2026-07-15 at 12.36.24.mov`

Output:

- `work/base-cut-v1.mp4`

Command:

```sh
ffmpeg -hide_banner -y -i "input/Screen Recording 2026-07-15 at 12.36.24.mov" -filter_complex "[0:v]trim=start=0:end=790.36,setpts=PTS-STARTPTS[v0];[0:a]atrim=start=0:end=790.36,asetpts=PTS-STARTPTS[a0];[0:v]trim=start=994.24:end=1017.3755,setpts=PTS-STARTPTS[v1];[0:a]atrim=start=994.24:end=1017.3755,asetpts=PTS-STARTPTS[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart "work/base-cut-v1.mp4"
```

Cut:

- Removed source `790.36-994.24` (`203.88s`).
- Retained source `0-790.36`.
- Retained source `994.24-1017.3755`.

Verification:

- Duration: `813.491s` (`00:13:33.49`)
- Resolution: `3024x1964`
- Video: H.264, `yuv420p`, average frame rate ~`37.32fps`
- Audio: AAC LC, stereo, `48000Hz`, ~`160kbps`
- Timeline map: `work/timeline-map.json`
- Preview frames: `work/preview-frames/base-cut-v1/`

## base-cut-v2

Date: `2026-07-15 23:00:00 CST`

Input:

- `input/Screen Recording 2026-07-15 at 12.36.24.mov`

Output:

- `work/base-cut-v2.mp4`

Command:

```sh
ffmpeg -hide_banner -y -i "input/Screen Recording 2026-07-15 at 12.36.24.mov" -filter_complex "[0:v]trim=start=0:end=92.12,setpts=PTS-STARTPTS[v0];[0:a]atrim=start=0:end=92.12,asetpts=PTS-STARTPTS[a0];[0:v]trim=start=123.02:end=766.02,setpts=PTS-STARTPTS[v1];[0:a]atrim=start=123.02:end=766.02,asetpts=PTS-STARTPTS[a1];[0:v]trim=start=994.24:end=1017.3755,setpts=PTS-STARTPTS[v2];[0:a]atrim=start=994.24:end=1017.3755,asetpts=PTS-STARTPTS[a2];[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart "work/base-cut-v2.mp4"
```

Cuts:

- Removed source `92.12-123.02` (`30.90s`).
- Removed source `766.02-790.36` (`24.34s`).
- Removed source `790.36-994.24` (`203.88s`).

Retained:

- Source `0-92.12` -> edited `0-92.12`.
- Source `123.02-766.02` -> edited `92.12-735.12`.
- Source `994.24-1017.3755` -> edited `735.12-758.2555`.

Verification:

- Duration from render output: `00:12:38.22`
- Timeline map: `work/timeline-map.json`

## base-cut-v2-audio-light-v1

Date: `2026-07-16 16:16:00 CST`

Input:

- `work/base-cut-v2.mp4`

Output:

- `work/base-cut-v2-audio-light-v1.mp4`

Command:

```sh
ffmpeg -hide_banner -y -i work/base-cut-v2.mp4 -map 0:v:0 -map 0:a:0 -c:v copy -af "highpass=f=85" -c:a aac -b:a 192k -movflags +faststart work/base-cut-v2-audio-light-v1.mp4
```

Audio processing:

- High-pass filter: `85Hz`
- Audio codec: AAC LC
- Audio bitrate: `192k`
- Video stream copied without re-encoding.

Verification:

- Duration: `758.293s` (`00:12:38.29`)
- Resolution: `3024x1964`
- Video: H.264 copied from `work/base-cut-v2.mp4`
- Audio: AAC LC, stereo, `48000Hz`, ~`193kbps`
- Spot-check clip: `work/audio-clean-previews/v2/full-light-check-390s-40s.m4a`

## preview-v1 subtitles

Date: `2026-07-16 CST`

Input:

- `work/base-cut-v2-audio-light-v1.mp4`
- `work/subtitles/base-cut-v2-audio-light-v1-clean-v1.json`

Output:

- `output/preview-v1.mp4`

Remotion composition:

- `SubtitlePreview`
- Duration: `60s`
- Resolution: `1920x1080`
- Frame rate: `30fps`

Command:

```sh
npx remotion render remotion/src/index.ts SubtitlePreview output/preview-v1.mp4 --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --codec=h264 --crf=23 --pixel-format=yuv420p --concurrency=1
```

Verification:

- Duration: `60.053s`
- Video: H.264, `1920x1080`, `30fps`
- Audio: AAC LC, stereo, `48000Hz`
- Preview frames: `work/preview-frames/preview-v1/`

Review notes:

- Subtitles are readable and synchronized for the sampled first-minute frames.
- Initial style was too large and too close to the bottom UI for a product demo.
- Default Remotion subtitle style was adjusted after this render to use smaller text and a higher bottom offset.

## preview-v2 subtitles

Date: `2026-07-16 CST`

Input:

- `work/base-cut-v2-audio-light-v1.mp4`
- `work/subtitles/base-cut-v2-audio-light-v1-clean-v1.json`

Output:

- `output/preview-v2.mp4`

Remotion composition:

- `SubtitlePreview`
- Duration: `60s`
- Resolution: `1920x1080`
- Frame rate: `30fps`

Command:

```sh
npx remotion render remotion/src/index.ts SubtitlePreview output/preview-v2.mp4 --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --codec=h264 --crf=23 --pixel-format=yuv420p --concurrency=1
```

Verification:

- Duration: `60.053s`
- Video: H.264, `1920x1080`, `30fps`
- Audio: AAC LC, stereo, `48000Hz`
- Preview frames: `work/preview-frames/preview-v2/`

Review notes:

- Updated subtitle data from the manually corrected JSON.
- Subtitle style is smaller and higher than `preview-v1`.
- Sampled frames show readable subtitles without covering key interface controls.

## preview-v3 visual style sample

Date: `2026-07-16 CST`

Input:

- `work/base-cut-v2-audio-light-v1.mp4`
- `work/subtitles/base-cut-v2-audio-light-v1-clean-v1.json`

Output:

- `output/preview-v3.mp4`

Remotion composition:

- `VisualPreview`
- Duration: `75s`
- Resolution: `1920x1080`
- Frame rate: `30fps`

Command:

```sh
npx remotion render remotion/src/index.ts VisualPreview output/preview-v3.mp4 --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --codec=h264 --crf=23 --pixel-format=yuv420p --concurrency=1
```

Verification:

- Duration: `75.051s`
- Video: H.264, `1920x1080`, `30fps`
- Audio: AAC LC, stereo, `48000Hz`
- Preview frames: `work/preview-frames/preview-v3/`

Review notes:

- Title card direction is clean and understated.
- Callout style is usable and does not collide with subtitles.
- Section label in the sample overlaps the VS Code Explorer heading and should be repositioned in the next pass.
- The sample zoom crops the top edge too tightly; reduce zoom or remove vertical translation in the next pass.

## base-cut-v4 audio-light trim

Date: `2026-07-16 CST`

Input:

- `work/base-cut-v2-audio-light-v1.mp4`

Output:

- `work/base-cut-v4-audio-light-v1.mp4`

Reason:

- User requested removing the opening and starting directly around `00:43`.
- Exact `43.000s` left a residual subtitle/audio tail, so the current version starts at `43.640s`, where the sentence begins cleanly.

Command:

```sh
ffmpeg -hide_banner -y -ss 43.64 -i work/base-cut-v2-audio-light-v1.mp4 -map 0:v:0 -map 0:a:0 -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart work/base-cut-v4-audio-light-v1.mp4
```

Verification:

- Duration: `714.653s`
- Video: H.264, `3024x1964`, yuv420p, BT.709
- Audio: AAC LC, stereo, `48000Hz`
- Timeline map: `work/timeline-map.json`
- Previous 43.000s map backup: `work/timeline-map-v3-start-43.json`
- Preview frames: `work/preview-frames/base-cut-v4/`

Subtitle updates:

- `work/subtitles/base-cut-v4-audio-light-v1-clean-v1.json`
- `work/subtitles/base-cut-v4-audio-light-v1-clean-v1.srt`
- `work/subtitles/base-cut-v4-audio-light-v1-clean-v1.vtt`
- First subtitle after trim: `其实我真正用AI Agent也是从OpenClaw（龙虾）`

Remotion updates:

- `SubtitlePreview` now reads `base-cut-v4-audio-light-v1-clean-v1.json`.
- Remotion static asset now points to `assets/base-cut-v4-audio-light-v1-asset.mp4`.
- `SubtitlePreview` duration set to `21440` frames at `30fps`.

## preview-v4 v4 subtitle baseline

Date: `2026-07-16 CST`

Input:

- `work/base-cut-v4-audio-light-v1.mp4`
- `work/subtitles/base-cut-v4-audio-light-v1-clean-v1.json`

Output:

- `output/preview-v4.mp4`

Remotion composition:

- `SubtitlePreview`
- Frames: `0-1799`
- Duration: `60s`
- Resolution: `1920x1080`
- Frame rate: `30fps`

Command:

```sh
npx remotion render remotion/src/index.ts SubtitlePreview output/preview-v4.mp4 --frames=0-1799 --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --codec=h264 --crf=23 --pixel-format=yuv420p --concurrency=1
```

Verification:

- Duration: `60.053s`
- Video: H.264, `1920x1080`, `30fps`
- Audio: AAC LC, stereo, `48000Hz`
- Preview frames: `work/preview-frames/preview-v4/`

Review notes:

- Starts directly on the screen recording, without the previous black title card.
- Subtitle timing starts with the clean sentence beginning at edited timeline `0.000s`.
- Sampled frames show subtitle placement inside the safe area.

## base-cut-v5 (2x speedup of the waiting section)

Date: `2026-07-16 CST`

Input:

- `work/base-cut-v4-audio-light-v1.mp4`

Output:

- `work/base-cut-v5-audio-light-v1.mp4`

Reason:

- User note: "08:23-09:12 这里可以加速，用2倍速或者更快".
- Those note timestamps are on the **v2** timeline (`v4 = note - 43.64`), so the range resolves to v4 `459.36-508.36`.
- The requested end (`508.36`) falls inside a single 28s subtitle (`496.88-524.88`, "他一直在看新文章"), which cannot be cut cleanly.
- Sped range was therefore trimmed to `459.36-496.88` — the pure waiting stretch, with subtitle gaps on both sides. The 28s narration line after it stays at 1x and is still a candidate for speedup if the user wants.

Command:

```sh
ffmpeg -hide_banner -y -i work/base-cut-v4-audio-light-v1.mp4 -filter_complex "\
[0:v]trim=start=0:end=459.36,setpts=PTS-STARTPTS[v0];[0:a]atrim=start=0:end=459.36,asetpts=PTS-STARTPTS[a0];\
[0:v]trim=start=459.36:end=496.88,setpts=0.5*(PTS-STARTPTS)[v1];[0:a]atrim=start=459.36:end=496.88,asetpts=PTS-STARTPTS,atempo=2.0[a1];\
[0:v]trim=start=496.88,setpts=PTS-STARTPTS[v2];[0:a]atrim=start=496.88,asetpts=PTS-STARTPTS[a2];\
[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]" -map "[v]" -map "[a]" \
-c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart \
work/base-cut-v5-audio-light-v1.mp4
```

Verification:

- Duration: `695.905s` (was `714.653s`, saved `18.76s`)
- Resolution: `3024x1964`, audio AAC LC stereo `48000Hz`
- Timeline map: `work/timeline-map-v5.json`

Subtitle updates:

- Remapped with `work/scripts/shift-subtitles-for-v5.py` (220 entries, last end `694.04s`).
- `work/subtitles/base-cut-v5-audio-light-v1-clean-v1.{json,srt,vtt}`

## Overlay UI system

Date: `2026-07-16 CST`

All overlay content and timing live in `work/overlays/overlays-v1.json` on the v5 timeline.
`remotion/src/data/` symlinks to it and to the v5 subtitles, so `work/` is the single source
of truth and Remotion Studio hot-reloads edits — no copy step, no drift.

Anchors are fractions of the *displayed video rectangle*, not the 1920x1080 canvas. The source
is 3024x1964 (aspect ~1.54) inside a 16:9 canvas, so it is pillarboxed; canvas fractions would
be wrong. See `remotion/src/lib/videoRect.ts`.

Overlays (v5 timeline):

| id | time | source note (v2 timeline) |
|---|---|---|
| `title` | 0.4-6.2 | 00:00 title |
| `agent-types` | 67.88-83.98 | 两类 agent，带 GUI / 不带 GUI (TUI) |
| `correction-model` | 190.36-196.8 | 03:54-03:58 更正一下 |
| `stable-folder` | 203.36-209.2 | 04:07-04:10 固定文件夹 |
| `blur-user-md` | 225.36-252.36 | 04:29-04:56 模糊 user.md |
| `web-access` | 306.36-315.2 | 05:50-05:54 联网能力 |
| `summary` | 645.52-673.0 | 11:50 总结 |

Review notes:

- The blur has three rects. Two cover the editor pane while stopping short of the webcam PIP in
  the top right, so the speaker stays sharp. The third covers the bottom-left OUTLINE panel,
  which lists user.md's section headings — including `## Investment portfolio of the user` — and
  leaks the same private content the user asked to hide.
- Cards sit in the empty editor area (left-of-centre) and clear both the webcam and the subtitles.

## Render performance

Date: `2026-07-16 CST`

Measured A/B on the same 181 frames (`--frames=2020-2200`):

| config | time |
|---|---|
| `--browser-executable=<Google Chrome>` + `--concurrency=1` + 3024x1964@120fps asset | `38.6s` |
| bundled headless shell + `--concurrency=8` + 1662x1080@30 proxy | `8.4s` |

**4.6x.** Extrapolated to the full 20877-frame render: ~74 min -> ~16 min.

Three separate causes, all now fixed:

1. **`--browser-executable` pointing at the user's Google Chrome.** Any `--concurrency` above 1
   fails there with `Visited "http://localhost:3000/index.html" but got no response`, which is
   why every earlier render in this log used `--concurrency=1` — a 10-core machine running on one
   core. Drop the flag and use the bundled Chrome Headless Shell (`npx remotion browser ensure`).
   **Do not reintroduce `--browser-executable`.**
2. **Decoding the full asset.** The source is 3024x1964@**120fps** but displays at ~1663x1080@30 —
   roughly 16x the decode work for pixels and frames that are thrown away. `public/assets/base-cut-v5-proxy.mp4`
   (1662x1080@30, crf 18) is the composition default. Pass
   `--props='{"asset":"assets/base-cut-v5-asset.mp4"}'` only if a final render needs the full asset.
3. **Rendering video to check layout.** `npx remotion still ... --frame=N` renders one frame in
   ~2s; 8 stills took 15s total. Use stills for placement, video only for timing and motion.

Note: Remotion serves the **root** `public/`, not `remotion/public/`. The latter is a leftover
holding ~210MB of duplicated v2/v4 assets and can be deleted.

Preview command (current):

```sh
npx remotion render remotion/src/index.ts FinalVideo output/preview-vN.mp4 \
  --frames=0-1799 --codec=h264 --crf=23 --pixel-format=yuv420p --concurrency=8
```

## preview-v5-ui-reel

Date: `2026-07-16 CST`

Output:

- `output/preview-v5-ui-reel.mp4`

Six windows around each overlay, rendered separately and concatenated — 3460 frames (~115s)
instead of the full 20877, so every UI can be reviewed in one file without a full render.

Ranges (frames, v5 timeline @30fps): `0-270`, `2020-2540`, `5690-6300`, `6740-7600`,
`9160-9480`, `19340-20220`.

## base-cut-v5 speedup REVERTED

Date: `2026-07-16 CST`

User: "刚才加速那部分，我加得有点不对，你先帮我撤销吧."

Reverted to `work/base-cut-v4-audio-light-v1.mp4` as the current cut. No re-cut was needed —
v4 and its subtitles were still on disk, so the revert was a matter of repointing references:

- `remotion/src/data/subtitles-v4.json` -> v4 subtitles (was `subtitles-v5.json`)
- `FinalVideo.tsx`: `PROXY_ASSET` -> `assets/base-cut-v4-proxy.mp4`, `FULL_ASSET` -> v4 asset
- `Root.tsx`: `durationInFrames` 20877 -> 21440 (714.653s @30fps)
- `work/timeline-map.json` -> `work/timeline-map-v4.json`
- `work/overlays/overlays-v1.json`: only `summary` needed shifting (`645.52` -> `664.28`,
  reveal2 `660.9` -> `679.66`). Every other overlay is before `459.36` and was unaffected.
  The user's own timing edits (title to 9.0, correction to 189-198, folder to 214, web to 318)
  were preserved.

New proxy: `public/assets/base-cut-v4-proxy.mp4` (1662x1080@30, crf 18).

Kept but unused: `work/base-cut-v5-audio-light-v1.mp4`, `work/subtitles/base-cut-v5-*`,
`public/assets/base-cut-v5-{asset,proxy}.mp4`, `work/timeline-map-v5.json`,
`work/scripts/shift-subtitles-for-v5.py`. Delete once the user confirms the speed pass is not
being redone.

If the speed pass is redone, `work/scripts/find-subtitle-gaps.py` lists the only clean
boundaries in that stretch: `456.88-466.88`, `488.88-496.88`, `524.88-526.04`. The subtitle
`496.88-524.88` is a single 28s line, so the note's requested end (`508.36`) cannot be used.

## base-cut-v6 (5x speedup of the waiting section) -- SUPERSEDED by v7, files deleted

Kept for the reasoning only. v7 redoes this edit from v4 in the same pass as the opening
trim, so v6's files were an extra encode generation and are gone. The findings below
(the 24fps timecode reading, the fake 28s subtitle, the VFR master) all still hold.

Date: `2026-07-17 CST`

Input:

- `work/base-cut-v4-audio-light-v1.mp4`

Output:

- `work/base-cut-v6-audio-light-v1.mp4` (`644.836s`, 3024x1964, was `714.653s`)

Reason:

- User picked the range in DaVinci Resolve on a **24fps** timeline: `07:00` to `08:27:07`,
  5x, reported as `01:27:07 -> 00:17:11`. Those are `mm:ss:ff` timecodes, not decimal
  seconds: `01:27:07 @24fps` = `87.292s`, `/5` = `17.458s` = `00:17:11 @24fps`. Reading
  `17:11` as `17.11s` invents a 0.3s discrepancy that does not exist.
- Resolves to v4 `420.0 - 507.291667`. Superseded the abandoned v5 pass (2x, `459.36-496.88`).

The 28s subtitle is not a real 28s line:

- v5 was trimmed to `496.88` because the subtitle `496.88-524.88` looked unsplittable.
  It is a Whisper artifact. `silencedetect -40dB` on the v4 audio shows `496.13-508.75`
  is silence apart from two sub-0.25s clicks; sustained speech starts at `509.49`.
- So `507.29` lands in the middle of a 5.72s silence with 1.46s of clearance. The user
  spotted this from the waveform ("08:30 才开始有声音") before the data did.
- The line's start is retimed to `509.49` before remapping, which also lifts it clear of
  the sped range so it survives intact at 1x.

Command:

```sh
ffmpeg -hide_banner -y -i work/base-cut-v4-audio-light-v1.mp4 \
  -f lavfi -t 17.458333 -i anullsrc=channel_layout=stereo:sample_rate=48000 \
  -filter_complex "\
[0:v]trim=start=0:end=420.0,setpts=PTS-STARTPTS[v0];[0:a]atrim=start=0:end=420.0,asetpts=PTS-STARTPTS[a0];\
[0:v]trim=start=420.0:end=507.291667,setpts=(PTS-STARTPTS)/5[v1];[1:a]asetpts=PTS-STARTPTS[a1];\
[0:v]trim=start=507.291667,setpts=PTS-STARTPTS[v2];[0:a]atrim=start=507.291667,asetpts=PTS-STARTPTS[a2];\
[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]" -map "[v]" -map "[a]" \
  -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart \
  work/base-cut-v6-audio-light-v1.mp4
```

The sped range's audio is `anullsrc` silence, not `atempo` — the user wants that stretch
mute, and there is nothing said in it anyway.

Verification:

- Duration `644.836s` vs `644.820s` predicted (16ms of encoder frame rounding).
- `silencedetect` on v6 shows silence `419.5 - 438.92`. Mapping `438.92` back through
  the timeline gives v4 `508.75` — exactly the click found before the `509.49` onset,
  so the sped range and the 1x resume are both frame-accurate.
- Stills at frames 7200 / 12840 / 13200 / 18000: blur rects still register (aspect intact),
  no subtitle inside the sped range, the retimed line matches its picture, summary card
  reveals correctly.

Note on the master's frame rate:

- `r_frame_rate=120/1` is only the container timebase. The master is VFR, `avg_frame_rate`
  `813390/21439` = `37.94fps`, `nb_frames=27113` over `714.653s`. Do not reason about cut
  points as 120fps frame indices — cut by time.

Downstream:

- Subtitles: `work/scripts/shift-subtitles-for-v6.py` -> `base-cut-v6-audio-light-v1-clean-v1.{json,srt,vtt}`
  (207 kept, 13 dropped inside the sped range, last end `642.97s`)
- Overlays: `work/scripts/shift-overlays-for-v6.py` -> `work/overlays/overlays-v2.json`
  (only `summary` moves: `664.28/679.66/691.76` -> `594.45/609.83/621.93`)
- Timeline map: `work/timeline-map-v6.json`
- Proxy: `public/assets/base-cut-v6-proxy.mp4` (1662x1080@30, crf 18)
- Asset: `public/assets/base-cut-v6-audio-light-v1-asset.mp4` (hardlink)
- `FinalVideo.tsx`: `PROXY_ASSET`/`FULL_ASSET` -> v6, imports `overlays-v2.json` + `subtitles-v6.json`
- `Root.tsx`: `durationInFrames` `21440` -> `19345`
- `remotion/src/data/`: added symlinks `overlays-v2.json`, `subtitles-v6.json`

Why not export from Resolve:

- Its Quick Export YouTube preset was 1920x1080 **24fps**. The comp is 30fps, so 24fps
  source would judder across all 714s, not just the sped part. A 1920x1080 export also
  risks baking pillarbox into the pixels, which breaks `videoRect.ts` (source aspect
  ~1.54) and would slide the blur rects off the private panes.

## base-cut-v7 (opening trim + 5x speedup, one pass from v4)

Date: `2026-07-17 CST`

Input:

- `work/base-cut-v4-audio-light-v1.mp4`

Output:

- `work/base-cut-v7-audio-light-v1.mp4` (`643.816s`, 3024x1964, was `714.653s`)

**v7 is the current timeline.** Both edits are applied to v4 in a single ffmpeg pass, so v7
is one generation from v4 rather than two. Building the opening trim on top of v6 would have
re-encoded the whole video a second time for a 1.02s cut.

Edits:

1. `trim_start` v4 `0 - 1.02` -- drops the leading filler word `其实`. `silencedetect` puts the
   word at `0 - 0.68` followed by a 0.56s pause, so the 1.02 cut lands in silence and leaves a
   0.22s lead-in before the next word at v4 `1.24`. Verified: v7 opens with silence `0 - 0.221`.
2. `speed_up` v4 `420.0 - 507.291667` at 5x, audio silenced, subtitles dropped. See the v6
   section above for how the range was established and why the tail cut is clean.

Command:

```sh
ffmpeg -hide_banner -y -i work/base-cut-v4-audio-light-v1.mp4 \
  -f lavfi -t 17.458333 -i anullsrc=channel_layout=stereo:sample_rate=48000 \
  -filter_complex "\
[0:v]trim=start=1.02:end=420.0,setpts=PTS-STARTPTS[v0];[0:a]atrim=start=1.02:end=420.0,asetpts=PTS-STARTPTS[a0];\
[0:v]trim=start=420.0:end=507.291667,setpts=(PTS-STARTPTS)/5[v1];[1:a]asetpts=PTS-STARTPTS[a1];\
[0:v]trim=start=507.291667,setpts=PTS-STARTPTS[v2];[0:a]atrim=start=507.291667,asetpts=PTS-STARTPTS[a2];\
[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]" -map "[v]" -map "[a]" \
  -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart \
  work/base-cut-v7-audio-light-v1.mp4
```

Verification:

- Duration `643.816s` vs `643.762s` from the timeline map (54ms; the v4 map's own total already
  drifts 37ms from the file, the rest is encoder frame rounding).
- Opening: silence `0 - 0.221` then speech, as predicted.
- Stills at frames 30 / 7170 / 12570 / 17800: title card opens at frame 0, first subtitle reads
  `我真正用AI Agent也是从OpenClaw（龙虾）` with no `其实`, blur rects still register.

Downstream:

- Subtitles: `work/scripts/shift-subtitles-for-v7.py` -> `base-cut-v7-audio-light-v1-clean-v1.{json,srt,vtt}`
  (207 kept, 13 dropped inside the sped range, first `0.22-4.38`, last end `641.95s`)
- Overlays: `work/scripts/shift-overlays-for-v7.py` -> `work/overlays/overlays-v3.json`
  (`title` clamps `0.40 -> 0`; `summary` `664.28/679.66/691.76` -> `593.43/608.81/620.91`)
- Timeline map: `work/timeline-map-v7.json`, `work/timeline-map.json` -> it
- Proxy: `public/assets/base-cut-v7-proxy.mp4` (1662x1080@30, crf 18)
- Asset: `public/assets/base-cut-v7-audio-light-v1-asset.mp4` (hardlink)
- `FinalVideo.tsx` -> v7 assets, `overlays-v3.json`, `subtitles-v7.json`
- `Root.tsx`: `durationInFrames` -> `19314`

Both shift scripts read the **v4** subtitles and `overlays-v1.json` and apply the whole v4->v7
map in one hop. `work/subtitles/base-cut-v4-audio-light-v1-clean-v1.json` and
`work/overlays/overlays-v1.json` are therefore load-bearing inputs, not history -- do not delete
them, and re-run both scripts (not a v6-era one) if the edit is ever adjusted.

## Cleanup 2026-07-17

Deleted (538MB), after v7 became current:

- v5 (abandoned 2x pass) and v6 (superseded intermediate): masters, proxies, assets, subtitles,
  timeline maps, and their shift scripts
- `public/assets/base-cut-v4-proxy.mp4` -- v4 is no longer the render source
- `output/preview-v{1,2,3,4}.mp4` and `output/preview-v5-ui-reel.mp4` -- all on dead timelines

Kept deliberately:

- `work/base-cut-v4-audio-light-v1.mp4` -- v7's source
- `work/subtitles/base-cut-v4-audio-light-v1-clean-v1.json`, `work/overlays/overlays-v1.json` --
  inputs to the v7 shift scripts
- `work/timeline-map-v4.json` -- documents how v4 was cut from the recording
- `public/assets/base-cut-v4-audio-light-v1-asset.mp4` -- still referenced by the legacy
  `SubtitlePreview` / `VisualPreview` compositions

## Speed badge overlay

Date: `2026-07-17 CST`

Adds a `speed` overlay type marking the 5x stretch with `倍速播放中 5×` and a progress bar.

- `remotion/src/components/overlays/SpeedBadge.tsx`, wired into `OverlayRenderer`, typed in
  `overlays/types.ts`.
- Declared in `work/overlays/overlays-v1.json` as `speed-waiting`, v4 `420.0 - 507.291667`,
  which the shift script maps to v7 `418.98 - 436.44` — exactly the sped range.

Two things worth keeping if this is ever refactored:

- **The bar derives its fill from the overlay's own Sequence**, not from a hardcoded duration,
  so it tops out when normal speed resumes and cannot drift out of sync with the edit. It
  reaches 100% at `durationInFrames - 10`, where `useFade`'s fade-out begins, so the full bar
  is visible for the frames it takes to disappear instead of being cut off around 98%.
- **`speed` is the only type allowed inside the sped range.** `shift-overlays-for-v7.py` raises
  for any other type whose time lands there, since that means a card would be silently squished
  to a fifth of its intended duration. Do not relax that check globally.

The badge has a `1px rgba(255,255,255,0.14)` border because the sped stretch cuts between the
white Xiaohongshu page and the dark editor; the dark fill alone has no edge against the latter.

Placement is `anchor: {x: 0.04, y: 0.05, width: 0.30}` — top left, over window chrome rather
than content, and clear of the webcam PIP in the top right. Anchors are fractions of the
displayed video rect; see `videoRect.ts`.

## Overlay redesign — warm palette, larger type, per-item cues

Date: `2026-07-17 CST`

### Why the old look failed

The overlays were dark blue-grey (`rgba(11, 13, 15, …)`) with a light-blue accent (`#9cc7ff`).
That is *VS Code's own palette*. Against a recording of VS Code the UI read as part of the app
being demoed rather than as commentary on top of it. The fix is colour temperature, not
brightness: **amber on warm near-black**, which also survives the white Xiaohongshu pages the
video cuts to. Tokens now live in `remotion/src/lib/theme.ts`; `videoRect.ts` is geometry only.

### Sizes

Everything up roughly a third, tuned for phone playback where the video is a few centimetres
wide. Subtitles `48 -> 60`, compare titles `44 -> 52`, card titles `36 -> 46`, chips `32 -> 36`,
with padding and gaps opened to match.

Bumping the subtitle size meant rewriting the wrapper. The old `splitText` only ever produced
**two** lines, which overflows at 60px — the transcript has segments up to ~56 characters, since
Whisper sometimes merges several sentences into one. `wrapText` now greedily packs clauses to
`MAX_CHARS_PER_LINE = 20` and hard-wraps anything with no punctuation to break on.

### Per-item naming cue

`CompareBox.items` accepts `{text, namedAt}` as well as plain strings. When the narration names
a product its chip's border flares and it stays lit, so the box accumulates a record of what was
covered. Cues on the v4 timeline: Workbuddy `64.90`, Manus `66.30`, Claude Desktop `70.16`.

`flareAt` rises over 0.12s then decays exponentially — a flick of light, not a state that sits
there competing with the next name.

Two things that had to be tuned by looking at a still, not by reasoning:

- **Only the flare goes full accent.** A chip that stays as loud as the moment it was named keeps
  pulling the eye afterwards. Settled chips keep a warm border but white text.
- **A highlighted box dims its sibling to 0.5.** At `83.98` the narration is making the TUI box
  the point, but the three already-lit chips in the GUI box fought it. Amber was doing two jobs —
  "this was named" and "this is the point" — so neither landed.

### `namedAt` must be in `TIME_KEYS`

`shift-overlays-for-v7.py` remaps by key name. `namedAt` was initially missing, so the chip cues
silently stayed on v4 time — 1.02s late, past the word they mark. Any new time-bearing field must
be added to `TIME_KEYS` or it will drift.

Still not themed: `VisualPreview.tsx` keeps the old blue-grey. It is a legacy composition outside
the `FinalVideo` render path.

## Splitting the 28s subtitle

Date: `2026-07-17 CST`

The v4 transcript carried one 28s line at `496.88-524.88`:

> OK，然后你可以看到左上角这里，他又看了下一篇文章，他一直在看新文章，然后你看，一直在看，然后这就是他在代替你做调研，

It is now six lines, `509.49-524.55`, longest `3.14s`.

**Do not hand-split a line like this against the sped range.** Two traps:

- `shift-subtitles-for-v7.py` drops anything with `start < SPEED_END` (`507.291667`).
  Splitting naively from `496.88` would have silently dropped the first pieces — the head of
  that range is the 5x stretch, and there is nothing said in it anyway.
- The script used to special-case this exact line by its `(496.88, 524.88)` key. Any split
  would have made that entry dead code that still *looks* live. It has been removed.

**Timings came from re-transcribing, not from guessing.** `silencedetect` locates pauses but
cannot say which clause falls in which gap, and mapping seven clauses onto eight speech bursts
by eye is invention. Instead the audible window was cut out and re-run through the existing
model with word timestamps:

```sh
ffmpeg -y -ss 509.49 -to 524.88 -i work/base-cut-v4-audio-light-v1.mp4 -vn -ac 1 -ar 16000 clip.wav
.venv/bin/mlx_whisper clip.wav --model mlx-community/whisper-large-v3-turbo \
  --output-format json --language zh --condition-on-previous-text False --word-timestamps True
```

Offset the result by `+509.49`. Every segment boundary it returned lands inside a pause that
`silencedetect` had already found independently, which is what makes the result trustworthy.

**The text changed, and that is the point.** The old line opened `OK，然后…` and said `左上角这里`;
the new one opens `你可以看到左上角`. Those words were never spoken — the old segment claimed to
start at `496.88`, which is silence, so Whisper filled the gap. Transcribing only the audible
window removes the confabulation. Same reason the line's `start` was wrong in the first place.

Result: 220 -> 225 lines in v4, 207 -> 212 kept in v7.

--------

## agent-types overlay: measured chip cues + GUI box exit (2026-07-17)

Two changes to the `agent-types` compare card, both edited in the **v4 source**
(`work/overlays/overlays-v1.json`) and re-shifted with `shift-overlays-for-v7.py`. Never edit
`overlays-v3.json` — it is generated.

### 1. The three chip cues were all early

Whisper's segment timestamps had the chips flaring before the words were spoken. Re-measured by
cutting the audible window out of **v7** (the delivered timeline) and re-transcribing with word
timestamps, then cross-checking every word start against a `silencedetect` speech window:

```sh
ffmpeg -y -ss 62 -to 75 -i work/base-cut-v7-audio-light-v1.mp4 -vn -ac 1 -ar 16000 chips.wav
ffmpeg -i chips.wav -af silencedetect=n=-32dB:d=0.25 -f null -
.venv/bin/mlx_whisper chips.wav --model mlx-community/whisper-large-v3-turbo \
  --output-format json --language zh --condition-on-previous-text False --word-timestamps True
```

Offset by `+62` for v7, `+63.02` for v4.

| chip | spoken (v4) | old `namedAt` | error | new `namedAt` (v4) | v7 |
|---|---|---|---|---|---|
| WorkBuddy | 65.66 | 64.90 | early 0.76s | 65.60 | 64.58 |
| Manus | 67.28 | 66.30 | early 0.98s | 67.22 | 66.20 |
| Claude Desktop | 71.76 | 70.16 | **early 1.60s** | 71.70 | 70.68 |

New cues are **word start minus 0.05**: `flareAt` rises over 0.12s, so the flare peaks on the
word rather than finishing before it. The 1.60s error on Claude Desktop meant that flare landed
on `另外一类AI agent` — a different clause entirely.

Verified on a still at frame 2124 (v7 `70.80`): peak flare on Claude Desktop while the subtitle
reads `甚至Claude Desktop`, the two earlier chips settled lit and white.

### 2. GUI box now exits before the TUI box

New optional `hideAt` on `CompareBox` (`types.ts`, rendered in `CompareCards.tsx` as a 0.6s
opacity fade). **The box keeps its flex slot while fading** — dropping it from the layout would
slide the TUI box sideways to take the space, and there is no reason to move a box the viewer is
being asked to read.

- `gui.hideAt` v4 `88.50` -> v7 `87.48`
- overlay `end` v4 `91 -> 94.50` -> v7 `93.48` (TUI box holds ~3.5s longer, as asked)

**88.50 is a floor, not a preference.** The line at v4 `85.00-87.98` is `它不是腾讯Workbuddy那种`
— it points back at the GUI category, so the GUI box has to still be on screen for it. What
follows (`它` / `我先把那个` / `先翻一下墙`) is dead air on this topic, and the next topic opens at
`94.92` (`现在主流的`), which is where the `94.50` end comes from.

`hideAt` is registered in `TIME_KEYS` in `shift-overlays-for-v7.py`. Script output confirms
`88.50->87.48` — the same trap `namedAt` fell into (see the TIME_KEYS section above): an
unregistered time key does not error, it silently keeps v4 coordinates.

--------

## Audio level: the master is ~17 LU under target (2026-07-17, not yet fixed)

`ffmpeg -i work/base-cut-v7-audio-light-v1.mp4 -af ebur128=peak=true -f null -`:

| | measured | short-form target |
|---|---|---|
| Integrated | **-31.2 LUFS** | -14 LUFS |
| True peak | -10.5 dBFS | <= -1.0 dBFS |
| LRA | 9.7 LU | fine as-is |

The recording was simply quiet. Nothing in the chain ever normalized it: v2 applies
`highpass=f=85` only, and v4/v7 are trim/concat passes. Gating threshold `-42.8` means `-31.2`
is speech, not silence dragging the average down.

10.5 dB of true-peak headroom and a normal LRA means this is a **gain problem, not a dynamics
problem** — normalize, do not compress.

**Fix belongs after the final render, not in the master.** The v4 master and `overlays-v1.json`
are live inputs to the shift scripts; re-encoding audio upstream buys nothing and risks the
timeline. Two-pass loudnorm on the finished file, video stream copied:

```sh
ffmpeg -y -i output/final-v1.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=summary -f null -
# then feed the measured_* values back in:
ffmpeg -y -i output/final-v1.mp4 -c:v copy \
  -af loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=..:measured_TP=..:measured_LRA=..:measured_thresh=..:offset=..:linear=true \
  -c:a aac -b:a 192k -movflags +faststart output/final-v1-loud.mp4
```

Studio preview stays quiet either way — it plays the un-normalized asset.

--------

## package.json: `--browser-executable` removed (2026-07-17)

`remotion:studio` and `remotion:compositions` carried
`--browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`, which
breaks `--concurrency > 1` (measured 4.6x slower — see the render speed section above). Removed;
Remotion's bundled browser is used instead. Verified `npm run remotion:compositions` still lists
all four compositions.

Added `remotion:still` and `remotion:render` so the two commands that matter are not retyped
from memory:

- `npm run remotion:still -- out.png --frame=2200` — ~2s, the way to check layout
- `npm run remotion:render` — full v7 render, ~16 min

--------

## Cleanup: old masters and preview compositions deleted (2026-07-17)

Deleted 422MB of superseded masters. `input/Screen Recording 2026-07-15 at 12.36.24.mov` (2.3GB)
is untouched, so the whole chain is rebuildable from source if it ever has to be.

| deleted | why safe |
|---|---|
| `work/base-cut-v1.mp4` | superseded, no code or script reference |
| `work/base-cut-v2.mp4` | superseded, no reference |
| `work/base-cut-v3-audio-light-v1.mp4` | abandoned branch (v3 speedup reverted 2026-07-16) |
| `work/base-cut-v2-audio-light-v1.mp4` | v4's source, but v4 itself is kept and is the live input |
| `public/assets/base-cut-v2-audio-light-v1-asset.mp4` | hardlink to the above; **nothing referenced it** |

**Kept:** `work/base-cut-v4-audio-light-v1.mp4` (live input to both shift scripts) and
`work/base-cut-v7-audio-light-v1.mp4` (current timeline), plus their assets and the v7 proxy.

The handover claimed the v2 asset was "still wired to `SubtitlePreview`". It was not —
`SubtitlePreview` pointed at the **v4** asset. Checked with grep before deleting rather than
trusting the note.

### Preview compositions removed

`SubtitlePreview` and `VisualPreview` are gone (`.tsx`, their `Root.tsx` registrations, and the
two non-symlink JSON copies in `remotion/src/data/`). They were off the `FinalVideo` render path,
still on v4 media, and still on the old blue palette that the amber redesign replaced — a
maintenance trap where the "obvious" preview showed a look the project had abandoned.

`remotion/src/data/` now holds only symlinks into `work/`, so there is no copy of a subtitle file
that can drift from its source. `subtitles-v4.json` and `overlays-v1.json` stay: they point at
the live v4 sources.

Remaining compositions: `FinalVideo`, `DemoVideo`.

## Bilibili cover

Composition `Cover` (`remotion/src/compositions/Cover.tsx`), 1920x1080. Bilibili's minimum is
1146x717 at 16:9; rendering above spec and letting their pipeline downscale is cheaper than
matching it exactly.

```sh
npx remotion still remotion/src/index.ts Cover output/cover-v4.png --frame=0
```

Background is `public/assets/cover-frame-v1.png`, one frame of the full-quality master. The
opening's only moving part is the webcam; at 6.2s he is looking at the lens with his mouth at
rest, which 2s / 4s / 8s / 10s are not.

```sh
ffmpeg -ss 6.2 -i public/assets/base-cut-v7-audio-light-v1-asset.mp4 \
  -frames:v 1 public/assets/cover-frame-v1.png
```

The master is 3024x1964 (1.54:1), which the video composition pillarboxes into 16:9. The cover
uses `objectFit: cover` instead — the ~167px it crops vertically is the macOS menu bar and the
editor status bar, and a cover cannot afford dead width.

History:

- `cover-v1.png`, `cover-v2.png`: an earlier design — drawn folder/browser SVGs on flat warm
  black, no video frame. Superseded, do not use.
- `cover-v3.png`: current design, scrim a single 0.74 wash. The file tree stayed legible enough
  to read as clutter at feed size.
- `cover-v4.png`: three-pass scrim (0.72 base + left-weighted linear + centre radial), which
  kills the tree while leaving the webcam bright. Current.

Copy is `defaultProps` (`chip` / `headline` / `subline` / `frame`), editable in Studio without
touching layout. It divides labour with the video title (实录｜我平时是怎样把AI Agent当个人助理的):
the title names form and subject, so the cover carries what the title dropped — the mechanism,
and the promise that this is not a tutorial. **If the title changes, re-check this split.**

Checked at 320px wide (feed size): headline reads, chip reads, subline does not. The subline is
therefore a bonus, not load-bearing — do not move anything essential into it.
