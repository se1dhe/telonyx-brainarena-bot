# IMPLEMENTATION_STATUS — фактическое состояние Brain Arena

Документ фиксирует текущее состояние проекта после первых MVP-срезов, которые уже перенесены прямо в `main`.

## 1. Структура проекта

Проект является Railway-friendly monorepo:

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

Frontend находится только в `apps/webapp`. Возвращать Vite/React файлы в корень нельзя.

---

## 2. Уже сделано в `main`

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
- typed contracts для текущих API-shape;
- Telegram WebApp runtime wrapper с browser fallback;
- TelegramProvider;
- frontend API client;
- `GET /api/public/config` client;
- подключение карты главы к backend API с fallback для локального режима;
- runtime API fallback для Railway production;
- Telegram-style quiz stage panel;
- answer feedback после backend submit;
- server-authoritative answer check для live API;
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

Дополнительно уже добавлено:

```text
apps/webapp/src/api/client.ts
apps/webapp/src/api/useMe.ts
```

`client.ts` содержит `fetchMe(initData)`, который вызывает:

```text
GET /api/me
Header: X-Telegram-Init-Data: <Telegram WebApp initData>
```

`useMe(telegram)` безопасно возвращает guest state, если Mini App открыт вне Telegram или backend вернул `401`.

Важно: `Home.tsx` уже использует `useMe`; вне Telegram UI остаётся в guest/fallback состоянии.

---

### 2.2 Backend API

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
POST /api/quiz/sessions/{sessionId}/answer
POST /api/quiz/sessions/{sessionId}/finish
```

Quiz session и submitted answers уже сохраняются через `packages:persistence`.

Telegram auth slice:

```text
packages/security/src/main/java/app/telonyx/brainarena/security/telegram/TelegramUser.java
packages/security/src/main/java/app/telonyx/brainarena/security/telegram/TelegramAuthResult.java
packages/security/src/main/java/app/telonyx/brainarena/security/telegram/TelegramInitDataValidator.java
apps/api/src/main/java/app/telonyx/brainarena/api/config/TgAuthConfig.java
apps/api/src/main/java/app/telonyx/brainarena/api/controller/MeController.java
```

Защищённый Telegram-backed endpoint:

```text
GET /api/me
Header: X-Telegram-Init-Data: <Telegram WebApp initData>
```

Сейчас `/api/me`:

- валидирует Telegram `initData` на backend;
- возвращает `401`, если данные невалидны;
- создаёт или обновляет пользователя в PostgreSQL через `UserIdentityService`;
- возвращает `userId`, `telegramId`, Telegram profile fields, `displayName`, `authDate`.

---

### 2.3 Persistence foundation

`apps/api` уже подключает модуль:

```text
implementation project(':packages:persistence')
```

`packages/persistence` уже подключает Spring dependency management и зависит от:

```text
packages:common
packages:domain
packages:security
spring-boot-starter-data-jpa
flyway-core
postgresql
```

Это исправляет Railway/Docker build error, где Gradle не мог найти версии для:

```text
org.springframework.boot:spring-boot-starter-data-jpa
org.flywaydb:flyway-core
```

`application.yml` уже содержит базовую настройку:

```text
spring.datasource.url
spring.datasource.username
spring.datasource.password
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
```

Railway `DATABASE_URL` теперь поддерживается автоматически через:

```text
apps/api/src/main/java/app/telonyx/brainarena/api/config/RailwayDatabaseUrlEnvironmentPostProcessor.java
apps/api/src/main/resources/META-INF/spring.factories
```

Он конвертирует Railway URL вида:

```text
postgresql://user:password@host:port/database
```

в JDBC URL вида:

```text
jdbc:postgresql://host:port/database
```

`application.yml` больше не подставляет `DATABASE_URL` напрямую в `spring.datasource.url`, чтобы Spring/Hikari не падал с ошибкой `URL must start with 'jdbc'`.

Добавлена первая миграция:

```text
packages/persistence/src/main/resources/db/migration/V1__users_and_telegram_accounts.sql
```

Она создаёт:

```text
users
telegram_accounts
```

Добавлена миграция quiz sessions:

```text
packages/persistence/src/main/resources/db/migration/V2__quiz_sessions_and_answers.sql
```

Она создаёт:

```text
quiz_sessions
quiz_answers
```

Добавлены JPA-сущности и сервис:

```text
packages/persistence/src/main/java/app/telonyx/brainarena/persistence/user/UserEntity.java
packages/persistence/src/main/java/app/telonyx/brainarena/persistence/user/TelegramAccountEntity.java
packages/persistence/src/main/java/app/telonyx/brainarena/persistence/user/UserIdentityService.java
packages/persistence/src/main/java/app/telonyx/brainarena/persistence/quiz/QuizSessionEntity.java
packages/persistence/src/main/java/app/telonyx/brainarena/persistence/quiz/QuizAnswerEntity.java
packages/persistence/src/main/java/app/telonyx/brainarena/persistence/quiz/QuizSessionPersistenceService.java
```

`UserIdentityService` делает upsert Telegram-пользователя через `EntityManager`.

---

### 2.4 Telegram Bot MVP

Bot service запускается отдельным Spring Boot приложением и использует Telegram long polling через Telegram HTTP API.

Есть:

- `/start`;
- WebApp button `Открыть Brain Arena`;
- Railway env configuration без хранения bot token в репозитории.

---

### 2.5 Domain skeleton

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

### 2.6 Railway / Infrastructure

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

---

## 3. Что ещё не сделано

### 3.1 Frontend

Пока не завершено:

- полноценный routing между Home / Chapter / PvP / Ranked / Profile;
- полноценный deep-link routing на уровне URL;
- полноценные экраны Duel Result и Season Overview;
- loading/error/empty states на всех feature-срезах.

---

### 3.2 Backend API

Пока не завершено:

- persisted courses;
- persisted chapters;
- persisted chapter nodes;
- persisted questions;
- persisted question options;
- расширение content seed за пределы первого маршрута;
- streak/reward economy для Daily Ritual;
- PvP async duel API;
- ranked profile API;
- leaderboard API;
- seasons API;
- payments/Telegram Stars API.

---

### 3.3 Persistence

Пока не завершено:

- repositories или полноценные persistence services для курсов/глав/вопросов;
- Flyway seed данных;
- Redis config;
- audit tables для рейтинга и платежей;
- PvP duel tables.

---

### 3.4 Telegram Bot

Пока не реализовано:

- deep links для challenge;
- result sharing;
- rematch CTA;
- Telegram Stars invoice flow;
- уведомления о завершении дуэли.

---

## 4. Выполненные шаги последней сессии

1. Смержен в `main` PR #1 с frontend `fetchMe` и `useMe`.
2. Старый PR #2 закрыт как неактуальный.
3. Persistence-срез перенесён прямо в `main`, без новых PR:
   - подключён `packages:persistence` к `apps/api`;
   - добавлен datasource/JPA/Flyway config;
   - добавлена миграция `users` + `telegram_accounts`;
   - добавлены `UserEntity`, `TelegramAccountEntity`, `UserIdentityService`;
   - `/api/me` теперь делает upsert Telegram user в БД.
4. Исправлена сборка `packages:persistence`:
   - добавлен `io.spring.dependency-management`;
   - добавлена зависимость на `packages:security`;
   - добавлен явный импорт Spring Boot BOM.
5. Исправлен runtime crash Railway API:
   - добавлен конвертер Railway `DATABASE_URL` в JDBC datasource properties;
   - `application.yml` больше не использует `DATABASE_URL` напрямую как `spring.datasource.url`.
6. Принято правило дальнейшей работы: новый код пушить прямо в `main`, без создания дополнительных веток и PR.
7. Добавлен server-authoritative quiz flow:
   - start endpoint создаёт quiz session;
   - answer endpoint проверяет ответ на backend;
   - finish endpoint возвращает результат и звёзды.
8. Добавлены `quiz_sessions`, `quiz_answers` и `user_node_progress`.
9. Mini App показывает result panel после завершения точки и обновляет карту после возврата.
10. Добавлен content catalog seed для `courses`, `chapters`, `chapter_nodes`, `questions`, `question_options`.
11. `ChapterController` читает каталог из PostgreSQL через `ContentCatalogPersistenceService`.
12. Карточка активной точки в Mini App берётся из состояния карты, а не из статичного mock.
13. Добавлен `POST /api/daily/ritual/start`; «Вопрос дня» запускает daily quiz session.
14. Mini App переведён на tab shell: карта, арена, топ и профиль больше не складываются в одну длинную страницу.
15. Категории стали горизонтальной каруселью, а вопросы открываются нажатием на доступную точку карты.

---

## 5. Ближайший порядок для рабочего MVP

### Step 1 — Daily Ritual economy

Добавить streak, reward grant и статус сегодняшнего ритуала.

---

### Step 2 — PvP MVP

После server-authoritative quiz flow реализовать async duel:

```text
POST /api/pvp/duels/async/start
POST /api/pvp/challenges/{token}/accept
POST /api/pvp/duels/{matchId}/answer
POST /api/pvp/duels/{matchId}/finish
GET  /api/pvp/duels/{matchId}
```

---

## 6. Важные запреты

- не возвращать frontend в корень;
- не создавать второй независимый frontend;
- не создавать новые ветки/PR без прямого запроса;
- не удалять Roman Temple UI;
- не считать PvP/ranked результат на клиенте;
- не доверять Telegram user без backend validation;
- не отдавать `correctOptionId` клиенту до ответа пользователя в production;
- не хранить платежи и ranked progress только в Redis;
- не делать pay-to-win механику.
