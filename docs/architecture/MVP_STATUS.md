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
- Первая точка карты открывает playable quiz panel.
- Ответы больше не проверяются на клиенте локально для live API.
- После завершения точки показывается result panel со звёздами и возвратом к карте.

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
- Есть Telegram initData validation.
- Есть `GET /api/me` с backend validation и upsert Telegram user.

### Persistence

- Подключены PostgreSQL, JPA, Flyway.
- Flyway закреплён на версии с поддержкой Railway PostgreSQL 18.
- Railway `DATABASE_URL` конвертируется в JDBC properties.
- Добавлена миграция `users` и `telegram_accounts`.
- Добавлена миграция `quiz_sessions` и `quiz_answers`.
- Добавлены JPA entities и `UserIdentityService`.
- Добавлен `QuizSessionPersistenceService`.

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

- Вопросы, главы и прогресс пока не перенесены в PostgreSQL.
- Нет таблиц `courses`, `chapters`, `chapter_nodes`, `questions`, `question_options`.
- Нет сохранения результата прохождения точки.
- Нет unlock logic по звёздам из БД.
- Нет daily ritual API.
- Нет async PvP duel lifecycle.
- Нет ranked leaderboard из backend.
- Нет Telegram deep links для challenge/rematch.
- Нет Telegram Stars invoice skeleton.
- Result screen пока не обновляет карту прогресса после возврата.

## Следующий порядок разработки

1. Перенести контент глав и вопросов в Flyway seed.
2. Добавить persisted quiz sessions, answers, attempts и chapter progress.
3. Сделать result screen после завершения точки.
4. Подключить карту к сохранённому прогрессу.
5. Добавить daily ritual поверх того же quiz session engine.
6. После этого начинать PvP MVP.
