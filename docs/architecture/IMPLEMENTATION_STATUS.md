# IMPLEMENTATION_STATUS — что уже реализовано и что делать дальше

Документ фиксирует фактическое состояние репозитория после перехода на Railway-friendly monorepo.

## 1. Текущий статус

Проект переведён из одиночного frontend-прототипа в понятную monorepo-структуру:

```text
telonyx-brainarena-bot/
  apps/
    webapp/
    api/
    bot/

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
```

Корень очищен от legacy Vite-файлов. Frontend теперь находится только в `apps/webapp`.

---

## 2. Уже реализовано

### 2.1 Frontend / Telegram Mini App prototype

Реализовано в:

```text
apps/webapp
```

Есть:

- React 18;
- TypeScript;
- Vite;
- TailwindCSS;
- Framer Motion;
- lucide-react;
- Roman Temple визуальный стиль;
- стартовый Home screen;
- feature-разбиение Home на `features/home`, `features/chapters`, `features/daily`, `features/pvp`, `features/ranked`, `features/profile`;
- typed contracts для текущих mock/API-shape;
- Telegram WebApp wrapper с browser fallback;
- TelegramProvider;
- API client skeleton для `GET /api/public/config`;
- карта прохождения главы;
- mock-прогресс главы `6 / 15 ★`;
- категории;
- рейтинг игрока;
- daily modes;
- PvP duel card;
- leaderboard;
- profile card;
- bottom navigation;
- webapp Dockerfile.

Главные файлы:

```text
apps/webapp/src/app/App.tsx
apps/webapp/src/main.tsx
apps/webapp/src/pages/Home.tsx
apps/webapp/src/theme/content.ts
apps/webapp/src/styles/global.css
apps/webapp/public/assets/seal.svg
apps/webapp/public/assets/laurel.svg
```

Важно: текущий UI является базой продукта. Его нельзя удалять или заменять с нуля.

---

### 2.2 Backend skeleton

Создан Gradle multi-module skeleton.

Файлы:

```text
settings.gradle
build.gradle
apps/api/build.gradle
apps/bot/build.gradle
packages/*/build.gradle
```

Создан API entrypoint:

```text
apps/api/src/main/java/app/telonyx/brainarena/api/BrainArenaApiApplication.java
```

Создан Bot entrypoint:

```text
apps/bot/src/main/java/app/telonyx/brainarena/bot/BrainArenaBotApplication.java
```

Создан первый публичный endpoint:

```text
GET /api/public/config
```

Файл:

```text
apps/api/src/main/java/app/telonyx/brainarena/api/controller/PublicConfigController.java
```

---

### 2.3 Domain skeleton

Создан первый доменный сервис:

```text
packages/domain/src/main/java/app/telonyx/brainarena/domain/quiz/ResultCalculator.java
```

Он считает звёзды за прохождение узла главы:

```text
3 stars: 90-100%
2 stars: 70-89%
1 star: 40-69%
0 stars: below 40%
```

Добавлен тест:

```text
packages/domain/src/test/java/app/telonyx/brainarena/domain/quiz/ResultCalculatorTest.java
```

---

### 2.4 Infrastructure

Добавлено:

```text
docker-compose.yml
infra/docker/api.Dockerfile
infra/docker/bot.Dockerfile
apps/webapp/Dockerfile
.env.example
```

`docker-compose.yml` поднимает:

- PostgreSQL;
- Redis.

Railway-friendly схема уже описана в:

```text
docs/deployment/RAILWAY.md
```

---

### 2.5 Product docs

Уже есть отдельные продуктовые спецификации:

```text
ROADMAP.md
PROMT.md
AGENTS.md
SKILLS.md
docs/product/CHAPTERS.md
docs/product/PVP_RANKED_SEASONS.md
docs/architecture/PROJECT_ARCHITECTURE.md
docs/architecture/FRONTEND_STATUS.md
docs/deployment/RAILWAY.md
```

Закреплены ключевые продуктовые направления:

- Daily Ritual;
- главы и карта прохождения;
- PvP-first подход;
- async duels;
- рейтинги;
- сезоны;
- лидерборды;
- Roman Temple UI;
- Telegram Stars без pay-to-win.

---

## 3. Что ещё не реализовано

### 3.1 Frontend

Пока не реализовано:

- `components/temple` для общих UI-компонентов;
- loading/error/empty states для реальных запросов;
- routing между Home / Chapter / PvP / Ranked / Profile;
- подключение к backend;
- адаптер mock data -> API contracts;
- полноценные экраны Chapter Map, Quiz Stage, Duel Result, Season Overview.

---

### 3.2 Backend API

Пока не реализовано:

- Telegram initData validation;
- auth/session layer;
- users;
- categories;
- questions;
- quiz sessions;
- chapter map API;
- daily ritual API;
- PvP async duel API;
- ranked profile API;
- leaderboard API;
- seasons API;
- payments/Telegram Stars API.

---

### 3.3 Persistence

Пока не реализовано:

- JPA entities;
- repositories;
- Flyway migrations;
- seed данных;
- PostgreSQL connection config;
- Redis config;
- audit tables для рейтинга и платежей.

---

### 3.4 Telegram Bot

Пока не реализовано:

- подключение TelegramBots Java API;
- `/start`;
- WebApp button;
- deep links для challenge;
- result sharing;
- rematch CTA;
- Telegram Stars invoice flow;
- уведомления о завершении дуэли.

---

## 4. Следующие шаги

## Step 1 — проверить сборку новой структуры

Команды:

```bash
cd apps/webapp
npm ci
npm run build
```

```bash
./gradlew clean build
```

Ожидаемый результат:

- frontend билдится из `apps/webapp`;
- backend modules собираются;
- тест `ResultCalculatorTest` проходит.

---

## Step 2 — подготовить Railway webapp deploy

Создать Railway service:

```text
Service name: brainarena-webapp
Root Directory: apps/webapp
Build Command: npm ci && npm run build
Start Command: npm run start
```

Переменные:

```text
VITE_API_BASE_URL=https://brainarena-api-production.up.railway.app
VITE_TELEGRAM_BOT_USERNAME=iq_arenabot
```

Проверить, что webapp открывается в браузере.

---

## Step 3 — подготовить Railway API deploy

Создать Railway service:

```text
Service name: brainarena-api
Root Directory: /
Dockerfile Path: infra/docker/api.Dockerfile
```

Переменные:

```text
APP_ENV=production
APP_PORT=8080
DATABASE_URL=<Railway Postgres URL>
REDIS_URL=<Railway Redis URL>
TELEGRAM_BOT_TOKEN=<secret>
TELEGRAM_BOT_USERNAME=iq_arenabot
TELEGRAM_WEBAPP_URL=<webapp url>
CHALLENGE_SIGNING_SECRET=<secret>
```

Проверить:

```text
GET /actuator/health
GET /api/public/config
```

---

## Step 4 — Telegram Mini App integration

Добавить:

```text
apps/webapp/src/api/telegram.ts
apps/webapp/src/app/providers/TelegramProvider.tsx
```

MVP-функции:

- `ready()`;
- `expand()`;
- чтение `initData`;
- чтение `initDataUnsafe`;
- отправка `initData` на backend;
- безопасный fallback для браузера вне Telegram.

---

## Step 5 — Telegram bot MVP

Добавить в `apps/bot`:

- Telegram dependency;
- bot config;
- `/start` handler;
- inline button `Открыть Brain Arena`;
- WebApp URL из env `TELEGRAM_WEBAPP_URL`.

---

## Step 6 — первый реальный backend domain slice

Начать с глав, потому что frontend уже визуально показывает карту.

Реализовать:

```text
Course
Chapter
ChapterNode
ChapterProgress
NodeAttempt
```

Endpoints:

```text
GET /api/courses
GET /api/chapters/{chapterSlug}/map
POST /api/chapters/{chapterSlug}/nodes/{nodeId}/start
GET /api/chapters/{chapterSlug}/progress
```

---

## Step 7 — PvP MVP

После chapter API реализовать async duel:

```text
POST /api/pvp/duels/async/start
POST /api/pvp/challenges/{token}/accept
POST /api/pvp/duels/{matchId}/answer
POST /api/pvp/duels/{matchId}/finish
GET  /api/pvp/duels/{matchId}
```

---

## 5. Ближайший рекомендуемый порядок

1. Проверить локальную сборку `apps/webapp`.
2. Проверить Gradle build.
3. Исправить ошибки сборки, если они есть.
4. Задеплоить `brainarena-webapp` на Railway.
5. Задеплоить `brainarena-api` на Railway.
6. Подключить Telegram Mini App SDK.
7. Реализовать `/start` в боте.
8. Подключить frontend к `/api/public/config`.
9. Реализовать API карты главы.
10. Реализовать async PvP duel.

---

## 6. Важные запреты

- не возвращать frontend в корень;
- не создавать второй независимый frontend;
- не удалять Roman Temple UI;
- не считать PvP/ranked результат на клиенте;
- не доверять Telegram user без backend validation;
- не хранить платежи и ranked progress только в Redis;
- не делать pay-to-win механику.
