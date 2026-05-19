# Roman Codex Quiz

Telegram Mini App для интеллектуального квиза в светлой премиальной эстетике Рима, Архимеда, Цезаря, лавров, мрамора и пергамента.

## Что реализовано

- главный экран Mini App на React + TypeScript + Vite;
- ежедневный ritual loop;
- карточка активного вопроса;
- блок дуэли умов с оценкой баланса матча;
- поручения для retention loop;
- слабые темы для персональной тренировки;
- рейтинг лиги / Сената;
- хроники и достижение серии.

## Стек

- React 18
- TypeScript strict
- Vite
- TailwindCSS
- Framer Motion
- lucide-react

Telegram Apps SDK пока не подключён в runtime: в исходном прототипе зависимость была неиспользуемой и тянула high severity advisory через `valibot`. Интеграцию init data стоит вернуть отдельным шагом на актуальной TMA-ветке.

## Запуск

```bash
npm install
npm run dev
```

## Проверка production build

```bash
npm run build
```

## Документация

Основные продуктовые роли описаны в `AGENTS.md` и `docs/AGENTS.md`. Визуальный стиль и адаптированный frontend-прототип взяты из `app-frontend/`.
