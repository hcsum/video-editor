# Video Editing Agent Instructions

## Project structure

* `input/`: original source videos and audio
* `work/`: transcripts, analysis results, edit plans and temporary media
* `remotion/`: Remotion project and reusable video components
* `public/assets/`: images, fonts, screenshots and other render assets
* `output/`: previews and final exported videos

## Safety rules

* Never modify, rename or overwrite files inside `input/`.
* Never overwrite an existing render.
* Use versioned filenames such as:

  * `rough-cut-v1.mp4`
  * `preview-v2.mp4`
  * `final-v3.mp4`
* Place temporary files only inside `work/`.
* Inspect every source and rendered video with `ffprobe`.
* Verify duration, resolution, frame rate, audio tracks and audio/video synchronization after rendering.
* Do not delete uncertain content. Mark it as `review`.

## Editing workflow

Always work in this order:

1. Inspect source media with `ffprobe`.
2. Generate a timestamped transcript.
3. Analyze the transcript and relevant video frames.
4. Create:

   * `work/edit-plan.md`
   * `work/edit-plan.json`
5. Produce a clean base cut using FFmpeg.
6. Use Remotion for visual composition and final rendering.
7. Iterate on **stills**, not preview renders — see "Verification loop: stills first".
8. Review the rendered file using `ffprobe` and extracted frames.

Do not begin with visual effects before the content edit is approved.

See **"Hard-won rules"** at the end of this file for the failures that shaped the above, and
**"Per-episode workflow"** for the condensed sequence.

## Responsibilities

### FFmpeg

Use FFmpeg for:

* cutting and joining source segments
* trimming the beginning or end
* removing mistakes and long pauses
* speeding up waiting or loading sections
* extracting audio
* audio normalization
* light noise reduction
* format conversion
* generating proxy or preview files

Prefer simple, inspectable FFmpeg commands.

Avoid building one extremely large and fragile filtergraph when the work can be split into clear intermediate steps.

### Remotion

Use Remotion for:

* subtitles
* titles and section headings
* lower thirds
* callouts and annotations
* zoom and crop animations
* cursor emphasis
* screen framing
* background elements
* logos and watermarks
* intro and outro components
* layout changes between landscape and vertical formats
* final composition and rendering

Do not use Remotion to imitate basic destructive video cutting when FFmpeg can produce a simpler clean base cut.

## Remotion architecture

Build reusable components instead of hardcoding every frame in one composition.

Recommended structure:

```text
remotion/
├── src/
│   ├── Root.tsx
│   ├── compositions/
│   │   └── DemoVideo.tsx
│   ├── components/
│   │   ├── Subtitle.tsx
│   │   ├── TitleCard.tsx
│   │   ├── Callout.tsx
│   │   ├── ScreenZoom.tsx
│   │   └── Outro.tsx
│   ├── data/
│   │   └── edit-plan.json
│   └── styles/
└── public/
    └── assets/
```

Keep content data separate from rendering components.

Do not hardcode timestamps throughout React components. Load timing and text from structured JSON whenever possible.

## Edit plan format

The edit plan should use seconds based on the original source timeline.

Example:

```json
{
  "source": "input/source.mp4",
  "segments": [
    {
      "sourceStart": 4.2,
      "sourceEnd": 18.7,
      "action": "keep"
    },
    {
      "sourceStart": 18.7,
      "sourceEnd": 23.1,
      "action": "remove",
      "reason": "repeated explanation"
    }
  ],
  "overlays": [
    {
      "type": "callout",
      "start": 8.4,
      "end": 11.2,
      "text": "Create a new project",
      "position": "bottom-left"
    },
    {
      "type": "zoom",
      "start": 28.1,
      "end": 32.5,
      "x": 0.68,
      "y": 0.42,
      "scale": 1.5
    }
  ]
}
```

After cutting the source, create a second timing map for the edited timeline when necessary.

Do not assume original-source timestamps are identical to final-video timestamps.

## Timeline mapping

After every destructive cut, trim, removal, insertion, or speed change, generate or update:

`work/timeline-map.json`

This file is mandatory and must map the original source timeline to the current edited timeline.

Each retained segment must include:

* original source start and end time
* edited timeline start and end time
* playback speed
* source filename
* segment ID

Example:

```json
{
  "version": 1,
  "source": "input/source.mp4",
  "output": "work/base-cut-v1.mp4",
  "segments": [
    {
      "id": "segment-001",
      "sourceStart": 20.0,
      "sourceEnd": 80.0,
      "editedStart": 0.0,
      "editedEnd": 60.0,
      "speed": 1
    },
    {
      "id": "segment-002",
      "sourceStart": 90.0,
      "sourceEnd": 110.0,
      "editedStart": 60.0,
      "editedEnd": 65.0,
      "speed": 4
    }
  ]
}
```

All subtitles, overlays, callouts and Remotion animations must use edited-timeline timestamps unless explicitly marked as source-timeline timestamps.

When the user provides a timestamp without specifying the timeline, assume it refers to the latest rendered video. Resolve it through `work/timeline-map.json` before modifying source media.

Never manually calculate timeline offsets when a timeline map is available.

## Subtitles

* Generate subtitles from the final edited audio, not only from the original source.
* Correct obvious transcription mistakes.
* Keep subtitle timing synchronized with the edited timeline.
* Avoid word-by-word karaoke subtitles unless explicitly requested.
* Prefer short readable phrases.
* Avoid more than two lines at once.
* Keep subtitles inside a safe viewing area.
* Store subtitles as structured JSON or SRT in addition to rendering them into the video.

## Visual style

For a simple product demonstration video:

* prioritize clarity over decorative animation
* use restrained transitions
* avoid unnecessary motion
* use zoom only when it helps viewers see an interface detail
* keep callouts visible long enough to read
* preserve the original screen recording whenever possible
* avoid covering important interface controls with subtitles or overlays

## Verification loop: stills first

Match the check to what actually changed. Rendering video to look at a layout wastes minutes per
iteration and burns the user's patience for no information gain.

| question | tool | cost |
|---|---|---|
| Is this laid out right? Is the accent too loud? | `remotion still --frame=N` | ~2s |
| Does this cue land on the right word? | `remotion still` at the cue frame | ~2s |
| Does the motion read? Does the audio sync? | render the affected range only | ~1min |
| Is the deliverable correct? | full render | ~15min+ |

```sh
npx remotion still remotion/src/index.ts <Comp> out.png --frame=2200
npx remotion render remotion/src/index.ts <Comp> output/preview-vN.mp4 --frames=0-1799 --concurrency=8
```

A still answers most overlay questions, including timing ones: render the frame where a cue
peaks and read the subtitle burnt into that same frame — if the flare is on the right word, the
cue is right.

Only render video for things a frozen frame genuinely cannot show: motion, pacing, audio.
Only render the full video for the deliverable itself.

## Rendering

* Preserve the source aspect ratio unless another output format is requested.
* Preserve the source frame rate unless there is a clear reason to change it.
* Use high-quality settings for final exports.
* Use faster settings for previews.
* Always log the render command and important parameters in `work/render-log.md`.
* Record the Git commit or current project state when producing a final render.
* **Never pass `--browser-executable` to Remotion.** It forces `--concurrency=1` (measured 4.6x
  slower). Use the bundled browser. If a render is inexplicably slow, check for this flag hiding
  in an npm script before optimizing anything else.
* Render from a low-resolution proxy for iteration; pass the full-resolution asset via props for
  the deliverable.
* **A render is not a deliverable until its loudness is normalized and re-measured.** See
  "Audio: normalize the render, measure the result".

## Cover workflow

Treat the cover as a separate deliverable, not a byproduct of the video render.

1. Choose candidate background frames from the current edited timeline or final rendered video.
   Do not extract from obsolete base cuts unless the user explicitly asks for that timeline.
2. Extract candidate frames with FFmpeg into versioned files under `public/assets/`, for example:

   ```sh
   ffmpeg -ss 7.27 -i public/assets/base-cut-v7-audio-light-v1-asset.mp4 \
     -frames:v 1 public/assets/cover-frame-v4.png
   ```

3. Build the cover in Remotion with a dedicated still composition. Use Remotion for text,
   scrims, framing and platform-specific layout constraints.
4. Render cover candidates into versioned files under `output/`, for example:

   ```sh
   npx remotion still remotion/src/index.ts Cover output/cover-v8.png --frame=0
   ```

5. Verify the rendered cover as a still before producing any more variants.
6. Upload or preview it in the target platform when platform cropping is relevant, and use that
   crop preview as the authority for final text placement.

Never overwrite an existing cover frame or rendered cover. Keep rejected candidates unless the
user explicitly asks to remove them.

### Cover layout rules

* Determine the platform's displayed crop or safe area before placing text. A 16:9 uploaded image
  may be judged by a 4:3 recommendation frame or another platform-specific crop.
* Put all essential text inside the platform's final visible safe area, not merely inside the
  full exported canvas.
* If the platform shows a crop overlay, translate it into canvas coordinates and encode that in
  the Remotion component. Example: a centered 4:3 crop inside a 1920x1080 cover is x=240,
  width=1440.
* Choose background frames for expression, recognisable UI state, and thumbnail readability.
  Avoid frames where the speaker looks awkward, important UI is too busy, or the text competes
  with high-contrast content.
* Let the cover copy divide labour with the video title. Do not repeat the title unless
  repetition is intentionally part of the packaging.
* Record the selected frame timestamp, source file, platform crop constraint, render command and
  reason for the choice in `work/render-log.md`.

## Agent behavior

Before editing, briefly report:

* source media information
* proposed editing approach
* files that will be created
* any uncertain decisions

After editing, report:

* files generated
* original duration
* final duration
* removed or accelerated sections
* overlays added
* warnings or items still requiring review

When the user's instruction is ambiguous, preserve the original content rather than deleting it.

--------

# Hard-won rules

Everything below cost real time to learn. Each rule states the failure that produced it, because
a rule without its failure gets rationalized away by the next agent who thinks they know better.

## Never trust ASR timestamps. Measure.

**Whisper's segment boundaries are approximations, and against silence it invents content.**

This bit twice in one project. A 28s "subtitle" turned out to be 12s of silence plus a
hallucinated `OK，` — that fabricated line was then used as evidence to argue, across two rounds,
for a cut point that did not exist. Separately, every chip cue in a comparison card was early by
0.76–1.60s, so highlights flared before their words were spoken. In both cases the JSON looked
authoritative and was wrong.

**Any time a graphic must land on a specific word, measure that word.** Two independent methods,
cross-checked:

```sh
# 1. Where are the pauses? (structure, but cannot say which clause is which)
ffmpeg -i clip.wav -af silencedetect=n=-32dB:d=0.25 -f null -

# 2. What was actually said, and when? (cut the AUDIBLE window only)
ffmpeg -y -ss <start> -to <end> -i <current-timeline>.mp4 -vn -ac 1 -ar 16000 clip.wav
.venv/bin/mlx_whisper clip.wav --model mlx-community/whisper-large-v3-turbo \
  --output-format json --language zh --condition-on-previous-text False --word-timestamps True
```

Offset the result by the window start. **A word time is trustworthy when it lands inside a speech
window `silencedetect` found independently.** One method alone is a guess.

Transcribe the **current delivered timeline** to learn what was said and when — not an ancestor
master. Feeding only the audible window is also what stops the confabulation: no silence in,
no invention out.

**Cue timing:** set the cue to **word start minus ~0.05s** when the flash has a rise time
(a 0.12s rise means the peak lands on the word, not after it). Verify on a still at the peak
frame — the burnt-in subtitle tells you if you hit the right word.

## Derived timelines: regenerate from source, never edit the output

Every destructive edit spawns a new coordinate system, and hand-maintaining N of them is how
timelines rot. The structure that worked:

```
<source master> + <source subtitles> + <source overlays>     <- the ONLY files a human edits
        |  shift-<thing>-for-<target>.py     (recomputes the WHOLE edit, every run)
        v
<target subtitles> + <target overlays>                       <- generated; edits here are lost
```

* **One jump, not a relay.** Scripts read the original source and apply the entire accumulated
  edit in one pass. No v4→v5→v6→v7 chain: intermediate versions get deleted, and error compounds
  through a relay.
* **The source files are live inputs, not history.** Say so loudly wherever they are listed.
  Someone will eventually try to "clean up" the old master that everything is regenerated from.
* **Mark generated files as generated**, in the file itself and in the README.

### Registering time fields is a real failure mode

A shift script that remaps **by key name** silently ignores keys it does not know. An
unregistered time field is not an error — it is a value that keeps stale coordinates and is
wrong by exactly the trim offset.

This shipped once (`namedAt` was added, not registered, and three cues sat 1.02s off, landing on
the wrong words). **When adding any field that carries a time, register it in the script's key
set in the same commit.** And where a script matches on a value it expects to find,
**make the miss an error, never a silent skip** — a silent skip fails at the exact moment the
user changes the thing it was matching on.

## Audio: normalize the render, measure the result

**Check loudness before declaring anything deliverable.** A screen recording is typically far
under target and nothing in a cut/concat chain fixes it. This project's master sat at
**-31.2 LUFS — 17 dB under** the -14 LUFS short-form target, all the way to the final render,
because no step in the chain ever normalized.

```sh
ffmpeg -i <file> -af ebur128=peak=true -f null -    # integrated / true peak / LRA
```

Targets: **-14 LUFS** integrated (short-form), true peak **≤ -1.0 dBFS**.

**Normalize the finished render, not the master.** The master is a live input to the shift
scripts; re-encoding it upstream risks the timeline and buys nothing. Two-pass `loudnorm`, video
stream copied:

```sh
ffmpeg -i output/final-vN.mp4 -af loudnorm=I=-14:TP=-2.0:LRA=11:print_format=json -f null -
ffmpeg -y -i output/final-vN.mp4 -c:v copy \
  -af loudnorm=I=-14:TP=-2.0:LRA=11:measured_I=..:measured_TP=..:measured_LRA=..:measured_thresh=..:offset=..:linear=true \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart output/final-vN-loud.mp4
```

Two things that are not obvious:

* **Aim TP at -2.0, not -1.5.** Lossy encoding overshoots the limiter. A file limited to -1.5
  measured **-0.7 dBFS** after AAC; -2.0 landed at -1.4. The platform re-encodes again after you.
* **`linear=true` is a request, not a promise.** It falls back to dynamic when linear gain would
  clip. Check `Normalization Type` in the output and say which one happened — dynamic changes the
  dynamics (LRA 9.7 → 7.3 here). Fine for speech, but it is a real trade, so report it rather
  than letting the user discover it.
* **Re-measure the finished file with `ebur128`.** `loudnorm`'s own summary describes its intent
  before the encoder had its say. Trust the independent measurement.

## Screen-recording geometry

* **Anchor overlays in fractions of the video rectangle, not pixels of the canvas.** Source
  footage rarely matches the output aspect, so it is letterboxed inside it — pixel coordinates
  drift the moment anything about the framing changes. This matters most for privacy blurs: a
  blur that slides off its target exposes exactly what it was covering.
* **Never re-export the master at the output resolution** to dodge this. Baked-in letterbox
  breaks the fraction math permanently.
* **Screen recordings are usually VFR.** `r_frame_rate` is a container timebase, not a real frame
  rate — this project's master reports `120` and averages `37.94fps`. **Reason in seconds. Never
  derive a cut point from a frame number.**

## Overlay design against a recorded UI

* **Set the overlay palette away from the recorded application's palette.** The first design here
  used a cool grey + blue that was, unintentionally, VS Code's own scheme — the graphics dissolved
  into the editor. Switching to warm amber on warm charcoal fixed it. **Change color temperature,
  not brightness.**
* **Only the flash is full accent.** A chip that stays as loud as the moment it was named competes
  with whatever is said next. Settle it back to plain text.
* **When one thing is highlighted, dim the other.** Two things at full accent means nothing is
  emphasized.
* **Size for the smallest target screen.** Correct sizes look oversized in a desktop preview.
  That is expected — do not "fix" it.
* **Fading a box out keeps its slot.** Removing it from the layout slides its neighbour sideways,
  moving the thing you are asking the viewer to read.
* **An overlay's exit is bounded by the narration, not by taste.** Before shortening or extending
  anything, read the transcript around it: a line that refers back to a graphic pins that graphic
  on screen. Find the floor, then choose within it.

## Working with the user

* **Their observation beats your inference.** The hallucinated-subtitle fiasco was caught by the
  user looking at a waveform while the agent argued from JSON. When the user says a cue feels
  off, they are usually right — go measure, do not explain why the data says otherwise.
* **Report a line of progress between steps.** Silence during long work reads as being stuck.
  (Cost here: 21 minutes of quiet, then "我在干嘛？究竟？")
* **Cheap loop over correct-first-time.** Stills, and letting the user edit JSON directly with
  hot reload, beat an agent doing a careful round trip for every tweak.
* **Verify claims in handover notes before acting on them.** A note here said an asset was "still
  wired to `SubtitlePreview`"; grep said nothing referenced it. Notes describe what was true when
  written. `grep` describes now.
* **Say what you did not verify.** Loudness and frame count are measurable and were measured; the
  picture was never watched end to end. State that plainly instead of implying a review that did
  not happen.

## Per-episode workflow

1. **Cut content first, with FFmpeg.** No overlays until the content edit is settled — every
   destructive edit invalidates every timestamp downstream.
2. **Write the timeline map** for the cut (`work/timeline-map.json`). Mandatory, per the rules
   above.
3. **Transcribe the cut audio**, clean the text, keep it as JSON.
4. **Author overlays against the cut's coordinates** in a source JSON.
5. **Iterate on stills.** Let the user drive JSON edits in Studio.
6. **Any further destructive edit → write a shift script** from the source coordinates and
   regenerate. Do not hand-patch the derived files, and do not chain off the previous derivation.
7. **Measure every cue that must land on a word** (see above). Never eyeball, never trust ASR.
8. **Full render** only when the user has reviewed the composition.
9. **Normalize loudness on the render**, then re-measure with `ebur128`.
10. **Make and verify the cover** when a platform thumbnail is needed. Extract versioned
    candidate frames, render versioned cover stills, and check the platform crop before calling it
    final.
11. **Log it in `work/render-log.md`** — command, measurements, cover frame choices, platform
    crop constraints, and the reasoning behind
    non-obvious choices. Reasons are what survive; the commands get rerun from history anyway.

## Documentation

`work/render-log.md` is the project's memory and is worth writing carefully. **Record why, not
just what.** A command can be reconstructed from shell history; the reason a cue sits at
`88.50` and not `85.00` cannot, and that is precisely the thing a future agent will "simplify"
away.

Every non-obvious decision gets the measurement that produced it and the constraint that bounds
it. When a rule exists because something broke, write down what broke.
