"""Схемы данных: что пишет автор и что возвращает критик."""

from typing import List, Literal, Optional

from pydantic import BaseModel, Field

Rubric = Literal[
    "palych_ustroilsya",
    "sobesedovanie",
    "ii_novosti",
    "pov_neyroset",
    "tehnika_vosstala",
    "zhizn_podyezda",
]


class TelegramPost(BaseModel):
    rubric: Rubric
    title: str = Field(description="Короткое внутреннее название идеи, для истории и защиты от повторов")
    kind: Literal["text", "poll"]
    text: str = Field(description="Текст поста в HTML-разметке Telegram. Для poll — вводная перед опросом")
    poll_question: Optional[str] = Field(default=None, description="Только для kind=poll, до 300 символов")
    poll_options: Optional[List[str]] = Field(default=None, description="Только для kind=poll, 2–6 вариантов до 100 символов")


class Beat(BaseModel):
    seconds: str = Field(description="Отрезок, например '0-2'")
    visual: str
    speech: Optional[str] = Field(default=None, description="Реплика героя на русском, если есть")
    on_screen_text: Optional[str] = None


class ReelScript(BaseModel):
    rubric: Rubric
    title: str
    hook: str = Field(description="Что зритель видит и слышит в первые 1–2 секунды")
    duration_seconds: int = Field(description="8–20 секунд")
    beats: List[Beat]
    video_prompt_en: str = Field(description="Промпт для видеомодели (Seedance) на английском, 9:16, с описанием героя, камеры и звука")
    caption: str = Field(description="Подпись к ролику с CTA в Telegram")
    cta_codeword: str = Field(description="Кодовое слово для комментариев, например ПАЛЫЧ")
    telegram_followup: str = Field(description="Пост в ТГ «чем всё кончилось» к этому ролику, HTML-разметка Telegram")


class PostBatch(BaseModel):
    items: List[TelegramPost]


class ReelBatch(BaseModel):
    items: List[ReelScript]


class Scores(BaseModel):
    hook: int = Field(description="1–10: цепляет ли первая строка или первые 2 секунды")
    humor: int = Field(description="1–10: насколько реально смешно и абсурдно")
    originality: int = Field(description="1–10: свежесть, нет ли заезженной шутки")
    brand_fit: int = Field(description="1–10: соответствие библии канала и героям")
    retention: int = Field(description="1–10: досмотрят или дочитают ли до конца")
    conversion: int = Field(description="1–10: захочется ли перейти или остаться в Telegram")


class Critique(BaseModel):
    scores: Scores
    overall: float = Field(description="Итоговая оценка 1–10 с одним знаком после запятой")
    safe: bool = Field(description="false, если есть реальные люди или бренды, политика, оскорбления, дезинформация, нарушение правил платформ")
    strongest: str = Field(description="Что лучше всего работает, одним предложением")
    fixes: List[str] = Field(description="Конкретные правки, которые поднимут оценку. Пусто, если правки не нужны")
