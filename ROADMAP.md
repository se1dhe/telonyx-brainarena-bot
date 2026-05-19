# ROADMAP — Brain Arena Bot

Документ фиксирует практический план дальнейшей разработки Brain Arena после первичной спецификации `README.md`, `SKILLS.md` и `AGENTS.md`.

## 0. Текущее состояние

В репозитории уже закреплены:

- продуктовая идея Brain Arena;
- Roman Temple UI-направление;
- роли агентов Roman / Caesar / Archimedes / Archivarius / Codex;
- MVP-бэклог;
- правила монетизации без pay-to-win;
- базовые доменные сущности.

Следующий шаг — превратить документацию в рабочий skeleton проекта.

---

## 1. Выбор технического стека

### Рекомендуемый путь для этого проекта

Использовать гибрид:

- **Java 21 + Spring Boot 3.x** для backend, Telegram bot, платежей, рейтинга и доменной логики;
- **React + TypeScript + Vite** для Telegram Mini App;
- **PostgreSQL** как основная БД;
- **Redis** для сессий, матчмейкинга, таймеров и rate-limit;
- **RabbitMQ или Redis Streams** позже, когда появятся тяжёлые игровые события;
- **Docker Compose** для локальной разработки;
- **Railway** как основной деплой.

Причина: backend должен быть authoritative source для рейтинга, Telegram initData, Stars, challenge links и результатов.

---

## 2. Целевая структура репозитория

```text
telonyx-brainarena-bot/
  app-bootstrap/          # Spring Boot entrypoint
  app-bot/                # Telegram bot handlers
  app-web/                # REST API controllers
  app-domain/             # чистая доменная логика
  app-persistence/        # JPA/Flyway/PostgreSQL
  app-security/           # Telegram initData, auth, signatures
  app-integration/        # Telegram API, Stars, external APIs
  app-common/             # shared utils/config/contracts

  frontend/               # React Telegram Mini App
    src/
      app/
      components/
      features/
      temple/
      api/
      types/

  docs/
    architecture/
    product/
    content/
    ui/

  docker-compose.yml
  .env.example
  README.md
  SKILLS.md
  AGENTS.md
  PROMT.md
  ROADMAP.md
```

---

## 3. Этап 1 — Foundation

### Цель

Получить запускаемый пустой проект: backend стартует, frontend открывается, Docker Compose поднимает БД и Redis.

### Задачи

1. Создать Gradle multi-module project.
2. Добавить Spring Boot bootstrap.
3. Добавить React/Vite frontend.
4. Добавить Docker Compose:
   - PostgreSQL;
   - Redis;
   - backend;
   - frontend dev server опционально.
5. Добавить `.env.example`.
6. Добавить базовый CI:
   - backend build;
   - frontend build;
   - tests.
7. Добавить health endpoints:
   - `/actuator/health`;
   - `/api/public/config`.

### Definition of Done

- `./gradlew build` проходит.
- `npm run build` во frontend проходит.
- `docker compose up` поднимает Postgres и Redis.
- Backend стартует без Telegram token в dev-profile.

---

## 4. Этап 2 — Domain Core

### Цель

Собрать чистую доменную основу без привязки к Telegram и UI.

### Сущности MVP

- `BrainArenaUser`
- `Category`
- `Question`
- `QuestionOption`
- `QuizSession`
- `UserAnswer`
- `QuizResult`
- `Challenge`
- `Reward`
- `UserProgress`
- `MistakeReview`
- `PaymentTransaction`

### Сервисы MVP

- `QuizSessionService`
- `AnswerValidationService`
- `ResultCalculator`
- `DailyRitualService`
- `ChallengeService`
- `StreakService`
- `RatingService`
- `RewardService`
- `SpacedRepetitionService`

### Первые тесты

- расчёт результата;
- проверка ответа;
- streak extension;
- challenge lifecycle;
- spaced repetition next date;
- запрет pay-to-win ranked perks.

---

## 5. Этап 3 — Backend API

### Публичные endpoints MVP

```text
GET  /api/public/config
GET  /api/categories
POST /api/quiz/daily/start
POST /api/quiz/{sessionId}/answer
POST /api/quiz/{sessionId}/finish
GET  /api/quiz/{sessionId}/result
POST /api/challenges
GET  /api/challenges/{token}
POST /api/challenges/{token}/accept
GET  /api/me
GET  /api/me/progress
GET  /api/me/mistakes
```

### Security

- Telegram initData validation.
- Session/user binding.
- Signed challenge token.
- TTL challenge links.
- Rate limit на старт сессий и ответы.

---

## 6. Этап 4 — Telegram Bot

### Цель

Бот должен быть простой входной точкой в Mini App.

### MVP-функции

- `/start`;
- deep link challenge parsing;
- кнопка `Открыть Brain Arena`;
- кнопка `Ежедневный ритуал`;
- отправка result card;
- rematch CTA;
- Stars payment skeleton.

### Важное правило

Основной UX должен жить в Telegram Mini App, а не в длинном Telegram command-menu.

---

## 7. Этап 5 — Temple Frontend

### Цель

Собрать красивый первый Mini App в Roman Temple style.

### Экраны MVP

1. Home / HeroPanel.
2. Daily Ritual intro.
3. QuizStage.
4. Answer explanation.
5. ResultCard.
6. Challenge opened.
7. Profile / Archivarius shell.
8. Category list.
9. Error / loading / empty states.

### UI-компоненты

- `HeroPanel`
- `TempleButton`
- `MarbleCard`
- `QuizStage`
- `AnswerTablet`
- `ArenaTimer`
- `ResultCard`
- `AchievementSeal`
- `CategoryPill`
- `ProfileScroll`

---

## 8. Этап 6 — Content Pipeline

### Цель

Добавить контролируемое наполнение вопросами.

### MVP

- seed-файл с первыми категориями;
- seed-файл с вопросами;
- проверка обязательных полей;
- `source_note` для фактологических вопросов;
- `is_ranked_eligible`;
- report-flow.

### Категории первого запуска

- История;
- География;
- Наука;
- Спорт;
- Кино;
- Логика;
- История Рима как фирменная категория.

---

## 9. Этап 7 — Analytics & Retention

### События MVP

- `app_open`
- `mode_selected`
- `quiz_started`
- `question_answered`
- `quiz_completed`
- `challenge_created`
- `challenge_opened`
- `challenge_completed`
- `result_shared`
- `streak_extended`
- `reward_granted`
- `question_reported`
- `purchase_completed`

### Retention-фокус

На старте измерять:

- completed daily ritual rate;
- challenge open rate;
- result share rate;
- D1 return;
- D7 return;
- question report rate;
- average session length.

---

## 10. Этап 8 — Monetization

### MVP Stars

- premium profile frame;
- advanced stats;
- extra daily pack;
- cosmetic titles;
- season cosmetics.

### Запрещено

- продажа правильных ответов;
- ranked boosts;
- платные победы;
- преимущество в matchmaking.

---

## 11. Первый конкретный sprint

### Sprint 1: Skeleton + static Temple UI

Задачи:

1. Создать Gradle multi-module skeleton.
2. Создать `frontend` на React/Vite/TypeScript.
3. Добавить Temple tokens.
4. Реализовать статический Home screen.
5. Реализовать моковый Daily Ritual экран.
6. Добавить `.env.example`.
7. Добавить `docker-compose.yml`.
8. Добавить базовые docs по запуску.

Результат sprint:

- проект можно открыть локально;
- виден первый Roman UI;
- backend стартует;
- frontend билдится;
- есть понятная структура для дальнейшей разработки.

---

## 12. Sprint 2: Daily Ritual Domain

Задачи:

1. Добавить доменные модели вопросов и сессий.
2. Реализовать `DailyRitualService`.
3. Реализовать `AnswerValidationService`.
4. Реализовать `ResultCalculator`.
5. Добавить in-memory или seed questions.
6. Подключить API endpoints для daily quiz.
7. Подключить frontend к API.
8. Добавить тесты.

Результат sprint:

- пользователь проходит daily quiz от начала до результата;
- backend считает ответы;
- frontend показывает объяснение и result card.

---

## 13. Sprint 3: Telegram Integration

Задачи:

1. Добавить Telegram bot module.
2. Реализовать `/start`.
3. Добавить WebApp button.
4. Добавить initData validation.
5. Связать Telegram user с backend user.
6. Добавить challenge deep link skeleton.

Результат sprint:

- Mini App открывается из Telegram;
- пользователь валидируется через Telegram;
- можно начинать делать реальные challenge links.
