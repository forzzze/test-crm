# NovaMed CRM — тестовый MVP

Главный экран внутренней CRM частного медицинского центра. Проект собран на React 19, Vite, TypeScript, Recharts и Lucide React; все данные локальные.

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

Импортируйте репозиторий в Vercel. Framework Preset — Vite, Build Command — `npm run build`, Output Directory — `dist`. Переменные окружения не нужны.
