#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

MODEL="${MLX_WHISPER_MODEL:-mlx-community/whisper-large-v3-turbo}"
AUDIO="${1:-work/audio/source-audio.wav}"
OUT_DIR="${2:-work/transcripts/mlx}"
DURATION="$(
  ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$AUDIO" |
    awk '{printf "%.3f", $1}'
)"

mkdir -p "$OUT_DIR"

echo "mlx model: $MODEL"
echo "audio: $AUDIO"
echo "output: $OUT_DIR"
echo "duration: $DURATION"

.venv/bin/mlx_whisper "$AUDIO" \
  --model "$MODEL" \
  --output-dir "$OUT_DIR" \
  --output-format all \
  --language zh \
  --condition-on-previous-text False \
  --hallucination-silence-threshold 2 \
  --clip-timestamps "0,$DURATION"
