#!/usr/bin/env python3
"""List subtitle gaps, so a destructive cut or speed change lands in silence.

Cutting mid-sentence sounds wrong — the first half plays at 1x and the second at
2x. Boundaries belong in the gaps between subtitles. This prints them so a range
can be picked without guessing.

Usage:
    python3 work/scripts/find-subtitle-gaps.py 440 540        # gaps in a range
    python3 work/scripts/find-subtitle-gaps.py 440 540 --min 2

Times are on the current v4 timeline, matching Remotion Studio.
"""

import argparse
import json
from pathlib import Path

SUBS = Path("work/subtitles/base-cut-v4-audio-light-v1-clean-v1.json")


def fmt(seconds: float) -> str:
    m, s = divmod(seconds, 60)
    return f"{int(m):02d}:{s:05.2f}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("start", type=float)
    parser.add_argument("end", type=float)
    parser.add_argument("--min", type=float, default=1.0, help="最小空隙秒数")
    args = parser.parse_args()

    subs = json.loads(SUBS.read_text())["subtitles"]
    window = [s for s in subs if s["end"] > args.start and s["start"] < args.end]

    if not window:
        print("这个区间没有字幕。")
        return

    print(f"{args.start:.2f}-{args.end:.2f}s 区间内的字幕与空隙：\n")

    previous = None
    for sub in window:
        if previous is not None:
            gap = sub["start"] - previous["end"]
            if gap >= args.min:
                print(
                    f"  >>> 空隙 {gap:5.2f}s  "
                    f"[{previous['end']:7.2f} → {sub['start']:7.2f}]  "
                    f"({fmt(previous['end'])} → {fmt(sub['start'])})   ← 可以在这里切"
                )
        length = sub["end"] - sub["start"]
        flag = "  ⚠️ 这句很长，别从中间切" if length > 15 else ""
        print(f"      {sub['start']:7.2f}-{sub['end']:7.2f} ({length:5.2f}s) {sub['text'][:34]}{flag}")
        previous = sub

    print(
        "\n提示：把加速/剪辑的起止点放在 '>>> 空隙' 的区间内，"
        "整句才不会被切成一半原速一半变速。"
    )


if __name__ == "__main__":
    main()
