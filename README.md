# Brain Arena Bot

Brain Arena — Telegram-first quiz-trivia продукт в римской эстетике: Telegram Bot + Telegram Mini App + backend + личный кабинет знаний.

Проект строится не как обычная викторина, а как интеллектуальная арена с ежедневными ритуалами, асинхронными дуэлями, прогрессом по категориям, личной библиотекой и честной Telegram Stars монетизацией.

## Product Vision

Brain Arena должен давать пользователю ощущение личной империи знаний:

- быстрый вход в игру за 30–90 секунд;
- ежедневный ритуал на 3–7 вопросов;
- асинхронные вызовы друзьям через Telegram;
- категории, главы и mini-quests;
- прогресс в виде мозаики/витража/печатей;
- сохранённые тесты и словарь терминов;
- премиальный светлый Roman UI;
- монетизация без pay-to-win.

## Core Skills

Правила проекта описаны в двух главных документах:

- [`SKILLS.md`](./SKILLS.md) — архитектура навыков продукта: Temple, Codex, Archivarius, Caesar, Archimedes.
- [`AGENTS.md`](./AGENTS.md) — инструкция для coding agents: роли, правила кода, UI, домена, контента и Git workflow.

Любой агент или разработчик обязан читать эти файлы перед началом работы.

## Main Product Loops

```text
Open App
  → Daily Ritual / Duel / Category Quest
  → Answer Questions
  → Explanation
  → Reward / Progress
  → Share / Challenge / Rematch
  → Return Tomorrow
```

## MVP Priority

Первый рабочий MVP должен включать:

1. Telegram Mini App shell.
2. Roman Temple UI-kit.
3. Daily Ritual flow.
4. QuizStage для прохождения вопросов.
5. ResultCard для шаринга результата.
6. Async Challenge deep links.
7. User profile / Archivarius cabinet shell.
8. Basic analytics events.
9. Question report-flow.
10. Telegram Stars premium skeleton.

## Current Frontend Direction

Существующий прототип описывает направление Roman Codex Quiz:

- React 18;
- TypeScript strict;
- Vite;
- TailwindCSS;
- Framer Motion;
- lucide-react.

Telegram Apps SDK должен подключаться отдельным шагом после выбора актуального пакета и схемы валидации `initData`.

## Recommended Architecture

```text
apps/
  webapp/      # Telegram Mini App
  bot/         # Telegram bot entrypoint
  api/         # Backend API
  admin/       # Content/admin panel, позже

packages/
  ui/          # Roman Temple UI-kit
  domain/      # Quiz, rating, streak, challenge logic
  shared/      # Shared types/config
  analytics/   # Event contracts

docs/
  product/
  architecture/
  content/
```

## Design Direction

Brain Arena использует Roman Temple style:

- светлый молочный фон;
- мраморные карточки;
- золото/латунь как акцент;
- мягкие каменные тени;
- симметрия;
- лавровые венки, короны, печати, колонны;
- спокойные анимации без дешёвого игрового шума.

## Monetization Rule

Premium не должен ломать честность игры.

Можно продавать:

- косметику;
- профильные рамки;
- расширенную статистику;
- extra daily packs;
- season pass cosmetics.

Нельзя продавать:

- победы;
- правильные ответы;
- ranked boosts;
- нечестные подсказки в рейтинговом режиме.

## Next Development Steps

1. Проверить текущую структуру проекта и привести её к `apps/*` + `packages/*`.
2. Добавить `packages/ui` с Temple tokens.
3. Вынести доменную логику в `packages/domain`.
4. Реализовать Daily Ritual как первый основной loop.
5. Реализовать ResultCard и challenge link flow.
6. Подключить Telegram initData validation.
7. Добавить analytics event contracts.
8. Подготовить Stars payment skeleton.
