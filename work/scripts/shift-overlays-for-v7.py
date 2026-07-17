#!/usr/bin/env python3
"""Remap overlay timings from the v4 timeline onto v7.

Same piecewise-linear map as shift-subtitles-for-v7.py. Every numeric field named
in TIME_KEYS is remapped wherever it appears, at any depth, so per-step reveals
(summary's `revealAt`) move with their card.

The title card starts at v4 0.40, inside the 1.02s the opening trim removes, so it
clamps to 0 and simply opens the video.

`speed` overlays are the only ones allowed to span the sped range -- marking it is
their whole job -- so their times are compressed through the speed map. For every
other type a time landing in that range means a card would be silently squished,
which is a mistake worth stopping on, so the script raises instead.
"""

import json
from pathlib import Path

TRIM_START = 1.02
SPEED_START = 420.0
SPEED_END = 507.291667
SPEED_FACTOR = 5.0

SPED_SAVED = (SPEED_END - SPEED_START) - (SPEED_END - SPEED_START) / SPEED_FACTOR
TOTAL_SAVED = TRIM_START + SPED_SAVED

TIME_KEYS = {
    "start",
    "end",
    "revealAt",
    "highlightAt",
    "appearAt",
    "namedAt",
    "hideAt",
}

SRC = Path("work/overlays/overlays-v1.json")
DST = Path("work/overlays/overlays-v3.json")


def remap(t: float, overlay_id: str, allow_sped: bool) -> float:
    if t < TRIM_START:
        return 0.0
    if t < SPEED_START:
        return round(t - TRIM_START, 3)
    if t < SPEED_END:
        if not allow_sped:
            raise SystemExit(
                f"overlay {overlay_id!r} has time {t} inside the sped range "
                f"{SPEED_START}-{SPEED_END}; decide explicitly whether to "
                "compress or drop it"
            )
        return round((SPEED_START - TRIM_START) + (t - SPEED_START) / SPEED_FACTOR, 3)
    return round(t - TOTAL_SAVED, 3)


def walk(node, overlay_id, allow_sped, moved):
    if isinstance(node, dict):
        out = {}
        for k, v in node.items():
            if k in TIME_KEYS and isinstance(v, (int, float)):
                new = remap(v, overlay_id, allow_sped)
                moved.append((v, new))
                out[k] = new
            else:
                out[k] = walk(v, overlay_id, allow_sped, moved)
        return out
    if isinstance(node, list):
        return [walk(v, overlay_id, allow_sped, moved) for v in node]
    return node


def main() -> None:
    data = json.loads(SRC.read_text())

    out_overlays = []
    for overlay in data["overlays"]:
        overlay_id = overlay.get("id", "<unnamed>")
        allow_sped = overlay.get("type") == "speed"
        moved = []
        out_overlays.append(walk(overlay, overlay_id, allow_sped, moved))
        spans = "  ".join(f"{a:.2f}->{b:.2f}" for a, b in moved)
        print(f"{overlay_id:18} {spans}")

    data["overlays"] = out_overlays
    data["timeline"] = "v7"
    DST.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"\n{len(out_overlays)} overlays -> {DST}")


if __name__ == "__main__":
    main()
