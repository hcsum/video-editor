#!/usr/bin/env python3
"""Remap v4 subtitle timings onto the v7 timeline.

v7 applies two edits to v4 in a single pass:

  1. drop the leading `其实` (v4 `0 - 1.02`)
  2. speed up [SPEED_START, SPEED_END) by 5x with its audio silenced

Subtitles inside the sped range are dropped rather than compressed, since that
stretch is mute. Everything after it moves earlier by the total saved duration.

One line needs repair before remapping: the opening leads with `其实`, which v7
cuts. Its text loses the word and its start moves to the measured onset of the
next word (v4 1.24 -> v7 0.22).

The v4 transcript used to carry a 28s line at `496.88-524.88` that this script
special-cased, because Whisper had merged a 6.7s silence into its head and the
bogus start would have dropped it into the sped range. That line has since been
re-transcribed from just its audible window and split into six, so the fix-up is
gone. Don't reintroduce a start earlier than SPEED_END for it — see
`work/render-log.md`.
"""

import json
from pathlib import Path

TRIM_START = 1.02
SPEED_START = 420.0
SPEED_END = 507.291667  # 08:27:07 on the user's 24fps DaVinci timeline
SPEED_FACTOR = 5.0

SPED_SAVED = (SPEED_END - SPEED_START) - (SPEED_END - SPEED_START) / SPEED_FACTOR
TOTAL_SAVED = TRIM_START + SPED_SAVED

# (start, end) -> (new v4 start, text with the cut word removed)
#
# Keyed on the line's exact v4 timing, so re-splitting the opening line breaks
# the match. That must not fail quietly: v7 cuts 其实 out of the audio, and a
# subtitle still claiming it would caption a word nobody says. main() asserts
# this fired.
OPENING = {(0, 3.16): (1.24, "我真正用AI Agent")}

SRC = Path("work/subtitles/base-cut-v4-audio-light-v1-clean-v1.json")
DST_STEM = Path("work/subtitles/base-cut-v7-audio-light-v1-clean-v1")


def remap(t: float) -> float:
    if t < TRIM_START:
        return 0.0
    if t < SPEED_START:
        return t - TRIM_START
    if t < SPEED_END:
        return (SPEED_START - TRIM_START) + (t - SPEED_START) / SPEED_FACTOR
    return t - TOTAL_SAVED


def timestamp(seconds: float, sep: str) -> str:
    ms = round(seconds * 1000)
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}{sep}{ms:03d}"


def main() -> None:
    data = json.loads(SRC.read_text())

    subs = []
    dropped = []
    notes = []
    opening_applied = 0
    for s in data["subtitles"]:
        start, end, text = s["start"], s["end"], s["text"]

        opening = OPENING.get((start, end))
        if opening is not None:
            new_start, new_text = opening
            notes.append(f"opening  {start:.2f} -> {new_start:.2f}  {text!r} -> {new_text!r}")
            start, text = new_start, new_text
            opening_applied += 1

        if start < SPEED_END and end > SPEED_START:
            dropped.append((start, end, text))
            continue

        subs.append(
            {
                "start": round(remap(start), 3),
                "end": round(remap(end), 3),
                "text": text,
            }
        )

    if opening_applied != len(OPENING):
        raise SystemExit(
            f"OPENING matched {opening_applied} of {len(OPENING)} lines. The v4 "
            "transcript was re-split, so the keys are stale — without a match, "
            "其实 stays in the subtitles while v7 cuts it from the audio. Update "
            "OPENING to the opening line's current (start, end)."
        )

    data["subtitles"] = subs
    data["timeline"] = "v7"
    data["source"] = "work/base-cut-v7-audio-light-v1.mp4"
    data["offsetRemovedSeconds"] = TOTAL_SAVED
    DST_STEM.with_suffix(".json").write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    )

    srt = "\n".join(
        f"{i}\n{timestamp(s['start'], ',')} --> {timestamp(s['end'], ',')}\n{s['text']}\n"
        for i, s in enumerate(subs, 1)
    )
    DST_STEM.with_suffix(".srt").write_text(srt)

    vtt = "WEBVTT\n\n" + "\n".join(
        f"{timestamp(s['start'], '.')} --> {timestamp(s['end'], '.')}\n{s['text']}\n"
        for s in subs
    )
    DST_STEM.with_suffix(".vtt").write_text(vtt)

    for note in notes:
        print(note)
    print(f"dropped {len(dropped)} subtitles inside {SPEED_START}-{SPEED_END}")
    print(f"{len(subs)} kept, saved {TOTAL_SAVED:.3f}s total")
    print(f"first: {subs[0]['start']:.2f}-{subs[0]['end']:.2f}  {subs[0]['text']}")
    print(f"last end {subs[-1]['end']:.2f}s")


if __name__ == "__main__":
    main()
