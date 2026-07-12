# NovaMed CRM — тестовый MVP

Главный экран внутренней CRM частного медицинского центра. Проект собран на React 19, Vite, TypeScript, Recharts и Lucide React; все данные локальные.

**Production:** [novamed-crm.vercel.app](https://novamed-crm.vercel.app)

**Репозиторий:** [github.com/forzzze/test-tz](https://github.com/forzzze/test-tz)

## Возможности

- адаптивный dashboard для desktop и mobile;
- KPI и график с данными для дня, недели и месяца;
- фильтрация записей по имени пациента;
- таблица на desktop и карточки записей на mobile;
- доступный drawer записи: Escape, overlay, focus trap и возврат фокуса;
- адаптивное меню с блокировкой прокрутки;
- уведомления, статусы, загрузка врачей и полезное напоминание;
- видимые hover/focus-состояния и `prefers-reduced-motion`.

## Запуск

```bash
npm install
npm run dev
```

Проверки:

```bash
npm run lint
npm run typecheck
npm run build
npm run preview
```

## Публикация на Vercel

Проект опубликован на Vercel: [https://novamed-crm.vercel.app](https://novamed-crm.vercel.app).

Для повторного развёртывания: Framework Preset — Vite, Build Command — `npm run build`, Output Directory — `dist`. Переменные окружения не нужны.

## Визуальные решения

Холодный светлый фон отделяет рабочую область от белых функциональных поверхностей. Синий медицинский акцент используется дозированно: для активной навигации, ключевых данных и интерактивных состояний. Компактная модульная сетка, приглушённые статусы и табличная типографика рассчитаны на ежедневную работу администратора. На мобильных устройствах таблица заменяется карточками, а навигация — доступным выезжающим меню.

Ориентировочное время разработки MVP: около 10 часов.
