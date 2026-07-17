#!/usr/bin/env python3
import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
IN_TSV = ROOT / "work/transcripts/mlx/base-cut-v2-audio-light-v1/base-cut-v2-audio-light-v1.tsv"
OUT_DIR = ROOT / "work/subtitles"
BASENAME = "base-cut-v2-audio-light-v1-clean-v1"

DROP_EXACT = {
    "嗯",
    "啊",
    "哦",
    "呃",
    "之类的",
    "然后",
    "然后呢",
    "skip",
}

REPLACEMENTS = {
    "clawdex": "Codex",
    "Claudedex": "Codex",
    "AI agent": "AI Agent",
    "agent": "Agent",
    "OpenClaw": "Claude Code",
    "openclaw": "Claude Code",
    "claw code": "Claude Code",
    "Claw Code": "Claude Code",
    "claw": "Claude",
    "Claw": "Claude",
    "opencode": "OpenCode",
    "dipsick": "DeepSeek",
    "質譜": "智谱",
    "质谱": "智谱",
    "minimax": "MiniMax",
    "kimi": "Kimi",
    "小龙叔": "小红书",
    "Ulan窗口": "浏览器窗口",
    "新绘画": "新对话",
}

TRAD_TO_SIMP = str.maketrans(
    {
        "這": "这",
        "個": "个",
        "對": "对",
        "們": "们",
        "邊": "边",
        "挺": "挺",
        "然": "然",
        "後": "后",
        "錢": "钱",
        "幾": "几",
        "塊": "块",
        "買": "买",
        "課": "课",
        "問": "问",
        "究": "究",
        "竟": "竟",
        "麼": "么",
        "類": "类",
        "訊": "讯",
        "裡": "里",
        "網": "网",
        "頁": "页",
        "終": "终",
        "於": "于",
        "剛": "刚",
        "閃": "闪",
        "過": "过",
        "筆": "笔",
        "記": "记",
        "給": "给",
        "關": "关",
        "調": "调",
        "研": "研",
        "門": "门",
        "檻": "槛",
        "續": "续",
        "簽": "签",
        "會": "会",
        "間": "间",
        "繪": "对",
        "畫": "话",
        "開": "开",
        "穩": "稳",
        "應": "应",
        "構": "构",
        "帶": "带",
        "壞": "坏",
        "樣": "样",
    }
)


def normalize_text(text: str) -> str:
    text = text.strip().translate(TRAD_TO_SIMP)
    for src, dst in REPLACEMENTS.items():
        text = text.replace(src, dst)
    text = text.replace(" ,", "，").replace(",", "，")
    return text.strip()


def fmt_srt_time(ms: int) -> str:
    hours = ms // 3_600_000
    ms %= 3_600_000
    minutes = ms // 60_000
    ms %= 60_000
    seconds = ms // 1_000
    millis = ms % 1_000
    return f"{hours:02}:{minutes:02}:{seconds:02},{millis:03}"


def fmt_vtt_time(ms: int) -> str:
    return fmt_srt_time(ms).replace(",", ".")


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
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    subtitles = []
    with IN_TSV.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            text = normalize_text(row["text"])
            if not text or text in DROP_EXACT:
                continue
            subtitles.append(
                {
                    "start": int(row["start"]) / 1000,
                    "end": int(row["end"]) / 1000,
                    "text": text,
                }
            )

    json_path = OUT_DIR / f"{BASENAME}.json"
    srt_path = OUT_DIR / f"{BASENAME}.srt"
    vtt_path = OUT_DIR / f"{BASENAME}.vtt"

    json_path.write_text(
        json.dumps(
            {
                "version": 1,
                "timeline": "edited",
                "sourceTranscript": str(IN_TSV.relative_to(ROOT)),
                "subtitles": subtitles,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    srt_blocks = []
    for i, item in enumerate(subtitles, 1):
        start = fmt_srt_time(round(item["start"] * 1000))
        end = fmt_srt_time(round(item["end"] * 1000))
        text = split_subtitle_text(item["text"])
        srt_blocks.append(f"{i}\n{start} --> {end}\n{text}")
    srt_path.write_text("\n\n".join(srt_blocks) + "\n", encoding="utf-8")

    vtt_blocks = ["WEBVTT\n"]
    for item in subtitles:
        start = fmt_vtt_time(round(item["start"] * 1000))
        end = fmt_vtt_time(round(item["end"] * 1000))
        text = split_subtitle_text(item["text"])
        vtt_blocks.append(f"{start} --> {end}\n{text}")
    vtt_path.write_text("\n\n".join(vtt_blocks) + "\n", encoding="utf-8")

    print(f"wrote {json_path.relative_to(ROOT)}")
    print(f"wrote {srt_path.relative_to(ROOT)}")
    print(f"wrote {vtt_path.relative_to(ROOT)}")
    print(f"subtitles: {len(subtitles)}")


if __name__ == "__main__":
    main()
