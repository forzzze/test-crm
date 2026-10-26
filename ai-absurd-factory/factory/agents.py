"""Два независимых агента: автор пишет, критик оценивает.

Критик не видит рассуждений автора: он получает только готовый пост или сценарий
и библию канала, поэтому оценивает материал так же, как его увидит зритель.
"""

import json
import os
from pathlib import Path
from typing import List, Type, TypeVar

import anthropic
from pydantic import BaseModel

from .models import Critique, PostBatch, ReelBatch, ReelScript, Scores, TelegramPost

MODEL = "claude-opus-5-5"
FALLBACK_BETA = "server-side-fallback-2026-07-01"
BIBLE = (Path(__file__).resolve().parent.parent / "brand" / "bible.md").read_text(encoding="utf-8")

T = TypeVar("T", bound=BaseModel)

WRITER_SYSTEM = f"""Ты главный автор юмористического проекта про ИИ «Нейрон Палыч».
Цель проекта: набирать просмотры в Reels/TikTok и приводить людей в Telegram-канал.
Пиши строго по библии канала ниже. Каждая шутка должна быть смешной для взрослого
русскоязычного зрителя 18–40 лет. Избегай очевидных и заезженных шуток про «ИИ заменит всех».

<bible>
{BIBLE}
</bible>"""

CRITIC_SYSTEM = f"""Ты жёсткий шеф-редактор вирусного юмористического контента.
Ты видел тысячи роликов и постов, и тебя трудно рассмешить. Оцениваешь чужой материал
для проекта «Нейрон Палыч» по библии ниже.

Калибровка оценок:
- 10: разошлют друзьям все, кто увидит; уровень лучших вирусных роликов.
- 8: реально смешно, досмотрят до конца, часть аудитории перейдёт в Telegram. Это минимум для публикации.
- 6: «норм», пролистают без эмоций.
- 4 и ниже: несмешно, вторично или скучно.
Не завышай оценки. Средний черновик заслуживает 5–7, и это нормально.
safe=false ставь, если есть реальные люди, бренды или блогеры, политика, религия,
национальности, мат, пошлость, шутки над трагедиями или правдоподобная дезинформация.

<bible>
{BIBLE}
</bible>"""


class AgentError(RuntimeError):
    pass


def _call(client: anthropic.Anthropic, system: str, prompt: str, schema: Type[T], effort: str) -> T:
    response = client.beta.messages.parse(
        model=MODEL,
        max_tokens=16000,
        system=system,
        messages=[{"role": "user", "content": prompt}],
        output_format=schema,
        output_config={"effort": effort},
        betas=[FALLBACK_BETA],
        fallbacks="default",
    )
    if response.stop_reason == "refusal":
        raise AgentError("Модель отказалась отвечать на запрос")
    if response.parsed_output is None:
        raise AgentError(f"Ответ не прошёл проверку схемы (stop_reason={response.stop_reason})")
    return response.parsed_output


class Writer:
    def __init__(self, client: anthropic.Anthropic):
        self.client = client

    def telegram_posts(self, count: int, recent_titles: List[str]) -> List[TelegramPost]:
        prompt = f"""Напиши {count} разных постов для Telegram-канала.
Чередуй рубрики. Хотя бы один пост сделай голосованием (kind=poll), где подписчики выбирают,
что Палыч сделает в следующей серии.
Не повторяй эти уже опубликованные идеи:
{_bullets(recent_titles)}"""
        return _call(self.client, WRITER_SYSTEM, prompt, PostBatch, effort="high").items

    def reels(self, count: int, recent_titles: List[str]) -> List[ReelScript]:
        prompt = f"""Напиши {count} сценария коротких вертикальных роликов (Reels/TikTok, 8–20 секунд).
Требования:
- Хук в первые 1–2 секунды: странная картинка или фраза, после которой невозможно пролистать.
- Один поворот сюжета и финал, после которого хочется пересмотреть (петля) или узнать продолжение.
- Ролик снимается одним-тремя кадрами видеомодели: не больше 3 локаций, герои из библии.
- video_prompt_en: подробный промпт на английском, 9:16, внешность Палыча из библии, камера, свет, звук и реплики (реплики на русском в кавычках).
- telegram_followup раскрывает, чем всё кончилось, и даёт промпт ролика, чтобы переход в ТГ был оправдан.
Не повторяй эти идеи:
{_bullets(recent_titles)}"""
        return _call(self.client, WRITER_SYSTEM, prompt, ReelBatch, effort="high").items

    def revise(self, item: T, critique: Critique) -> T:
        prompt = f"""Критик оценил твой материал на {critique.overall}/10. Для публикации нужно не меньше 8.
Перепиши материал, учтя правки. Можно менять шутку целиком, если она слабая.
Сохрани формат и рубрику.

<material>
{item.model_dump_json(indent=2)}
</material>

<critique>
{critique.model_dump_json(indent=2)}
</critique>"""
        return _call(self.client, WRITER_SYSTEM, prompt, type(item), effort="high")


class Critic:
    """Несколько независимых оценок одного материала.

    Один критик шумит: на пробном прогоне один и тот же пост получил 7.7 и 6.3.
    Поэтому оценки усредняются, а safe=false от любого критика блокирует публикацию.
    """

    def __init__(self, client: anthropic.Anthropic):
        self.client = client
        self.votes = int(os.environ.get("CRITIC_VOTES", "2"))

    def review(self, item: BaseModel) -> Critique:
        kind = "сценарий ролика для Reels/TikTok" if isinstance(item, ReelScript) else "пост для Telegram-канала"
        prompt = f"""Оцени {kind}. Представь, что ты обычный зритель в ленте, а потом редактор.

<material>
{json.dumps(item.model_dump(), ensure_ascii=False, indent=2)}
</material>"""
        return combine([_call(self.client, CRITIC_SYSTEM, prompt, Critique, effort="high") for _ in range(self.votes)])


def combine(critiques: List[Critique]) -> Critique:
    if len(critiques) == 1:
        return critiques[0]
    n = len(critiques)
    scores = {k: round(sum(getattr(c.scores, k) for c in critiques) / n) for k in Scores.model_fields}
    return Critique(
        scores=Scores(**scores),
        overall=round(sum(c.overall for c in critiques) / n, 1),
        safe=all(c.safe for c in critiques),
        strongest=critiques[0].strongest,
        fixes=[fix for c in critiques for fix in c.fixes],
    )


def _bullets(titles: List[str]) -> str:
    return "\n".join(f"- {t}" for t in titles) if titles else "- (пока ничего)"
