# Process log

## 2026-07-15

### Source inspection

Command:

```sh
ffprobe -v error -show_format -show_streams -of json 'input/Screen Recording 2026-07-15 at 12.36.24.mov' > work/media/source-media-info.json
```

Output:

- `work/media/source-media-info.json`
- `work/media/source-media-info.md`

### Transcription audio preparation

Command:

```sh
ffmpeg -hide_banner -y -i 'input/Screen Recording 2026-07-15 at 12.36.24.mov' -vn -ac 1 -ar 16000 -c:a pcm_s16le work/audio/source-audio.wav
```

Output:

- `work/audio/source-audio.wav`

Verification:

- Format: WAV
- Codec: PCM signed 16-bit little-endian
- Sample rate: `16000Hz`
- Channels: mono
- Duration: `1017.342688s`
- Bitrate: `256000` bps

Notes:

- No destructive cuts have been made.
- `work/timeline-map.json` is not required yet because the timeline has not changed.

### Whisper installation

Installed OpenAI Whisper into the project virtual environment:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -U pip setuptools wheel openai-whisper
```

Verification:

- CLI: `.venv/bin/whisper --help`
- Python import: `.venv/bin/python -c "import whisper; print(whisper.__file__)"`
- Package version: `openai-whisper 20250625`

Notes:

- Whisper is installed locally under `.venv/`.
- No Whisper model has been downloaded yet.

### Source frame sampling

Command:

```sh
ffmpeg -hide_banner -y -i 'input/Screen Recording 2026-07-15 at 12.36.24.mov' -vf fps=1/60 -q:v 2 work/frames/source-samples-v1/frame-%03d.jpg
```

Output:

- `work/frames/source-samples-v1/frame-001.jpg` through `work/frames/source-samples-v1/frame-017.jpg`

Verification:

- Frame count: `17`
- Frame size: `3024x1964`

Notes:

- Frames are sampled from the original source timeline at roughly 60-second intervals.
- Sampling is for visual review only; no timeline edits have been made.

### MLX transcription

Current transcription entry point:

```sh
bash work/scripts/transcribe-mlx.sh
```

Output:

- `work/transcripts/mlx/source-audio.json`
- `work/transcripts/mlx/source-audio.txt`
- `work/transcripts/mlx/source-audio.srt`
- `work/transcripts/mlx/source-audio.vtt`
- `work/transcripts/mlx/source-audio.tsv`

Notes:

- The transcript is generated from `work/audio/source-audio.wav`.
- The script reads the audio duration with `ffprobe` and passes it to `mlx_whisper` as the clip end timestamp.
- Current main edit-plan basis is `work/transcripts/mlx/source-audio.json`.
