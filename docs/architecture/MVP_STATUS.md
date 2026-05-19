# MVP_STATUS — Brain Arena

Дата: 2026-05-19

Этот документ фиксирует практический срез MVP после синхронизации `main`.

## Уже сделано

### Telegram Mini App

- Roman Temple UI сохранён как основной стиль продукта.
- Home screen разбит на feature-компоненты.
- Есть карта прохождения главы.
- Есть категория, рейтинг, daily-блоки, PvP preview, leaderboard, profile.
- WebApp runtime вызывает Telegram `ready()` и `expand()`.
- Frontend умеет работать вне Telegram через fallback.
- Home подключён к `useMe`: в Telegram отображается имя реального пользователя.
- Карта главы берёт данные из backend API.
- Активная точка карты открывает playable quiz panel.
- Курсы, главы, точки, вопросы и варианты читаются из PostgreSQL seed.
- Ответы больше не проверяются на клиенте локально для live API.
- После завершения точки показывается result panel со звёздами и возвратом к карте.
- В Telegram Mini App карта запрашивается с initData и может показывать сохранённый прогресс пользователя.

### Backend API

- Spring Boot API service запускается отдельно.
- Есть `/actuator/health`.
- Есть `GET /api/public/config`.
- Есть MVP endpoints глав:
  - `GET /api/courses`
  - `GET /api/courses/{courseSlug}/chapters`
  - `GET /api/chapters/{chapterSlug}/map`
  - `POST /api/chapters/{chapterSlug}/nodes/{nodeId}/start`
- Есть server-authoritative quiz endpoints:
  - `POST /api/quiz/sessions/{sessionId}/answer`
  - `POST /api/quiz/sessions/{sessionId}/finish`
- Start response не отдаёт `correctOptionId`; правильный ответ появляется только после submit.
- Quiz session и submitted answers сохраняются в PostgreSQL.
- При полном завершении сессии backend сохраняет лучший результат точки для Telegram-пользователя.
- Есть Telegram initData validation.
- Есть `GET /api/me` с backend validation и upsert Telegram user.

### Persistence

- Подключены PostgreSQL, JPA, Flyway.
- Flyway закреплён на версии с поддержкой Railway PostgreSQL 18.
- Railway `DATABASE_URL` конвертируется в JDBC properties.
- Добавлена миграция `users` и `telegram_accounts`.
- Добавлена миграция `quiz_sessions` и `quiz_answers`.
- Добавлена миграция `user_node_progress`.
- Добавлена миграция content catalog: `courses`, `chapters`, `chapter_nodes`, `questions`, `question_options`.
- Добавлены JPA entities и `UserIdentityService`.
- Добавлен `QuizSessionPersistenceService`.
- Добавлен `UserProgressPersistenceService`.
- Добавлен `ContentCatalogPersistenceService`.

### Telegram Bot

- Bot service запускается отдельно.
- `/start` отвечает сообщением Brain Arena.
- Есть кнопка открытия Telegram Mini App.
- Bot token хранится только в Railway variables, не в репозитории.

### Railway

- Проект разделён на `brainarena-webapp`, `brainarena-api`, `brainarena-bot`, Postgres и Redis.
- Webapp, API и Bot деплоятся отдельными сервисами.
- Java services используют Dockerfile deploy через `RAILWAY_DOCKERFILE_PATH`.

## Ещё не готово для нормального MVP

- Content catalog пока покрывает только первый seeded маршрут.
- Нет unlock logic по звёздам из БД.
- Нет daily ritual API.
- Нет async PvP duel lifecycle.
- Нет ranked leaderboard из backend.
- Нет Telegram deep links для challenge/rematch.
- Нет Telegram Stars invoice skeleton.
- Result screen обновляет карту после возврата, но visual unlock/progress economy ещё черновая.

## Следующий порядок разработки

1. Добавить unlock logic и честные состояния `available/locked/completed/mastered`.
2. Добавить daily ritual поверх того же quiz session engine.
3. Добавить mistake review и personal library shell.
4. Добавить Telegram challenge links и async PvP MVP.
5. После этого подключать Stars invoice skeleton.
