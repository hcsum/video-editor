#!/usr/bin/env python3
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "work/subtitles/base-cut-v2-audio-light-v1-clean-v1.json"
OUT_DIR = ROOT / "work/subtitles"
BASENAME = "base-cut-v3-audio-light-v1-clean-v1"
OFFSET = 43.0


def fmt_srt_time(seconds: float) -> str:
    ms = round(seconds * 1000)
    hours = ms // 3_600_000
    ms %= 3_600_000
    minutes = ms // 60_000
    ms %= 60_000
    secs = ms // 1_000
    millis = ms % 1_000
    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"


def fmt_vtt_time(seconds: float) -> str:
    return fmt_srt_time(seconds).replace(",", ".")


def split_subtitle_text(text: str) -> str:
    if len(text) <= 24:
        return text
    break_chars = "，。！？、"
    midpoint = len(text) // 2
    candidates = [i for i, ch in enumerate(text) if ch in break_chars]
    if not candidates:
        return text
    split_at = min(candidates, key=lambda i: abs(i - midpoint)) + 1
    left = text[:split_at].strip()
    right = text[split_at:].strip()
    if not left or not right:
        return text
    return f"{left}\n{right}"


def main() -> None:
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    shifted = []

    for item in data["subtitles"]:
        if item["end"] <= OFFSET:
            continue
        start = max(0, item["start"] - OFFSET)
        end = item["end"] - OFFSET
        if end <= 0:
            continue
        shifted.append(
            {
                "start": round(start, 3),
                "end": round(end, 3),
                "text": item["text"],
            }
        )

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    json_path = OUT_DIR / f"{BASENAME}.json"
    srt_path = OUT_DIR / f"{BASENAME}.srt"
    vtt_path = OUT_DIR / f"{BASENAME}.vtt"

    json_path.write_text(
        json.dumps(
            {
                "version": 1,
                "timeline": "edited",
                "sourceTranscript": str(SOURCE.relative_to(ROOT)),
                "offsetRemovedSeconds": OFFSET,
                "subtitles": shifted,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    srt_blocks = []
    for index, item in enumerate(shifted, 1):
        srt_blocks.append(
            "\n".join(
                [
                    str(index),
                    f"{fmt_srt_time(item['start'])} --> {fmt_srt_time(item['end'])}",
                    split_subtitle_text(item["text"]),
                ]
            )
        )
    srt_path.write_text("\n\n".join(srt_blocks) + "\n", encoding="utf-8")

    vtt_blocks = ["WEBVTT\n"]
    for item in shifted:
        vtt_blocks.append(
            "\n".join(
                [
                    f"{fmt_vtt_time(item['start'])} --> {fmt_vtt_time(item['end'])}",
                    split_subtitle_text(item["text"]),
                ]
            )
        )
    vtt_path.write_text("\n\n".join(vtt_blocks) + "\n", encoding="utf-8")

    print(f"wrote {json_path.relative_to(ROOT)}")
    print(f"wrote {srt_path.relative_to(ROOT)}")
    print(f"wrote {vtt_path.relative_to(ROOT)}")
    print(f"subtitles: {len(shifted)}")
    print(f"first: {shifted[0] if shifted else None}")
    print(f"last: {shifted[-1] if shifted else None}")


if __name__ == "__main__":
    main()
