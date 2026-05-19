# IMPLEMENTATION_STATUS — что уже реализовано и что делать дальше

Документ фиксирует фактическое состояние Brain Arena после перехода на Railway-friendly monorepo и первых MVP-срезов.

## 1. Текущий статус

Проект уже не является одиночным frontend-прототипом. Сейчас это monorepo:

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

Корень очищен от legacy Vite-файлов. Frontend находится только в `apps/webapp`.

---

## 2. Уже реализовано

### 2.1 Frontend / Telegram Mini App

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
- feature-разбиение Home на `features/home`, `features/chapters`, `features/daily`, `features/pvp`, `features/ranked`, `features/profile`;
- typed contracts для текущих mock/API-shape;
- Telegram WebApp runtime wrapper с browser fallback;
- TelegramProvider;
- frontend API client;
- `GET /api/public/config` client;
- подключение карты главы к backend API с fallback для локального режима;
- runtime API fallback для Railway production;
- Telegram-style quiz stage panel;
- answer feedback и local star preview;
- карта прохождения главы;
- категории;
- рейтинг игрока;
- daily modes;
- PvP duel card;
- leaderboard;
- profile card;
- bottom navigation;
- `apps/webapp/package-lock.json` для `npm ci`;
- `apps/webapp/railway.json`;
- webapp Dockerfile.

Важно: текущий Roman Temple UI является базой продукта. Его нельзя удалять или заменять с нуля.

---

### 2.2 Backend API

Создан Gradle multi-module skeleton.

Есть:

```text
settings.gradle
build.gradle
apps/api/build.gradle
apps/bot/build.gradle
packages/*/build.gradle
```

API entrypoint:

```text
apps/api/src/main/java/app/telonyx/brainarena/api/BrainArenaApiApplication.java
```

Публичный config endpoint:

```text
GET /api/public/config
```

MVP endpoints глав:

```text
GET  /api/courses
GET  /api/courses/{courseSlug}/chapters
GET  /api/chapters/{chapterSlug}/map
POST /api/chapters/{chapterSlug}/nodes/{nodeId}/start
```

CORS:

- есть configurable CORS через `APP_CORS_ALLOWED_ORIGINS`.

Telegram auth slice:

```text
packages/security/src/main/java/app/telonyx/brainarena/security/telegram/TelegramUser.java
packages/security/src/main/java/app/telonyx/brainarena/security/telegram/TelegramAuthResult.java
packages/security/src/main/java/app/telonyx/brainarena/security/telegram/TelegramInitDataValidator.java
apps/api/src/main/java/app/telonyx/brainarena/api/config/TgAuthConfig.java
apps/api/src/main/java/app/telonyx/brainarena/api/controller/MeController.java
```

Добавлен первый защищённый Telegram-backed endpoint:

```text
GET /api/me
Header: X-Telegram-Init-Data: <Telegram WebApp initData>
```

---

### 2.3 Telegram Bot MVP

Bot service запускается отдельным Spring Boot приложением и использует Telegram long polling через Telegram HTTP API.

Есть:

- `/start`;
- WebApp button `Открыть Brain Arena`;
- Railway env configuration без хранения bot token в репозитории.

---

### 2.4 Domain skeleton

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

### 2.5 Railway / Infrastructure

Добавлено:

```text
docker-compose.yml
infra/docker/api.Dockerfile
infra/docker/bot.Dockerfile
apps/webapp/Dockerfile
apps/webapp/railway.json
.env.example
```

`docker-compose.yml` поднимает:

- PostgreSQL;
- Redis.

Railway target split:

```text
brainarena-webapp
brainarena-api
brainarena-bot
PostgreSQL
Redis
```

Railway notes:

- `brainarena-webapp` — canonical web service;
- obsolete `brainarena-web` удалён;
- API/Bot используют `RAILWAY_DOCKERFILE_PATH`;
- stale root Railway config удалён;
- live API health и public config уже проверялись Codex-ом.

---

## 3. Что ещё не реализовано

### 3.1 Frontend

Пока не реализовано полностью:

- `components/temple` для общих UI-компонентов;
- полноценный routing между Home / Chapter / PvP / Ranked / Profile;
- server-authoritative quiz flow без `correctOptionId` на клиенте;
- полноценные экраны Duel Result и Season Overview;
- полноценные loading/error/empty states на всех feature-срезах.

Критично: в production нельзя отдавать `correctOptionId` клиенту до ответа пользователя. Сейчас это допустимо только как MVP/demo preview.

---

### 3.2 Backend API

Пока не реализовано:

- persistent users;
- categories;
- questions;
- quiz sessions;
- persisted chapter progress;
- server-authoritative answer submit flow;
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

- deep links для challenge;
- result sharing;
- rematch CTA;
- Telegram Stars invoice flow;
- уведомления о завершении дуэли.

---

## 4. Следующие шаги

### Step 1 — проверить сборку после auth slice

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
- тесты проходят.

---

### Step 2 — подключить frontend к `/api/me`

Добавить в webapp API client:

```text
GET /api/me
X-Telegram-Init-Data: telegram.initData
```

UI поведение:

- в Telegram показывать реального Telegram user;
- вне Telegram использовать browser fallback;
- если `/api/me` вернул 401, не сохранять прогресс и показывать безопасный guest state.

---

### Step 3 — сделать persistence foundation

Реализовать:

```text
PostgreSQL config
Flyway
users
telegram_accounts
courses
chapters
chapter_nodes
questions
question_options
chapter_progress
node_attempts
```

---

### Step 4 — server-authoritative quiz flow

Заменить demo-flow с `correctOptionId` на серверную проверку:

```text
POST /api/chapters/{chapterSlug}/nodes/{nodeId}/start
POST /api/quiz/sessions/{sessionId}/answer
POST /api/quiz/sessions/{sessionId}/finish
GET  /api/quiz/sessions/{sessionId}/result
```

Правило:

- клиент не получает правильный ответ до отправки своего ответа;
- звёзды и прогресс считает backend;
- chapter progress сохраняется в PostgreSQL.

---

### Step 5 — Daily Ritual

После quiz-session flow добавить daily режим:

```text
POST /api/quiz/daily/start
GET  /api/quiz/daily/status
```

---

### Step 6 — PvP MVP

После server-authoritative quiz flow реализовать async duel:

```text
POST /api/pvp/duels/async/start
POST /api/pvp/challenges/{token}/accept
POST /api/pvp/duels/{matchId}/answer
POST /api/pvp/duels/{matchId}/finish
GET  /api/pvp/duels/{matchId}
```

---

## 5. Ближайший рекомендуемый порядок

1. Проверить сборку `apps/webapp`.
2. Проверить `./gradlew clean build`.
3. Исправить ошибки после добавления Telegram auth slice.
4. Подключить frontend к `/api/me`.
5. Добавить PostgreSQL/Flyway foundation.
6. Реализовать users + telegram_accounts.
7. Реализовать persisted chapter map.
8. Убрать `correctOptionId` из client-visible quiz start response.
9. Реализовать server-side answer submit.
10. Потом переходить к Daily Ritual и PvP.

---

## 6. Важные запреты

- не возвращать frontend в корень;
- не создавать второй независимый frontend;
- не удалять Roman Temple UI;
- не считать PvP/ranked результат на клиенте;
- не доверять Telegram user без backend validation;
- не отдавать `correctOptionId` клиенту до ответа пользователя в production;
- не хранить платежи и ranked progress только в Redis;
- не делать pay-to-win механику.
