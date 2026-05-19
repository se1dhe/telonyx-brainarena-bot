# Brain Arena Bot

Brain Arena — Telegram-first quiz-trivia продукт в римской эстетике: Telegram Bot + Telegram Mini App + backend + PvP/ranked/seasons.

Проект строится не как обычная викторина, а как интеллектуальная арена с ежедневными ритуалами, главами, картой прогресса, асинхронными дуэлями, рейтингами, сезонами и честной Telegram Stars монетизацией без pay-to-win.

## Current Status

Репозиторий уже переведён в Railway-friendly monorepo.

Актуальная структура:

```text
apps/
  webapp/      # React/Vite Telegram Mini App
  api/         # Spring Boot Backend API
  bot/         # Telegram Bot entrypoint

packages/
  common/
  domain/
  persistence/
  security/
  integration/
  analytics/

infra/
  docker/

docs/
  architecture/
  deployment/
  product/
```

Legacy frontend из корня удалён. Frontend теперь живёт только в:

```text
apps/webapp
```

Подробный статус реализации смотри здесь:

- [`docs/architecture/IMPLEMENTATION_STATUS.md`](./docs/architecture/IMPLEMENTATION_STATUS.md)
- [`docs/architecture/PROJECT_ARCHITECTURE.md`](./docs/architecture/PROJECT_ARCHITECTURE.md)
- [`docs/deployment/RAILWAY.md`](./docs/deployment/RAILWAY.md)

## Product Vision

Brain Arena должен давать пользователю ощущение личной империи знаний:

- быстрый вход в игру за 30–90 секунд;
- ежедневный ритуал на 3–7 вопросов;
- главы и карта прохождения;
- асинхронные PvP-вызовы через Telegram;
- ranked arena;
- сезоны и лидерборды;
- прогресс по категориям;
- личная библиотека ошибок и терминов;
- премиальный светлый Roman UI;
- монетизация без pay-to-win.

## Core Docs

Перед разработкой обязательно читать:

- [`SKILLS.md`](./SKILLS.md) — архитектура навыков продукта: Temple, Codex, Archivarius, Caesar, Archimedes.
- [`AGENTS.md`](./AGENTS.md) — инструкция для coding agents.
- [`PROMT.md`](./PROMT.md) — основной implementation prompt.
- [`ROADMAP.md`](./ROADMAP.md) — план разработки.
- [`docs/product/CHAPTERS.md`](./docs/product/CHAPTERS.md) — главы и карта прохождения.
- [`docs/product/PVP_RANKED_SEASONS.md`](./docs/product/PVP_RANKED_SEASONS.md) — PvP, рейтинги и сезоны.

## Main Product Loops

```text
Open App
  -> Daily Ritual / Chapter / PvP Duel
  -> Answer Questions
  -> Explanation
  -> Reward / Rating / Stars
  -> Share / Challenge / Rematch
  -> Return Tomorrow
```

## Implemented Now

Уже есть:

- React/Vite frontend в `apps/webapp`;
- Roman Temple стартовый UI;
- карта главы на mock-данных;
- PvP duel card на mock-данных;
- leaderboard на mock-данных;
- Gradle multi-module skeleton;
- `apps/api` Spring Boot entrypoint;
- `apps/bot` Spring Boot entrypoint;
- `GET /api/public/config`;
- `ResultCalculator` в `packages/domain`;
- тест для подсчёта звёзд;
- Dockerfiles для API/Bot/WebApp;
- `docker-compose.yml` для PostgreSQL и Redis;
- `.env.example`.

## Not Implemented Yet

Ещё нужно реализовать:

- Telegram WebApp SDK wrapper;
- backend validation для Telegram `initData`;
- users/categories/questions;
- chapter map API;
- daily ritual API;
- async PvP duel API;
- ranked profile API;
- seasons/leaderboards;
- Telegram bot `/start` + WebApp button;
- Telegram Stars skeleton;
- persistence layer, Flyway migrations, seed data.

## Railway Deployment Shape

Railway services:

```text
brainarena-webapp -> Root Directory: apps/webapp
brainarena-api    -> Dockerfile: infra/docker/api.Dockerfile
brainarena-bot    -> Dockerfile: infra/docker/bot.Dockerfile
brainarena-db     -> Railway PostgreSQL
brainarena-redis  -> Railway Redis
```

## Local Development

Infrastructure:

```bash
docker compose up -d postgres redis
```

Frontend:

```bash
cd apps/webapp
npm ci
npm run dev
```

Backend API:

```bash
./gradlew :apps:api:bootRun
```

Bot:

```bash
./gradlew :apps:bot:bootRun
```

Full backend build:

```bash
./gradlew clean build
```

## Design Direction

Brain Arena использует Roman Temple style:

- светлый молочный фон;
- мраморные карточки;
- золото/латунь как акцент;
- мягкие каменные тени;
- симметрия;
- лавровые венки, короны, печати, колонны;
- спокойные анимации без дешёвого игрового шума.

## Monetization Rule

Premium не должен ломать честность игры.

Можно продавать:

- косметику;
- профильные рамки;
- расширенную статистику;
- extra daily packs;
- season pass cosmetics.

Нельзя продавать:

- победы;
- правильные ответы;
- ranked boosts;
- нечестные подсказки в рейтинговом режиме.

## Immediate Next Steps

1. Проверить `cd apps/webapp && npm ci && npm run build`.
2. Проверить `./gradlew clean build`.
3. Исправить возможные ошибки сборки после переноса структуры.
4. Задеплоить `brainarena-webapp` на Railway.
5. Задеплоить `brainarena-api` на Railway.
6. Добавить Telegram WebApp SDK wrapper.
7. Реализовать Telegram bot `/start` и WebApp button.
8. Подключить frontend к `/api/public/config`.
9. Реализовать chapter map API.
10. Реализовать async PvP duel MVP.
