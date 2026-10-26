"""Проверка конвейера без сети: SDK отвечает через подменённый HTTP-транспорт."""

import json

import anthropic
import httpx2 as httpx
import pytest

from factory import run, store
from factory.models import Critique, TelegramPost

POST = {
    "rubric": "palych_ustroilsya", "title": "Палыч — тамада", "kind": "text",
    "text": "<b>Палыч провёл свадьбу.</b> Конкурс «найди жениха» длился 4 часа.",
    "poll_question": None, "poll_options": None,
}


def critique(overall, safe=True, low=8):
    return {
        "scores": {"hook": low, "humor": 9, "originality": 8, "brand_fit": 9, "retention": 8, "conversion": 8},
        "overall": overall, "safe": safe, "strongest": "финал", "fixes": [] if overall >= 8 else ["усилить хук"],
    }


def fake_client(replies, seen):
    """Каждый запрос получает следующий JSON из replies как текст ответа модели."""
    queue = list(replies)

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(json.loads(request.content))
        body = {
            "id": "msg_1", "type": "message", "role": "assistant", "model": "claude-opus-5-5",
            "content": [{"type": "text", "text": json.dumps(queue.pop(0), ensure_ascii=False)}],
            "stop_reason": "end_turn", "stop_sequence": None,
            "usage": {"input_tokens": 1, "output_tokens": 1},
        }
        return httpx.Response(200, json=body)

    return anthropic.Anthropic(api_key="test", http_client=httpx.Client(transport=httpx.MockTransport(handler)))


@pytest.fixture(autouse=True)
def tmp_store(tmp_path, monkeypatch):
    monkeypatch.setenv("CRITIC_VOTES", "1")
    monkeypatch.setattr(store, "POST_QUEUE", tmp_path / "q.jsonl")
    monkeypatch.setattr(store, "PUBLISHED", tmp_path / "p.jsonl")
    monkeypatch.setattr(store, "REJECTED", tmp_path / "r.jsonl")
    monkeypatch.setattr(store, "REELS", tmp_path / "reels")


def test_strong_post_goes_to_queue_and_request_shape():
    seen = []
    client = fake_client([{"items": [POST]}, critique(8.6)], seen)
    assert run.generate("posts", 1, client) == 1
    assert store.queued_posts()[0]["critique"]["overall"] == 8.6
    request = seen[0]
    assert request["model"] == "claude-opus-5-5"
    assert request["fallbacks"] == "default"
    assert request["output_config"]["effort"] == "high"
    assert request["output_config"]["format"]["type"] == "json_schema"


def test_weak_post_is_revised_then_approved():
    seen = []
    revised = {**POST, "title": "Палыч — тамада v2"}
    client = fake_client([{"items": [POST]}, critique(6.5), revised, critique(8.2)], seen)
    assert run.generate("posts", 1, client) == 1
    assert store.queued_posts()[0]["item"]["title"] == "Палыч — тамада v2"
    assert len(seen) == 4


def test_post_rejected_after_max_revisions():
    seen = []
    client = fake_client([{"items": [POST]}, critique(6), POST, critique(7), POST, critique(7.5)], seen)
    assert run.generate("posts", 1, client) == 0
    assert store.queued_posts() == []
    assert len(store._read(store.REJECTED)) == 1


def test_unsafe_post_never_revised_or_published():
    seen = []
    client = fake_client([{"items": [POST]}, critique(9.5, safe=False)], seen)
    assert run.generate("posts", 1, client) == 0
    assert len(seen) == 2


def test_high_overall_with_weak_criterion_is_rejected():
    assert not run.approved(Critique(**critique(8.5, low=5)))
    assert run.approved(Critique(**critique(8.0)))


def test_publish_takes_best_post_first():
    store.queue_post(TelegramPost(**{**POST, "title": "слабее"}), Critique(**critique(8.1)))
    store.queue_post(TelegramPost(**{**POST, "title": "лучше"}), Critique(**critique(9.0)))
    assert run.publish(1, telegram=None) == 1
    assert [r["item"]["title"] for r in store.queued_posts()] == ["слабее"]
    assert store._read(store.PUBLISHED)[0]["item"]["title"] == "лучше"


def test_two_critics_are_averaged_and_any_unsafe_blocks():
    from factory.agents import combine

    merged = combine([Critique(**critique(8.4)), Critique(**critique(7.4))])
    assert merged.overall == 7.9
    assert not run.approved(merged)
    assert not combine([Critique(**critique(9.0)), Critique(**critique(9.0, safe=False))]).safe


def test_default_critic_asks_two_independent_reviews(monkeypatch):
    monkeypatch.delenv("CRITIC_VOTES")
    seen = []
    client = fake_client([{"items": [POST]}, critique(8.6), critique(8.2)], seen)
    assert run.generate("posts", 1, client) == 1
    assert store.queued_posts()[0]["critique"]["overall"] == 8.4
    assert len(seen) == 3
