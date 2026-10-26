"""Публикация в Telegram-канал через Bot API."""

import json
from pathlib import Path
from typing import Optional

import requests

from .models import TelegramPost

API = "https://api.telegram.org/bot{token}/{method}"


class TelegramError(RuntimeError):
    pass


class Telegram:
    def __init__(self, token: str, channel: str):
        self.token = token
        self.channel = channel

    def _request(self, method: str, data: dict, files: Optional[dict] = None) -> dict:
        response = requests.post(API.format(token=self.token, method=method), data=data, files=files, timeout=120)
        payload = response.json()
        if not payload.get("ok"):
            raise TelegramError(f"{method}: {payload.get('description', response.text)}")
        return payload["result"]

    def publish_post(self, post: TelegramPost) -> int:
        message = self._request("sendMessage", {
            "chat_id": self.channel,
            "text": post.text,
            "parse_mode": "HTML",
            "link_preview_options": '{"is_disabled": true}',
        })
        if post.kind == "poll" and post.poll_question and post.poll_options:
            self._request("sendPoll", {
                "chat_id": self.channel,
                "question": post.poll_question[:300],
                "options": _json_list([o[:100] for o in post.poll_options[:10]]),
                "is_anonymous": "true",
            })
        return message["message_id"]

    def publish_video(self, path: Path, caption: str) -> int:
        with path.open("rb") as video:
            message = self._request(
                "sendVideo",
                {"chat_id": self.channel, "caption": caption[:1024], "parse_mode": "HTML", "supports_streaming": "true"},
                files={"video": video},
            )
        return message["message_id"]


def _json_list(items):
    return json.dumps([{"text": item} for item in items], ensure_ascii=False)
