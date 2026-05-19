# RAILWAY — Brain Arena deployment guide

Этот документ описывает, как Brain Arena должен быть устроен для понятного деплоя на Railway.

## 1. Цель

Railway setup должен быть простым:

- один репозиторий;
- несколько понятных сервисов;
- каждый сервис имеет свой root/Dockerfile;
- переменные окружения разделены по назначению;
- frontend, api и bot не мешают друг другу.

---

## 2. Railway services

Минимальная production-схема:

```text
brainarena-webapp
brainarena-api
brainarena-bot
brainarena-postgres
brainarena-redis
```

Опционально позже:

```text
brainarena-worker
brainarena-admin
```

---

## 3. Service: brainarena-webapp

Назначение:

Telegram Mini App frontend.

Root Directory:

```text
apps/webapp
```

Build Command:

```bash
npm ci && npm run build
```

Start Command:

```bash
npm run start
```

Variables:

```text
VITE_API_BASE_URL=https://brainarena-api-production.up.railway.app
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
```

Custom domain позже:

```text
brainarena.telonyx.app
```

---

## 4. Service: brainarena-api

Назначение:

Backend API для Mini App.

Рекомендуемый способ на Railway:

```text
Root Directory: /
Dockerfile Path: infra/docker/api.Dockerfile
```

Для CLI-деплоя из монорепозитория сервису нужно задать переменную Railway:

```text
RAILWAY_DOCKERFILE_PATH=/infra/docker/api.Dockerfile
```

Variables:

```text
APP_ENV=production
APP_PORT=8080
APP_PUBLIC_BASE_URL=https://api-brainarena.telonyx.app
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
TELEGRAM_BOT_TOKEN=...
TELEGRAM_BOT_USERNAME=...
TELEGRAM_WEBAPP_URL=https://brainarena.telonyx.app
```

Healthcheck endpoint:

```text
/actuator/health
```

Custom domain later:

```text
api-brainarena.telonyx.app
```

---

## 5. Service: brainarena-bot

Назначение:

Telegram Bot entrypoint: `/start`, deep links, WebApp button, result sharing, Stars invoices.

Рекомендуемый способ на Railway:

```text
Root Directory: /
Dockerfile Path: infra/docker/bot.Dockerfile
```

Для CLI-деплоя из монорепозитория сервису нужно задать переменную Railway:

```text
RAILWAY_DOCKERFILE_PATH=/infra/docker/bot.Dockerfile
```

Variables:

```text
APP_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
TELEGRAM_BOT_TOKEN=...
TELEGRAM_BOT_USERNAME=...
TELEGRAM_WEBAPP_URL=https://brainarena.telonyx.app
API_INTERNAL_BASE_URL=https://brainarena-api-production.up.railway.app
```

Для MVP можно временно объединить bot и api в один service, но финальная архитектура должна позволять разделить их.

---

## 6. PostgreSQL

Использовать Railway PostgreSQL plugin.

Database stores:

- users;
- Telegram accounts;
- questions;
- quiz sessions;
- chapter progress;
- PvP matches;
- ranked profiles;
- seasons;
- payments;
- analytics events.

Важно:

- платежи и ranked results должны храниться в PostgreSQL;
- Redis не является постоянным хранилищем для критических данных.

---

## 7. Redis

Использовать Railway Redis plugin.

Redis stores:

- rate-limit;
- temporary challenge state;
- cooldowns;
- Telegram auth/session cache;
- matchmaking tickets later;
- leaderboard cache.

---

## 8. MVP deployment strategy

Чтобы быстро стартовать, можно идти в 2 этапа.

### Этап A — простой MVP

```text
brainarena-webapp
brainarena-api-bot
brainarena-postgres
brainarena-redis
```

Где `api-bot` — один Spring Boot сервис, который содержит и API, и Telegram Bot polling/webhook.

Плюсы:

- быстрее запустить;
- меньше Railway services;
- проще отлаживать.

Минусы:

- сложнее масштабировать bot отдельно;
- больше ответственности в одном runtime.

### Этап B — production split

```text
brainarena-webapp
brainarena-api
brainarena-bot
brainarena-worker
brainarena-postgres
brainarena-redis
```

Переходить к этому после появления реального PvP, сезонов, уведомлений и платежей.

---

## 9. Railway variables checklist

### WebApp

```text
VITE_API_BASE_URL=
VITE_TELEGRAM_BOT_USERNAME=
```

### API

```text
APP_ENV=
APP_PORT=
APP_PUBLIC_BASE_URL=
DATABASE_URL=
REDIS_URL=
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=
TELEGRAM_WEBAPP_URL=
JWT_SECRET=optional
CHALLENGE_SIGNING_SECRET=
```

### Bot

```text
APP_ENV=
DATABASE_URL=
REDIS_URL=
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=
TELEGRAM_WEBAPP_URL=
API_INTERNAL_BASE_URL=
```

---

## 10. Domains

Рекомендуемые домены:

```text
brainarena.telonyx.app        -> webapp
api-brainarena.telonyx.app    -> api
```

Telegram Bot должен открывать именно `brainarena.telonyx.app` как WebApp URL.

---

## 11. Local development

Локальный запуск должен быть простым:

```bash
docker compose up -d postgres redis
```

Frontend:

```bash
cd apps/webapp
npm ci
npm run dev
```

Backend:

```bash
./gradlew :apps:api:bootRun
```

Bot:

```bash
./gradlew :apps:bot:bootRun
```

Если на MVP api и bot объединены:

```bash
./gradlew :apps:api:bootRun
```

---

## 12. What Railway should not do

Запрещено:

- деплоить frontend и backend из одного root без ясной причины;
- хранить production secrets в GitHub;
- привязывать Telegram Bot к localhost/ngrok в production;
- считать рейтинг на frontend;
- хранить платежи только в Redis;
- смешивать admin, webapp и api в одном Vite app без структуры.

---

## 13. Definition of Done

Railway setup готов, когда:

- webapp билдится отдельно;
- api стартует отдельно;
- bot стартует отдельно или явно объединён на MVP;
- Railway variables задокументированы;
- healthcheck работает;
- custom domains описаны;
- Telegram WebApp URL указывает на frontend service;
- backend валидирует Telegram initData;
- Postgres и Redis подключаются через Railway variables.
