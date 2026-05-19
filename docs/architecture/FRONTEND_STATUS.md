# FRONTEND_STATUS — Текущий frontend Brain Arena

В проекте уже есть начальный frontend. Его нельзя удалять или переписывать с нуля без отдельного решения.

## 1. Текущее состояние

Frontend уже реализован как Telegram Mini App prototype на:

- React 18;
- TypeScript;
- Vite;
- TailwindCSS;
- Framer Motion;
- lucide-react.

Основной entrypoint:

```text
src/main.tsx
src/App.tsx
src/pages/Home.tsx
src/styles/global.css
src/theme/content.ts
```

`App.tsx` сейчас рендерит `Home`.

`Home.tsx` уже содержит первый большой экран Brain Arena:

- header Brain Arena;
- рейтинг игрока;
- выбор категорий;
- карту прохождения главы;
- активную точку/этап;
- daily modes;
- PvP duel card;
- leaderboard;
- profile card;
- bottom navigation.

`src/theme/content.ts` содержит mock-данные для игрока, категорий, карты, дуэли, лидерборда и daily modes.

`src/styles/global.css` содержит текущий Roman Temple визуальный стиль: мраморные карточки, золотые акценты, карта, узлы, кнопки, навигация.

## 2. Главный принцип дальнейшей работы

Не создавать frontend заново.

Нужно развивать существующий UI:

1. Разнести `Home.tsx` на отдельные компоненты.
2. Вынести mock-данные в typed contracts.
3. Добавить routing/state machine для экранов.
4. Подключить Telegram WebApp SDK.
5. Подключить backend API.
6. Заменять mock-данные реальными endpoint-ответами постепенно.

## 3. Целевая структура frontend

```text
src/
  app/
    App.tsx
    routes.tsx
    providers/
  api/
    client.ts
    telegram.ts
    contracts.ts
  components/
    temple/
      TempleButton.tsx
      MarbleCard.tsx
      ArenaBadge.tsx
    layout/
      BottomNav.tsx
      AppHeader.tsx
  features/
    home/
      HomeScreen.tsx
      RatingCard.tsx
      CategoryStrip.tsx
    chapters/
      ChapterMapScreen.tsx
      ChapterMapCard.tsx
      ChapterNode.tsx
      ChapterPath.tsx
      NodeStars.tsx
    daily/
      DailyModes.tsx
      DailyRitualScreen.tsx
      QuizStage.tsx
    pvp/
      DuelCard.tsx
      ArenaScreen.tsx
      DuelResultScreen.tsx
    ranked/
      Leaderboard.tsx
      RankedProfileCard.tsx
      SeasonOverview.tsx
    profile/
      ProfileCard.tsx
  styles/
    global.css
  theme/
    content.ts
    tokens.ts
  types/
```

## 4. Telegram подключение

Frontend должен подключаться к Telegram как Mini App.

MVP-задачи:

- добавить wrapper для `window.Telegram.WebApp`;
- вызвать `ready()`;
- вызвать `expand()`;
- читать `initData` и `initDataUnsafe`;
- отправлять `initData` на backend для валидации;
- не доверять Telegram user data без backend validation;
- учитывать safe-area inset;
- поддерживать мобильный Telegram viewport.

## 5. Backend API подключение

Сначала подключать реальные данные только в ключевых местах:

1. `/api/public/config`
2. `/api/me`
3. `/api/chapters/{chapterSlug}/map`
4. `/api/quiz/daily/start`
5. `/api/pvp/duels/async/start`
6. `/api/ranked/leaderboard/global`

До готовности backend разрешено использовать mock fallback, но он должен быть явно отделён от API client.

## 6. Ближайшие frontend-задачи

### Sprint Frontend 1

- [x] перенести `App.tsx` в `src/app/App.tsx`;
- [x] разбить `Home.tsx` на компоненты;
- [x] создать `features/chapters` и вынести карту главы;
- [x] создать `features/pvp` и вынести DuelCard;
- [x] создать `features/ranked` и вынести Leaderboard;
- [ ] создать `components/temple` для общих UI-компонентов;
- [x] добавить typed mock contracts.

### Sprint Frontend 2

- [x] добавить Telegram WebApp wrapper;
- [x] добавить API client;
- добавить loading/error states;
- подключить `/api/public/config`;
- подготовить авторизацию через Telegram initData.

## 7. Запреты для агентов

- не удалять текущий Roman UI;
- не заменять его на dark/cyberpunk/casino style;
- не переписывать весь frontend ради чистоты;
- не хранить ranked/result state только на клиенте;
- не подключать Telegram user как trusted без backend validation;
- не смешивать mock-данные и API без явного слоя адаптера.

## 8. Definition of Done

Frontend считается правильно развиваемым, если:

- текущий visual direction сохранён;
- компоненты разнесены по features;
- mock-данные типизированы;
- Telegram SDK подключён через отдельный wrapper;
- backend API подключается через единый client;
- каждый экран имеет loading/error/empty state;
- карта глав, PvP и рейтинги остаются центральными элементами продукта.
