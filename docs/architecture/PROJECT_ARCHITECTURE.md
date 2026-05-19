# PROJECT_ARCHITECTURE — Brain Arena Bot

Документ фиксирует чистую, масштабируемую и понятную архитектуру проекта Brain Arena. Архитектура должна быть удобной для GitHub, Codex/агентов и Railway.

## 1. Главный принцип

Brain Arena — это не один монолитный скрипт, а Telegram-first продукт из нескольких понятных частей:

```text
Telegram Bot
Telegram Mini App
Backend API
Database
Redis
Admin/Content tools later
Workers later
```

Каждая часть должна быть самостоятельной, но жить в одном репозитории.

Цель архитектуры:

- легко понимать структуру проекта;
- легко деплоить на Railway;
- не смешивать frontend, bot и backend;
- держать доменную логику отдельно от контроллеров и UI;
- сохранить текущий frontend и развивать его, а не переписывать с нуля.

---

## 2. Railway-friendly monorepo

Целевая структура:

```text
telonyx-brainarena-bot/
  apps/
    webapp/                 # React Telegram Mini App
    api/                    # Spring Boot Backend API entrypoint
    bot/                    # Telegram Bot entrypoint
    admin/                  # Admin panel later

  packages/
    domain/                 # Чистая доменная логика игры
    persistence/            # PostgreSQL, Flyway, repositories
    security/               # Telegram initData, signatures, auth
    integration/            # Telegram API, Stars, external clients
    common/                 # shared utils, errors, config
    analytics/              # analytics event contracts

  infra/
    docker/
    railway/
    local/

  docs/
    architecture/
    deployment/
    product/
    ui/
    content/

  .env.example
  docker-compose.yml
  README.md
  SKILLS.md
  AGENTS.md
  PROMT.md
  ROADMAP.md
```

## 3. Почему так удобно для Railway

Railway хорошо работает, когда каждый сервис имеет понятный root directory и понятную команду запуска.

В Railway должны быть отдельные services:

```text
brainarena-webapp     -> root: apps/webapp
brainarena-api        -> root: apps/api или root repo с backend Dockerfile
brainarena-bot        -> root: apps/bot или root repo с bot Dockerfile
brainarena-postgres   -> Railway PostgreSQL plugin
brainarena-redis      -> Railway Redis plugin
```

Позже можно добавить:

```text
brainarena-worker     -> async jobs, rating snapshots, notifications
brainarena-admin      -> content/admin panel
```

---

## 4. Frontend placement

Сейчас frontend уже существует в корне проекта:

```text
src/
package.json
vite.config.ts
tailwind.config.js
```

Его нужно не удалять, а перенести в:

```text
apps/webapp/
  src/
  public/
  package.json
  vite.config.ts
  tailwind.config.js
  tsconfig.json
  Dockerfile
```

После переноса frontend должен сохранить текущий Roman Temple UI.

Запрещено:

- переписывать frontend с нуля;
- ломать текущий Home screen;
- заменять Roman UI на dark/casino/cyberpunk;
- смешивать Telegram SDK напрямую во всех компонентах.

Telegram Mini App integration должна жить отдельно:

```text
apps/webapp/src/api/telegram.ts
apps/webapp/src/app/providers/TelegramProvider.tsx
```

---

## 5. Backend placement

Backend лучше делать на Java 21 + Spring Boot 3.x.

Railway-friendly backend structure:

```text
apps/api/
  build.gradle
  src/main/java/app/brainarena/api/
    BrainArenaApiApplication.java
    controller/
    config/

apps/bot/
  build.gradle
  src/main/java/app/brainarena/bot/
    BrainArenaBotApplication.java
    handler/
    keyboard/
    command/

packages/domain/
  build.gradle
  src/main/java/app/brainarena/domain/
    model/
    service/
    event/
    exception/

packages/persistence/
  build.gradle
  src/main/java/app/brainarena/persistence/
    entity/
    repository/
    mapper/
  src/main/resources/db/migration/

packages/security/
  build.gradle
  src/main/java/app/brainarena/security/
    telegram/
    signature/
    auth/

packages/integration/
  build.gradle
  src/main/java/app/brainarena/integration/
    telegram/
    stars/

packages/common/
  build.gradle
  src/main/java/app/brainarena/common/
    error/
    clock/
    id/
    config/
```

## 6. Backend dependency rules

Зависимости должны идти только вниз по слоям.

```text
apps/api          -> domain, persistence, security, integration, common
apps/bot          -> domain, persistence, security, integration, common
persistence       -> domain, common
security          -> common
integration       -> domain, common
analytics         -> common
domain            -> common only
common            -> no project dependencies
```

Запрещено:

- `domain` не зависит от Spring Web;
- `domain` не зависит от Telegram API;
- `domain` не зависит от JPA;
- controllers не считают рейтинг;
- bot handlers не считают результат дуэли;
- frontend не является источником истины для ranked/PvP.

---

## 7. Domain bounded contexts

Домен делится на понятные области:

```text
user
quiz
chapters
pvp
ranked
seasons
rewards
payments
analytics
content
```

### quiz

- Question
- QuestionOption
- QuizSession
- UserAnswer
- QuizResult
- DailyRitualService
- AnswerValidationService
- ResultCalculator

### chapters

- Course
- Chapter
- ChapterNode
- ChapterProgress
- NodeAttempt
- ChapterMapService

### pvp

- PvpMatch
- PvpParticipant
- AsyncDuelService
- ChallengeService
- MatchResultService

### ranked

- RankedProfile
- RatingChangeLog
- RatingService
- LeaderboardService

### seasons

- Season
- SeasonReward
- LeaderboardSnapshot
- SeasonService

### payments

- PaymentTransaction
- StarsPaymentService
- PaymentIdempotencyService

---

## 8. API service responsibilities

`apps/api` отвечает за HTTP API для Mini App.

Минимальные группы endpoint-ов:

```text
/api/public/*
/api/me/*
/api/categories/*
/api/chapters/*
/api/quiz/*
/api/pvp/*
/api/ranked/*
/api/seasons/*
/api/payments/*
/api/admin/* later
```

API не должен содержать бизнес-логику. Он принимает запрос, валидирует auth, вызывает service из domain/application layer и возвращает DTO.

---

## 9. Bot service responsibilities

`apps/bot` отвечает за Telegram Bot:

- `/start`;
- deep links;
- WebApp кнопки;
- result sharing;
- rematch CTA;
- payment invoices через Stars;
- уведомления о завершении challenge;
- сезонные уведомления.

Bot не должен заменять Mini App. Основной UX живёт в `apps/webapp`.

---

## 10. WebApp responsibilities

`apps/webapp` отвечает за Telegram Mini App UI:

- Home;
- Chapter Map;
- Daily Ritual;
- Quiz Stage;
- PvP Arena;
- Duel Result;
- Leaderboards;
- Season Overview;
- Profile / Archivarius.

Frontend получает состояние от API и отправляет действия. Он не должен сам считать ranked-рейтинг или итог PvP как источник истины.

---

## 11. Database strategy

PostgreSQL — основной storage.

Основные группы таблиц:

```text
users
telegram_accounts
categories
questions
question_options
quiz_sessions
user_answers
courses
chapters
chapter_nodes
chapter_progress
pvp_matches
pvp_participants
ranked_profiles
seasons
leaderboard_snapshots
rewards
payment_transactions
analytics_events
```

Flyway migrations должны жить в:

```text
packages/persistence/src/main/resources/db/migration
```

Правила:

- миграции не редактируются после merge;
- seed-данные отделяются от schema migrations;
- платежи и ranked changes должны быть audit-friendly.

---

## 12. Redis usage

Redis использовать для:

- rate limit;
- short-lived Telegram auth/session state;
- challenge token cache;
- matchmaking tickets later;
- cooldowns;
- lightweight locks;
- leaderboard cache.

Критический прогресс, платежи и результаты матчей нельзя хранить только в Redis.

---

## 13. Railway services

Минимальный Railway setup:

```text
Service: brainarena-webapp
Root Directory: apps/webapp
Build Command: npm ci && npm run build
Start Command: npm run start
Variables:
  VITE_API_BASE_URL=https://api.example.com
  VITE_TELEGRAM_BOT_USERNAME=...

Service: brainarena-api
Root Directory: /
Dockerfile: infra/docker/api.Dockerfile
Variables:
  DATABASE_URL=...
  REDIS_URL=...
  APP_PUBLIC_BASE_URL=...
  TELEGRAM_BOT_TOKEN=...

Service: brainarena-bot
Root Directory: /
Dockerfile: infra/docker/bot.Dockerfile
Variables:
  DATABASE_URL=...
  REDIS_URL=...
  TELEGRAM_BOT_TOKEN=...
  TELEGRAM_WEBAPP_URL=...
```

Для MVP можно временно объединить API и Bot в один Spring Boot service, но архитектурно их лучше держать раздельно.

---

## 14. Docker strategy

Dockerfiles хранить в:

```text
infra/docker/api.Dockerfile
infra/docker/bot.Dockerfile
apps/webapp/Dockerfile
```

Локальная разработка:

```text
docker-compose.yml
```

Compose должен поднимать:

- postgres;
- redis;
- api;
- bot optional;
- webapp optional.

---

## 15. Environment variables

Общие:

```text
APP_ENV=local
APP_PUBLIC_BASE_URL=http://localhost:8080
APP_TIMEZONE=Europe/Kyiv
```

Database:

```text
DATABASE_URL=postgresql://...
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=brainarena
POSTGRES_USER=brainarena
POSTGRES_PASSWORD=brainarena
```

Redis:

```text
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
```

Telegram:

```text
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=
TELEGRAM_WEBAPP_URL=
TELEGRAM_WEBHOOK_URL=
```

Frontend:

```text
VITE_API_BASE_URL=http://localhost:8080
VITE_TELEGRAM_BOT_USERNAME=
```

---

## 16. Migration plan from current repo

Текущий frontend находится в корне. Миграция должна быть аккуратной.

### Step 1

Создать:

```text
apps/webapp
infra/docker
docs/deployment
```

### Step 2

Перенести frontend files:

```text
src -> apps/webapp/src
public -> apps/webapp/public
package.json -> apps/webapp/package.json
vite.config.ts -> apps/webapp/vite.config.ts
tailwind.config.js -> apps/webapp/tailwind.config.js
tsconfig*.json -> apps/webapp/
```

### Step 3

Добавить root-level backend Gradle structure.

### Step 4

Добавить Dockerfiles для Railway.

### Step 5

Настроить Railway services по root directory / Dockerfile.

---

## 17. Definition of Done для архитектуры

Архитектура считается готовой, если:

- frontend лежит в `apps/webapp`;
- backend entrypoints разделены на `apps/api` и `apps/bot` или явно объединены на MVP;
- доменная логика вынесена в `packages/domain`;
- persistence вынесен отдельно;
- Dockerfiles понятны Railway;
- `.env.example` покрывает все сервисы;
- README объясняет локальный запуск;
- Railway doc объясняет деплой;
- текущий Roman UI сохранён;
- agents не получают противоречивых инструкций.
