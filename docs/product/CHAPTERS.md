# CHAPTERS — Главы и карта прохождения

Главы — обязательная часть Brain Arena. Это не просто список тестов, а визуальная карта прохождения в стиле Roman Temple: путь знатока, узлы, звезды, замки, награды и общий прогресс.

## 1. Структура

```text
Course
  -> Chapter
    -> ChapterNode
      -> QuestionPack
        -> Questions
        -> Result
        -> Stars
        -> Reward
```

Пример:

```text
Course: История Рима
  Chapter: Глава I · Путь знатока
    Node 1: Основы
    Node 2: Первое испытание
    Node 3: Проверка памяти
    Node 4: Закрытый вызов
    Node 5: Архивный бонус
```

## 2. Chapter Map UI

Экран главы должен показывать карту прохождения, как на референсе:

- заголовок `Карта прохождения`;
- название главы, например `Глава I · Путь знатока`;
- badge прогресса, например `6 / 15 ★`;
- большую мраморную карточку карты;
- путь между узлами;
- круглые узлы с номерами;
- звезды внутри каждого узла;
- замки на закрытых узлах;
- приглушенные закрытые этапы;
- золотой акцент на пройденном пути.

## 3. Состояния узлов

```text
LOCKED      # закрыт
AVAILABLE   # доступен
IN_PROGRESS # начат
COMPLETED   # завершен
MASTERED    # завершен на максимум звезд
```

### LOCKED

- полупрозрачный узел;
- замок;
- серые звезды;
- пунктирный путь.

### AVAILABLE

- светлый узел;
- золотая обводка;
- мягкий фокус;
- можно нажать и начать испытание.

### COMPLETED

- показывает заработанные звезды;
- доступен для перепрохождения.

### MASTERED

- 3 из 3 звезд;
- лавровая мини-печать;
- статус освоения.

## 4. Звезды

Каждый узел дает от 0 до 3 звезд.

```text
3 звезды: 90-100% правильных ответов
2 звезды: 70-89%
1 звезда: 40-69%
0 звезд: меньше 40%, узел можно повторить
```

Скорость можно учитывать как бонус, но в обучающих главах главным фактором должна быть правильность.

## 5. Разблокировка

Базовая схема:

```text
Node 1 открыт сразу.
Node 2 открывается после завершения Node 1.
Node 3 открывается после завершения Node 2.
Node 4 открывается после 2+ звезд в Node 3.
Node 5 может быть бонусным узлом.
```

Пользователь не должен застревать навсегда. Если узел сложный, нужно дать повторение, объяснение и понятный путь вперед.

## 6. Domain models

Минимальные модели:

```text
Course
Chapter
ChapterNode
ChapterProgress
NodeAttempt
NodeStarResult
```

Основные поля `Chapter`:

```text
id
course_id
slug
title
subtitle
chapter_number
max_stars
is_active
created_at
updated_at
```

Основные поля `ChapterNode`:

```text
id
chapter_id
node_number
title
description
question_pack_id
position_x
position_y
unlock_rule_type
unlock_rule_value
max_stars
is_bonus
is_active
```

Основные поля `ChapterProgress`:

```text
id
user_id
chapter_id
earned_stars
max_stars
completed_nodes
mastered_nodes
current_node_id
started_at
completed_at
updated_at
```

## 7. API MVP

```text
GET  /api/courses
GET  /api/courses/{courseSlug}/chapters
GET  /api/chapters/{chapterSlug}/map
POST /api/chapters/{chapterSlug}/nodes/{nodeId}/start
GET  /api/chapters/{chapterSlug}/progress
```

## 8. Frontend components

```text
ChapterMapScreen
ChapterMapCard
ChapterNode
ChapterPath
ChapterProgressBadge
NodeStars
LockedNodeHint
ChapterRewardSeal
```

## 9. Первый набор глав

### История Рима

- Глава I · Путь знатока
- Глава II · Республика

### География

- Глава I · Карта мира
- Глава II · Страны и столицы

### Логика

- Глава I · Основы мышления
- Глава II · Последовательности

## 10. Definition of Done

Механика глав готова, когда:

- есть модели Course, Chapter, ChapterNode и ChapterProgress;
- есть seed первой главы;
- frontend показывает карту главы;
- узлы имеют состояния;
- звезды считаются сервером;
- locked rules работают;
- пользователь может пройти узел и вернуться на карту;
- прогресс обновляется после прохождения;
- UI соответствует Roman Temple style.
