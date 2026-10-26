"""Оркестратор: автор → критик → правки → публикация только при оценке ≥ порога.

Запуск:
    python -m factory.run tick                # то, что делает расписание: пополнить очередь и опубликовать 1 пост
    python -m factory.run generate posts 6    # написать и проверить 6 постов в очередь
    python -m factory.run generate reels 2    # написать и проверить 2 сценария роликов
    python -m factory.run publish 1           # опубликовать лучший пост из очереди
    python -m factory.run status              # что в очереди
"""

import argparse
import os
import sys
from typing import Optional, Tuple

import anthropic

from . import store
from .agents import Critic, Writer
from .models import Critique, TelegramPost
from .telegram import Telegram

THRESHOLD = float(os.environ.get("APPROVE_THRESHOLD", "8"))
MIN_CRITERION = 6
MAX_REVISIONS = 2
QUEUE_TARGET = 3


def approved(critique: Critique) -> bool:
    lowest = min(critique.scores.model_dump().values())
    return critique.safe and critique.overall >= THRESHOLD and lowest >= MIN_CRITERION


def refine(item, writer: Writer, critic: Critic) -> Tuple[object, Critique, bool]:
    critique = critic.review(item)
    log(f"  «{item.title}»: {critique.overall}/10")
    for _ in range(MAX_REVISIONS):
        if approved(critique) or not critique.safe:
            break
        item = writer.revise(item, critique)
        critique = critic.review(item)
        log(f"  правка «{item.title}»: {critique.overall}/10")
    return item, critique, approved(critique)


def generate(kind: str, count: int, client: anthropic.Anthropic) -> int:
    writer, critic = Writer(client), Critic(client)
    recent = store.recent_titles()
    drafts = writer.telegram_posts(count, recent) if kind == "posts" else writer.reels(count, recent)
    log(f"Автор написал {len(drafts)} ({kind}), отдаю критику")
    passed = 0
    for draft in drafts:
        item, critique, ok = refine(draft, writer, critic)
        if not ok:
            store.reject(item, critique)
            log(f"  ✗ отклонено: {critique.overall}/10, safe={critique.safe}")
            continue
        passed += 1
        if kind == "posts":
            store.queue_post(item, critique)
            log(f"  ✓ в очередь: {critique.overall}/10")
        else:
            log(f"  ✓ сценарий сохранён: {store.save_reel(item, critique).name}")
    return passed


def publish(count: int, telegram: Optional[Telegram]) -> int:
    done = 0
    for _ in range(count):
        if not store.queued_posts():
            log("Очередь пуста, публиковать нечего")
            break
        record = store.pop_post()
        if telegram is None:
            log(f"[dry-run] опубликовал бы «{record['item']['title']}» ({record['critique']['overall']}/10):\n{record['item']['text']}")
            store.mark_published(record, message_id=0)
        else:
            message_id = telegram.publish_post(TelegramPost(**record["item"]))
            store.mark_published(record, message_id)
            log(f"Опубликовано «{record['item']['title']}» → message_id={message_id}")
        done += 1
    return done


def telegram_from_env(dry_run: bool) -> Optional[Telegram]:
    if dry_run:
        return None
    token, channel = os.environ.get("TELEGRAM_BOT_TOKEN"), os.environ.get("TELEGRAM_CHANNEL")
    if not token or not channel:
        sys.exit("Нужны TELEGRAM_BOT_TOKEN и TELEGRAM_CHANNEL (например @neyron_palych), либо флаг --dry-run")
    return Telegram(token, channel)


def log(message: str) -> None:
    print(message, flush=True)


def main() -> None:
    parser = argparse.ArgumentParser(prog="factory")
    parser.add_argument("--dry-run", action="store_true", help="ничего не публиковать в Telegram")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("tick")
    gen = sub.add_parser("generate")
    gen.add_argument("kind", choices=["posts", "reels"])
    gen.add_argument("count", type=int)
    pub = sub.add_parser("publish")
    pub.add_argument("count", type=int, nargs="?", default=1)
    sub.add_parser("status")
    args = parser.parse_args()

    if args.command == "status":
        for r in store.queued_posts():
            log(f"{r['critique']['overall']}/10  {r['item']['title']}")
        log(f"Постов в очереди: {len(store.queued_posts())}, сценариев роликов: {len(list(store.REELS.glob('*.json')))}")
        return

    if args.command == "publish":
        publish(args.count, telegram_from_env(args.dry_run))
        return

    client = anthropic.Anthropic()
    if args.command == "generate":
        generate(args.kind, args.count, client)
        return

    # tick: держим запас из QUEUE_TARGET одобренных постов и публикуем один.
    telegram = telegram_from_env(args.dry_run)
    if len(store.queued_posts()) < QUEUE_TARGET:
        generate("posts", 6, client)
        generate("reels", 2, client)
    publish(1, telegram)


if __name__ == "__main__":
    main()
