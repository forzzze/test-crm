"""Хранилище в файлах репозитория: очередь, история и отклонённые идеи.

Файлы коммитятся обратно в репозиторий после каждого запуска, поэтому история
переживает перезапуски и защищает от повторов.
"""

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import List

from .models import Critique, ReelScript, TelegramPost

DATA = Path(__file__).resolve().parent.parent / "data"
POST_QUEUE = DATA / "post_queue.jsonl"
PUBLISHED = DATA / "published.jsonl"
REJECTED = DATA / "rejected.jsonl"
REELS = DATA / "reels"


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _read(path: Path) -> List[dict]:
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def _append(path: Path, record: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")


def recent_titles(limit: int = 60) -> List[str]:
    titles = [r["item"]["title"] for r in _read(PUBLISHED) + _read(POST_QUEUE) + _read(REJECTED)]
    titles += [json.loads(p.read_text(encoding="utf-8"))["item"]["title"] for p in sorted(REELS.glob("*.json"))]
    return titles[-limit:]


def queue_post(post: TelegramPost, critique: Critique) -> None:
    _append(POST_QUEUE, {"queued_at": now(), "item": post.model_dump(), "critique": critique.model_dump()})


def queued_posts() -> List[dict]:
    return _read(POST_QUEUE)


def pop_post() -> dict:
    records = _read(POST_QUEUE)
    if not records:
        raise IndexError("Очередь постов пуста")
    # Сначала публикуем лучшие по оценке критика, при равенстве — более старые.
    best = max(range(len(records)), key=lambda i: (records[i]["critique"]["overall"], -i))
    record = records.pop(best)
    POST_QUEUE.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in records), encoding="utf-8")
    return record


def mark_published(record: dict, message_id: int) -> None:
    _append(PUBLISHED, {**record, "published_at": now(), "message_id": message_id})


def reject(item, critique: Critique) -> None:
    _append(REJECTED, {"rejected_at": now(), "item": item.model_dump(), "critique": critique.model_dump()})


def save_reel(reel: ReelScript, critique: Critique) -> Path:
    REELS.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r"[^a-zа-яё0-9]+", "-", reel.title.lower()).strip("-")[:40]
    path = REELS / f"{datetime.now(timezone.utc):%Y%m%d-%H%M}-{slug}.json"
    record = {"status": "script_approved", "created_at": now(), "item": reel.model_dump(), "critique": critique.model_dump()}
    path.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
    return path
