# SKILLS — Brain Arena Skill Architecture

Этот документ фиксирует рабочие навыки проекта Brain Arena. Любой агент, разработчик или генератор кода должен использовать его как источник правил для UI, игровой логики, контента, прогресса и пользовательского кабинета.

## 0. Product North Star

Brain Arena — это Telegram Mini App / Telegram bot quiz-trivia продукт в римской эстетике: не дешёвая викторина, а ощущение личной интеллектуальной арены, библиотеки и ритуала знаний.

Главная цель продукта:

- быстрый вход в игру за 30–90 секунд;
- ежедневный ритуал на 5 минут;
- асинхронные вызовы друзьям;
- прогресс по курсам, главам и темам;
- премиальный светлый UI в эстетике Рима;
- аккуратная Telegram Stars монетизация без pay-to-win.

Ключевые продуктовые опоры:

1. Самодоказательство: рейтинг, дуэли, лидерборды, streak.
2. Ежедневная привычка: daily ritual, вопрос дня, цитата дня, micro-quest.
3. Социальное распространение: challenge links, result cards, rematch.
4. Личная библиотека: сохранённые тесты, термины, история прохождений.

---

## 1. Skill: Temple — Roman UI Kit

### Цель

Держать визуальную дисциплину проекта. Любой экран Brain Arena должен ощущаться как часть единой римской интеллектуальной системы: храм знаний, мрамор, золото, симметрия, спокойная премиальность.

### Визуальные правила

- Основная палитра: белый, молочный, тёплый камень, светлый песок.
- Акценты: золото, латунь, бронза, тёплый коричневый.
- Запрещено: кислотный неон, cyberpunk, тяжёлые чёрные фоны, шумные цветные тени.
- Тени: только мягкие, каменные, рассеянные.
- Геометрия: симметрия, центральная ось, карточки как таблички/плиты.
- Иконки: минимум. Если нужны — только собственные SVG: лавровый венок, корона, колонна, печать, свиток.
- Заголовки: крупные, с характером капителей/засечек.
- Подписи и интерфейсный текст: humanist sans, читаемый, лёгкий.
- Анимации: медленные, плавные, уважительные. Никаких шумных свайпов, тряски, конфетти-хаоса.

### Дизайн-токены

```css
:root {
  --ba-bg: #f8f3ea;
  --ba-surface: #fffaf2;
  --ba-surface-strong: #ffffff;
  --ba-stone: #e7dac6;
  --ba-stone-dark: #cdbb9f;
  --ba-gold: #c59a3d;
  --ba-brass: #a9792b;
  --ba-bronze: #7a5425;
  --ba-ink: #2d2418;
  --ba-muted: #7d6e5b;
  --ba-danger: #9b3d2e;
  --ba-success: #567a45;

  --ba-radius-card: 24px;
  --ba-radius-button: 999px;
  --ba-shadow-soft: 0 18px 45px rgba(63, 48, 29, 0.10);
  --ba-shadow-card: 0 10px 30px rgba(63, 48, 29, 0.08);
  --ba-border-stone: 1px solid rgba(126, 96, 48, 0.18);
}
```

### Базовые компоненты

#### HeroPanel

Заглавный блок главного экрана.

Обязательные элементы:

- заголовок: «Империя знаний» или режимная формулировка;
- короткий подзаголовок;
- CTA на ежедневный ритуал;
- вторичный CTA на дуэль/арену;
- фоновая мягкая колонна/венок/печать.

Поведение:

- появляется через fade + slight rise;
- не прыгает;
- не занимает весь экран на мобильном.

#### QuizStage

Экран прохождения вопросов.

Обязательные элементы:

- вопрос как центральная карточка;
- варианты ответа как каменные таблички;
- индикатор прогресса в виде мозаики/ступеней;
- спокойный таймер, если режим требует;
- после ответа — короткое объяснение.

Правила:

- смена карточек плавная;
- нельзя использовать агрессивные swipe-анимации;
- правильный ответ подсвечивается золотом/зелёным, неправильный — приглушённым красным;
- пользователь всегда должен понимать, почему ответ верный.

#### Achievement

Награда за streak, редкость, главу или сезон.

Виды:

- лавровый венок;
- корона;
- печать;
- мраморная табличка;
- свиток.

Правила:

- награда вручается как «печать на свитке», а не как дешёвый бейдж;
- обязательно есть микротекст: почему пользователь получил трофей;
- редкость должна быть понятна цветом/рамкой, но без перегруза.

#### ResultCard

Карточка результата для шаринга в Telegram.

Обязательные элементы:

- имя/аватар игрока;
- режим;
- результат;
- streak/rank delta;
- CTA: «Бросить вызов»;
- фирменная римская рамка.

---

## 2. Skill: Codex — Quiz Content & Mechanics

### Цель

Сделать квизы длинными, дорогими по ощущению и пригодными для удержания. Brain Arena должен быть не набором случайных вопросов, а системой освоения знаний.

### Контентная структура

```text
Course
  Chapter
    MiniQuest
      Question
      Explanation
      TermLinks
      Reward
```

Пример:

```text
Course: История Рима
  Chapter: Республика
    MiniQuest: Падение царской власти
      5 вопросов
      1 цитата
      2 термина в словарь
      1 печать прогресса
```

### Главные игровые режимы

#### Daily Ritual

Ежедневный режим на 3–7 вопросов.

Цель:

- сформировать привычку;
- дать быстрый безопасный вход;
- не давить рейтингом.

Правила:

- длительность: 2–5 минут;
- один главный CTA на главном экране;
- серия streak;
- мягкий streak-save не чаще 1 раза в неделю;
- после завершения — результат, объяснения, награда, CTA на challenge.

#### Daily Quote

Цитата дня из философов, историков, правителей, учёных.

Правила:

- цитата короткая;
- обязательно 1–2 предложения контекста;
- можно привязать к вопросу дня;
- стиль подачи: интеллектуальный, спокойный, без пафосной мотивации.

#### Async Duel

Асинхронный вызов игрока.

Цель:

- Telegram-native virality;
- возврат пользователя;
- rematch loop.

Правила:

- один пользователь проходит сет вопросов и отправляет вызов;
- второй проходит тот же или эквивалентный сет;
- результат сравнивается по правильности, скорости, серии;
- после завершения предлагается реванш;
- ссылка должна работать как deep link в Telegram.

#### Ranked Arena

Соревновательный режим.

Правила:

- рейтинг — игровой skill-score, не реальный психометрический IQ;
- новичку нужны placement matches;
- нельзя продавать преимущества за деньги в строгом ranked;
- matchmaking должен учитывать силу игрока и историю ошибок;
- поражение не должно ломать мотивацию новичка.

#### Category Mastery

Освоение категорий.

Правила:

- пользователь выбирает любимые темы на онбординге;
- каждая категория имеет уровни и главы;
- ошибки возвращаются через интервальные повторения;
- прогресс показывается как мозаика/витраж/таблички.

### Типы вопросов

P1:

- single choice;
- true/false;
- multi-select;
- order/chronology;
- image question;
- text answer with fuzzy matching.

P2:

- matching;
- fill-in-the-blank;
- numeric estimation;
- map/click question.

P3:

- audio question;
- video question;
- live tournament questions;
- creator/user-generated packs.

### Spaced Repetition

Ошибки возвращаются по простой схеме:

- первая ошибка: повтор через 24 часа;
- повторная ошибка: 72 часа;
- сложный вопрос: 168 часов;
- после правильного ответа серия сбрасывается или переводится на следующий интервал.

Минимальная модель:

```text
user_id
question_id
wrong_count
last_seen_at
next_review_at
mastery_state
```

### Content Quality Rules

Каждый вопрос обязан иметь:

- вопрос;
- правильный ответ;
- дистракторы;
- короткое объяснение;
- категорию;
- сложность;
- язык;
- источник/заметку редактора, если вопрос фактологический;
- флаг возможности показа в ranked.

Запрещено:

- спорные вопросы без объяснения;
- вопросы с двумя возможными правильными ответами, если режим single choice;
- токсичный, политически провокационный или унизительный контент;
- сложные формулировки ради сложности.

---

## 3. Skill: Archivarius — Personal Library & Cabinet

### Цель

Создать ощущение личной библиотеки игрока. Пользователь должен видеть не только рейтинг, но и свой интеллектуальный след: что прошёл, где ошибался, какие термины сохранил, какие главы освоил.

### Главные разделы

#### Saved Tests

Пользователь может сохранить:

- интересный тест;
- сложный вопрос;
- подборку по теме;
- дуэльный сет.

#### Glossary

Словарь сложных терминов.

Запись термина содержит:

- термин;
- краткое объяснение;
- связанный вопрос;
- категорию;
- дату добавления;
- статус освоения.

#### Timeline

Хронология действий:

- завершил daily ritual;
- выиграл дуэль;
- открыл главу;
- получил печать;
- исправил старую ошибку;
- сохранил термин.

#### Mistake Archive

Архив ошибок.

Правила:

- ошибки не стыдят пользователя;
- формулировка: «На повторение», а не «Провалено»;
- есть CTA пройти короткую репетицию;
- показывается прогресс исправления.

---

## 4. Skill: Caesar — Retention, Economy & Social Loops

### Цель

Удерживать пользователя через правильные игровые петли, а не через спам.

### Core Loop

```text
Open App
  → Daily Ritual / Duel / Category Quest
  → Answer Questions
  → Explanation
  → Reward / Progress
  → Share / Challenge / Rematch
  → Return Tomorrow
```

### P1-функции

- Daily micro-quiz.
- Async challenges.
- Category mastery.
- Result card sharing.
- Personalized onboarding.
- Placement matches.
- Question report-flow.
- Basic analytics events.

### Монетизация

Разрешённые ранние модели:

- Telegram Stars subscription;
- cosmetic frames;
- profile titles;
- extra daily packs;
- advanced stats;
- season pass cosmetics.

Запрещено на старте:

- pay-to-win в ranked;
- покупка побед;
- платные правильные ответы в рейтинговом режиме;
- агрессивные interstitial-ads.

### Referral Loop

- пользователь делится result card;
- друг открывает deep link;
- проходит первый короткий режим;
- оба получают мягкую награду;
- награда не должна ломать ranked.

---

## 5. Skill: Archimedes — Engineering Discipline

### Цель

Держать проект технически чистым, расширяемым и готовым к Telegram Mini App + bot backend.

### Предпочтительная архитектура

```text
apps/
  bot/
  webapp/
  admin/

packages/
  ui/
  domain/
  api-client/
  config/
  analytics/

docs/
  product/
  architecture/
  content/
```

Если проект на Java/Spring:

```text
app-bootstrap
app-bot
app-web
app-domain
app-persistence
app-integration
app-security
app-common
```

Если проект на TypeScript/Node:

```text
apps/bot
apps/webapp
apps/api
packages/domain
packages/ui
packages/shared
```

### Backend Rules

- Сервер является authoritative source для рейтинга, матчей, платежей и прогресса.
- Нельзя хранить критический state только в Telegram CloudStorage.
- Все платежи Telegram Stars должны иметь idempotency.
- Все challenge links должны иметь TTL и подпись.
- Ranked answers должны отправляться на сервер с проверкой тайминга.
- Вопросы для ranked должны выбираться сервером.

### Analytics Events

Минимальный набор событий:

```text
app_open
onboarding_started
onboarding_completed
mode_selected
quiz_started
question_answered
quiz_completed
challenge_created
challenge_opened
challenge_completed
result_shared
streak_extended
streak_broken
reward_granted
category_progressed
mistake_added
mistake_reviewed
purchase_viewed
purchase_started
purchase_completed
question_reported
```

### Testing Rules

Обязательно покрывать тестами:

- расчёт результата;
- рейтинг;
- streak;
- spaced repetition;
- challenge lifecycle;
- Telegram initData validation;
- Stars payment idempotency;
- question selection;
- answer validation.

---

## 6. Definition of Done

Любая новая фича считается готовой только если:

- соответствует Temple UI rules;
- не ломает Daily Ritual;
- имеет analytics events;
- имеет empty/loading/error states;
- поддерживает мобильный Telegram WebApp;
- не содержит pay-to-win для ranked;
- имеет минимум один тест на доменную логику;
- описана в README или docs;
- не добавляет шумных визуальных эффектов;
- поддерживает русский язык как базовый.

---

## 7. First Build Priority

Начинать разработку нужно в таком порядке:

1. Skeleton репозитория.
2. Domain модели: User, Question, QuizSession, Answer, Category, Challenge, Reward.
3. Temple UI tokens и базовые компоненты.
4. Daily Ritual flow.
5. QuizStage.
6. ResultCard sharing.
7. Async Challenge.
8. Archivarius cabinet.
9. Category Mastery.
10. Telegram Stars premium layer.
