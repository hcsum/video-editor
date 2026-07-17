#!/usr/bin/env python3
"""Convert a timestamp from an older timeline onto the current v4 timeline.

The user's review notes were written while watching different cuts, so a bare
`mm:ss` is ambiguous. This resolves it explicitly instead of re-deriving the
offsets by hand every round.

Usage:
    python3 work/scripts/convert-note-time.py v2 08:23 09:12
    python3 work/scripts/convert-note-time.py v4 666.36     # identity check

Timeline chain:
    v2 -> v4 : opening 0-43.64 removed          (v4 = v2 - 43.64)

The v5 2x speedup was reverted on 2026-07-16, so v4 is current again. If a speed
pass is redone, add the v4 -> v5 step back here and to `work/timeline-map.json`.
"""

import sys

V2_TO_V4_OFFSET = 43.64


def parse(value: str) -> float:
    if ":" in value:
        parts = [float(p) for p in value.split(":")]
        seconds = 0.0
        for part in parts:
            seconds = seconds * 60 + part
        return seconds
    return float(value)


def fmt(seconds: float) -> str:
    if seconds < 0:
        return f"{seconds:.2f}s (在这条时间线上已被剪掉)"
    m, s = divmod(seconds, 60)
    return f"{seconds:8.2f}s  =  {int(m):02d}:{s:05.2f}"


def v2_to_v4(t: float) -> float:
    return t - V2_TO_V4_OFFSET


def to_v4(value: str, timeline: str) -> float:
    t = parse(value)
    if timeline == "v2":
        t = v2_to_v4(t)
    return t


def main() -> None:
    if len(sys.argv) < 3 or sys.argv[1] not in ("v2", "v4"):
        print(__doc__)
        sys.exit(1)

    timeline = sys.argv[1]
    for value in sys.argv[2:]:
        print(f"{timeline} {value:>8}  ->  v4 {fmt(to_v4(value, timeline))}")


if __name__ == "__main__":
    main()
