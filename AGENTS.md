# AGENTS — Brain Arena Bot

Этот файл описывает, как Codex, Antigravity, Cursor, Claude Code, GitHub Copilot и любые другие coding agents должны работать с проектом Brain Arena.

Проект строится как Telegram-first quiz-trivia сервис в римской эстетике: Telegram Bot + Telegram Mini App + backend + admin/content tools.

## 1. Главный принцип

Не делай «просто викторину».

Делай интеллектуальную арену с:

- ежедневным ритуалом;
- асинхронными дуэлями;
- прогрессом по категориям;
- личной библиотекой;
- премиальным Roman UI;
- Telegram-native sharing;
- честной монетизацией через Stars.

Перед любым изменением прочитай `SKILLS.md`.

---

## 2. Роли агентов

### Agent: Roman

Отвечает за UI, визуальный язык и Telegram Mini App frontend.

Обязанности:

- реализует Temple UI-kit;
- создаёт компоненты `HeroPanel`, `QuizStage`, `Achievement`, `ResultCard`;
- следит за светлой римской палитрой;
- не допускает neon/cyberpunk/тяжёлый dark UI;
- делает адаптивный mobile-first интерфейс;
- добавляет loading/empty/error states;
- следит за доступностью: контраст, touch targets, читаемость.

Правила Roman:

- все карточки должны выглядеть как мраморные/каменные плиты;
- главный CTA всегда визуально спокойный и премиальный;
- анимации — fade/rise/scroll/seal, без хаотичных эффектов;
- SVG-иконки лучше держать локально в проекте;
- использовать дизайн-токены из `SKILLS.md`.

---

### Agent: Caesar

Отвечает за продуктовые механики, retention, монетизацию и социальные петли.

Обязанности:

- проектирует Daily Ritual;
- проектирует async challenges;
- проектирует streak и reward economy;
- следит, чтобы ranked не был pay-to-win;
- добавляет Telegram share/rematch/referral loops;
- формирует события аналитики;
- проектирует Stars subscription и premium perks.

Правила Caesar:

- первая цель — D1/D7 retention, а не сложность;
- daily loop важнее live-show;
- async challenge важнее тяжёлых кланов на старте;
- premium продаёт комфорт, косметику и статистику, а не победы;
- любые уведомления должны быть контекстными, а не спамом.

---

### Agent: Archimedes

Отвечает за backend, доменную модель, безопасность, интеграции и качество кода.

Обязанности:

- создаёт чистую архитектуру;
- держит сервер authoritative source;
- валидирует Telegram initData;
- реализует доменную логику quiz/challenge/rating/streak;
- добавляет тесты;
- проектирует БД;
- обеспечивает idempotency платежей;
- пишет понятную документацию.

Правила Archimedes:

- не хранить критичный state только в Telegram CloudStorage;
- ranked answer validation только через backend;
- payment callbacks должны быть идемпотентными;
- challenge links должны иметь TTL и подпись;
- доменная логика не должна жить в контроллерах;
- каждый модуль должен иметь понятную ответственность.

---

### Agent: Archivarius

Отвечает за контент, словарь, кабинет и историю прогресса.

Обязанности:

- проектирует личную библиотеку пользователя;
- хранит saved tests;
- хранит glossary terms;
- ведёт timeline действий;
- проектирует mistake archive;
- помогает с контентной структурой `Course → Chapter → MiniQuest`.

Правила Archivarius:

- ошибки пользователя называются «на повторение», а не «провал»;
- каждый сложный термин должен иметь короткое объяснение;
- пользователь должен видеть свой интеллектуальный след;
- прогресс показывается спокойно: мозаика, витраж, таблички, печати.

---

### Agent: Codex

Отвечает за генерацию и качество вопросов.

Обязанности:

- создаёт структуру контента;
- следит за объяснениями;
- проверяет дистракторы;
- размечает сложность;
- поддерживает разные типы вопросов;
- добавляет report-flow.

Правила Codex:

- у каждого вопроса должно быть объяснение;
- в ranked можно использовать только проверенный контент;
- ambiguous questions запрещены;
- AI-generated questions должны проходить редакторский слой;
- для исторических/научных вопросов нужно хранить source note.

---

## 3. Техническая стратегия

Так как репозиторий стартует с нуля, сначала создать skeleton. Рекомендуемый стек можно выбрать после отдельного решения, но базовые варианты такие.

### Вариант A: Java/Spring Boot

Подходит, если проект делается как production Telegram bot/backend на Java.

```text
app-bootstrap/
app-bot/
app-web/
app-domain/
app-persistence/
app-integration/
app-security/
app-common/
frontend/
docs/
```

Рекомендуется:

- Java 21;
- Spring Boot 3.x;
- Gradle;
- PostgreSQL;
- Redis;
- TelegramBots Java API;
- Flyway;
- Docker Compose.

### Вариант B: TypeScript Monorepo

Подходит, если Mini App frontend и backend нужно быстрее развивать в одном JS/TS стеке.

```text
apps/api/
apps/bot/
apps/webapp/
apps/admin/
packages/domain/
packages/ui/
packages/shared/
packages/analytics/
docs/
```

Рекомендуется:

- TypeScript;
- React/Vite;
- NestJS или Fastify;
- PostgreSQL;
- Redis;
- grammY/Telegraf;
- Prisma/Drizzle;
- Docker Compose.

### Выбор по умолчанию

Если пользователь не уточнил стек, использовать TypeScript monorepo для скорости UI/Mini App разработки. Если пользователь просит Java — использовать Java 21 + Spring Boot 3.x.

---

## 4. MVP Backlog

Работать в таком порядке:

### Этап 1 — Foundation

- создать структуру репозитория;
- добавить README;
- добавить `.env.example`;
- добавить Docker Compose;
- добавить базовые docs;
- добавить линтер/форматтер;
- добавить CI.

### Этап 2 — Domain

Модели:

- User;
- Category;
- Question;
- QuizSession;
- Answer;
- Challenge;
- Reward;
- UserProgress;
- MistakeReview;
- PaymentTransaction.

Сервисы:

- QuizSessionService;
- AnswerValidationService;
- ResultCalculator;
- ChallengeService;
- StreakService;
- RatingService;
- RewardService;
- SpacedRepetitionService.

### Этап 3 — Telegram

- bot start/deep link;
- Telegram initData validation;
- launch Mini App button;
- challenge deep links;
- result sharing;
- Stars payment skeleton.

### Этап 4 — WebApp

- Temple tokens;
- HeroPanel;
- Daily Ritual screen;
- QuizStage;
- ResultCard;
- Achievement modal;
- Profile/Cabinet shell;
- Category screen.

### Этап 5 — Analytics

События:

- app_open;
- onboarding_completed;
- mode_selected;
- quiz_started;
- question_answered;
- quiz_completed;
- challenge_created;
- challenge_completed;
- result_shared;
- streak_extended;
- reward_granted;
- question_reported;
- purchase_completed.

---

## 5. Coding Rules

### Общие правила

- Пиши простой поддерживаемый код.
- Не смешивай UI, API и доменную логику.
- Не создавай огромные классы/компоненты.
- Не добавляй магические строки без констант.
- Не делай ranked зависимым от клиента.
- Не доверяй Telegram user data без валидации initData.
- Не добавляй pay-to-win.
- Не ломай мобильный UX.

### Комментарии

Комментарии должны объяснять бизнес-логику, а не очевидный синтаксис.

Хорошо:

```ts
// Ranked-режим не допускает платные подсказки, чтобы не ломать доверие к рейтингу.
```

Плохо:

```ts
// Увеличиваем i на 1.
```

### Ошибки

Каждый пользовательский flow должен иметь:

- loading state;
- empty state;
- recoverable error;
- retry action;
- fallback text.

---

## 6. UI Rules for Agents

Использовать только Roman Temple style:

- светлый фон;
- тёплые каменные поверхности;
- золотые акценты;
- мягкие тени;
- симметрия;
- спокойные анимации;
- римские SVG-детали.

Запрещено:

- dark cyberpunk;
- glassmorphism с кислотным свечением;
- neon gradients;
- игровые lootbox-анимации;
- агрессивные shake/pulse effects;
- перегруз иконками.

---

## 7. Domain Rules

### Rating

- `IQ` в UI можно использовать как брендовый термин.
- Внутри системы это `skillScore`.
- Не заявлять, что игра измеряет настоящий IQ.
- Новички проходят placement matches.
- Matchmaking должен защищать слабых новичков от сильных игроков.

### Streak

- Streak строится вокруг Daily Ritual.
- Один мягкий streak-save в неделю допустим.
- Нельзя превращать streak в источник тревоги.

### Rewards

- Награды косметические и статусные.
- Редкость должна быть понятна.
- Награды не дают нечестного преимущества в ranked.

### Payments

- Telegram Stars — основной путь для цифровых товаров.
- Все платежи идемпотентны.
- Premium даёт: косметику, статистику, extra daily packs, профильные рамки.
- Premium не даёт: правильные ответы, победы, ranked boosts.

---

## 8. Content Rules

Каждый вопрос содержит:

```text
id
language
category_id
type
difficulty
question_text
options
correct_answer
explanation
source_note
is_ranked_eligible
created_at
updated_at
```

Question types для MVP:

- single_choice;
- true_false;
- multi_select;
- order;
- image_choice;
- text_answer.

Качество:

- не использовать спорный факт без объяснения;
- не использовать несколько правильных ответов в single choice;
- дистракторы должны быть правдоподобными;
- объяснение должно быть коротким;
- сложность должна калиброваться по статистике ответов.

---

## 9. Git Workflow

- Работать через маленькие коммиты.
- Для больших изменений создавать ветку.
- Названия веток:
  - `feature/daily-ritual`
  - `feature/temple-ui-kit`
  - `feature/async-challenges`
  - `feature/archivarius-cabinet`
  - `fix/telegram-init-data`
- Коммиты:
  - `feat: add daily ritual flow`
  - `feat: add temple ui tokens`
  - `fix: validate telegram init data hash`
  - `docs: add content pipeline`

---

## 10. Definition of Done

Перед завершением задачи агент обязан проверить:

- фича соответствует `SKILLS.md`;
- код компилируется;
- есть тесты на доменную логику;
- нет pay-to-win;
- есть мобильные состояния;
- есть analytics event;
- есть обработка ошибок;
- обновлена документация;
- UI не выбивается из Roman Temple style.

---

## 11. Immediate Next Task

После добавления `SKILLS.md` и `AGENTS.md` следующий агент должен:

1. выбрать стек проекта;
2. создать skeleton репозитория;
3. добавить README с описанием Brain Arena;
4. добавить `.env.example`;
5. добавить базовый Docker Compose;
6. реализовать первый статический Temple UI экран;
7. реализовать доменные модели Daily Ritual и QuizSession.
