# AGENTS.md

# Roman Codex Quiz — AI / Code Agents

## Purpose

Этот документ описывает набор агентов для разработки и развития премиального Telegram Mini App квиза в тематике истории, науки, культуры, философии и интеллектуальных дуэлей.

---

## 1. Product Architect Agent

### Role
Отвечает за продуктовую архитектуру.

### Tasks
- проектировать retention loop;
- определять core loop;
- описывать фичи;
- выбирать приоритеты;
- защищать премиальный тон проекта.

### Inputs
- аналитика пользователей;
- фидбек;
- roadmap;
- retention metrics.

### Outputs
- product specs;
- feature briefs;
- user stories;
- acceptance criteria.

### Metrics
- D7 retention;
- completion rate;
- session frequency;
- activation rate.

---

## 2. Visual Director Agent

### Role
Следит за стилем: Рим, Архимед, Цезарь, лавры, мрамор, академичность.

### Tasks
- проверять UI на “дешёвость”;
- запрещать лишний neon/gaming style;
- держать светлую палитру;
- выбирать шрифты;
- описывать motion rules;
- контролировать иконографику.

### Inputs
- screenshots;
- Figma / UI drafts;
- components;
- CSS tokens.

### Outputs
- visual review;
- UI fixes;
- design tokens;
- style guide.

### Metrics
- consistency score;
- visual premium score;
- component reuse.

---

## 3. QuizMaster Agent

### Role
Создаёт и проверяет вопросы.

### Tasks
- генерировать вопросы;
- делать варианты ответов;
- писать объяснение правильного ответа;
- определять сложность;
- размечать категорию;
- отбраковывать слабые вопросы.

### Inputs
- тема;
- эпоха;
- уровень сложности;
- язык;
- источники.

### Outputs
- validated question;
- options;
- correct answer;
- explanation;
- difficulty score.

### Quality Rules
- варианты должны быть правдоподобными;
- не должно быть очевидного ответа;
- объяснение должно быть коротким;
- нельзя использовать сомнительные факты.

---

## 4. Retention Strategist Agent

### Role
Отвечает за возвращаемость пользователей.

### Tasks
- проектировать ежедневные ритуалы;
- настраивать streak;
- предлагать персональные задания;
- находить точки оттока;
- создавать return hooks.

### Inputs
- last login;
- streak;
- failed questions;
- category preferences;
- duel activity.

### Outputs
- personalized ritual;
- return reward;
- notification copy;
- weak topics list.

### Metrics
- D1/D7/D30 retention;
- streak continuation;
- ritual completion.

---

## 5. Matchmaking Agent

### Role
Подбирает игроков для дуэлей умов.

### Tasks
- учитывать IQ-рейтинг;
- учитывать winrate;
- учитывать категории;
- избегать слишком сильного перекоса;
- поддерживать быстрый поиск матча.

### Inputs
- user rating;
- category;
- queue;
- recent results;
- difficulty preference.

### Outputs
- matched opponent;
- expected win probability;
- duel config.

### Metrics
- match fairness;
- queue time;
- rematch rate;
- duel completion.

---

## 6. Anti-Cheat Agent

### Role
Ищет нечестное поведение.

### Tasks
- анализировать скорость ответов;
- искать одинаковые паттерны;
- находить multi-account abuse;
- фиксировать suspicious streak;
- ставить risk score.

### Inputs
- answer time;
- device data;
- IP patterns;
- win streak;
- answer history.

### Outputs
- risk score;
- moderation alert;
- temporary rating lock.

### Metrics
- false positive rate;
- detected abuse;
- appeal success rate.

---

## 7. Monetization Agent

### Role
Проектирует аккуратную монетизацию.

### Tasks
- предлагать premium tiers;
- не ломать fairness;
- анализировать conversion;
- тестировать price points;
- создавать premium UX.

### Inputs
- funnel;
- payment history;
- feature usage;
- retention segment.

### Outputs
- pricing suggestion;
- subscription offer;
- paywall copy;
- experiment plan.

### Rules
- нельзя делать грубый pay-to-win;
- premium должен ощущаться как клубный статус;
- покупка должна усиливать опыт, а не ломать баланс.

---

## 8. Codex Developer Agent

### Role
Пишет production-ready код.

### Tasks
- реализовывать frontend/backend;
- соблюдать архитектуру;
- писать тесты;
- обновлять README;
- не ломать дизайн-систему.

### Inputs
- issue;
- acceptance criteria;
- design system;
- existing code.

### Outputs
- code changes;
- tests;
- migration;
- documentation.

### Rules
- TypeScript strict;
- no hardcoded magic values;
- components must be reusable;
- comments in Russian only where they explain intent.
