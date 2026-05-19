# PVP_RANKED_SEASONS — PvP, рейтинги и сезоны

Brain Arena должен быть PvP-ориентированным продуктом. Daily Ritual и главы дают привычку и долгий прогресс, но соревновательное ядро строится вокруг дуэлей, рейтинга, сезонов, лиг и реваншей.

## 1. Главная идея

Brain Arena — это интеллектуальная арена, где игрок доказывает силу знаний в честных поединках.

Основные PvP-опоры:

- быстрые дуэли 1v1;
- асинхронные вызовы через Telegram deep links;
- ranked arena;
- сезоны;
- лиги и дивизионы;
- лидерборды;
- реванши;
- награды за сезон;
- античит и серверная проверка ответов.

Важно: PvP не должен превращаться в pay-to-win. Деньги могут давать косметику, статистику и комфорт, но не победы.

---

## 2. PvP modes

### Async Duel

Асинхронная дуэль — главный Telegram-native режим.

Flow:

```text
Player A starts duel
  -> answers same question pack
  -> creates challenge link
  -> shares link to Player B
  -> Player B opens challenge
  -> answers same or equivalent pack
  -> backend compares results
  -> both players receive result
  -> rematch CTA
```

Правила:

- вопросный сет фиксируется сервером;
- challenge link имеет TTL;
- результат считается сервером;
- можно учитывать правильность, скорость и streak внутри дуэли;
- после завершения всегда показывать CTA на реванш.

### Live Duel

Live Duel — режим P2, после стабилизации MVP.

Flow:

```text
Matchmaking
  -> both players connected
  -> countdown
  -> question by question battle
  -> live score
  -> final result
```

Для MVP live-duel можно не делать. Сначала достаточно async-duel.

### Ranked Arena

Ranked Arena — соревновательный режим с рейтингом и сезонами.

Правила:

- новые игроки проходят placement matches;
- рейтинг внутри кода называется `skillScore`;
- в UI можно использовать брендовые термины: `IQ Арены`, `Сила знаний`, `Ранг`;
- нельзя утверждать, что игра измеряет настоящий IQ;
- matchmaking должен защищать новичков от слишком сильных игроков.

---

## 3. Rating model

Минимальная модель рейтинга:

```text
skill_score
rank_points
league
division
season_id
placement_status
wins
losses
draws
win_streak
best_streak
```

Рекомендуемый старт:

- базовый `skillScore`: 1000;
- placement matches: 5;
- победа: +15..35 rating points;
- поражение: -5..25 rating points;
- ничья: 0..5 points;
- новичкам давать мягкую защиту первые 10 матчей.

Факторы результата:

```text
correct_answers_weight: высокий
speed_weight: средний
difficulty_weight: средний
streak_weight: низкий/средний
rating_difference_weight: высокий
```

Скорость не должна побеждать знания. Игрок с большим числом правильных ответов должен почти всегда выигрывать игрока, который отвечал быстрее, но ошибался.

---

## 4. Leagues and divisions

Лиги в Roman style:

```text
Novice        -> Ученик
Scribe        -> Писарь
Scholar       -> Знаток
Strategist    -> Стратег
Consul        -> Консул
Caesar        -> Цезарь
Imperator     -> Император
```

Можно использовать русские названия в UI:

```text
Ученик I-III
Писарь I-III
Знаток I-III
Стратег I-III
Консул I-III
Цезарь I-III
Император
```

Каждая лига имеет:

- порог рейтинга;
- визуальную рамку профиля;
- сезонную печать;
- место в лидерборде.

---

## 5. Seasons

Сезоны — основной долгосрочный PvP-loop.

Рекомендуемая длительность:

- короткий MVP-сезон: 14 дней;
- стандартный сезон: 30 дней;
- большой сезон: 60-90 дней.

Для запуска лучше использовать 30 дней.

Season flow:

```text
Season starts
  -> placement matches
  -> ranked progression
  -> weekly leaderboard snapshots
  -> season rewards
  -> soft reset
  -> next season starts
```

### Soft reset

После сезона рейтинг не должен полностью обнуляться.

Пример:

```text
new_skill_score = 1000 + (old_skill_score - 1000) * 0.55
```

Это сохраняет ощущение прогресса, но даёт шанс новым игрокам догнать старых.

---

## 6. Leaderboards

Нужны разные лидерборды:

### Global leaderboard

Общий топ сезона.

### Friends leaderboard

Топ среди друзей/приглашённых через Telegram.

### Category leaderboard

Топ по категории:

- История;
- География;
- Наука;
- Логика;
- Кино;
- Спорт;
- История Рима.

### Weekly leaderboard

Недельный топ внутри сезона. Он нужен, чтобы новые игроки могли попадать в топ, даже если сезон уже идёт давно.

---

## 7. Rewards

Сезонные награды должны быть статусными и косметическими.

Можно давать:

- рамки профиля;
- лавровые венки;
- печати сезона;
- титулы;
- баннеры профиля;
- особые ResultCard стили;
- архивную запись в профиле.

Нельзя давать:

- правильные ответы;
- подсказки в ranked;
- rating boosts;
- автопобеды;
- нечестный matchmaking.

---

## 8. Anti-cheat and fairness

Backend является authoritative source.

Обязательные правила:

- вопросы ranked выбираются сервером;
- ответы проверяются сервером;
- клиент не отправляет итоговый score как истину;
- тайминг ответа валидируется сервером;
- слишком быстрые ответы логируются;
- повторные попытки одного ranked-сета запрещены;
- challenge token имеет подпись и TTL;
- Telegram initData валидируется;
- подозрительные матчи помечаются для анализа.

---

## 9. Domain models

Минимальные сущности:

```text
PvpMatch
PvpParticipant
RankedProfile
Season
SeasonReward
LeaderboardSnapshot
MatchmakingTicket
RatingChangeLog
```

### PvpMatch

```text
id
mode
status
question_pack_id
season_id
winner_user_id
started_at
completed_at
created_at
updated_at
```

### PvpParticipant

```text
id
match_id
user_id
correct_answers
total_questions
score
answer_time_ms
result_status
rating_before
rating_after
rating_delta
completed_at
```

### RankedProfile

```text
id
user_id
season_id
skill_score
rank_points
league
division
placement_matches_played
placement_completed
wins
losses
draws
win_streak
best_streak
updated_at
```

### Season

```text
id
slug
title
status
starts_at
ends_at
soft_reset_factor
created_at
updated_at
```

---

## 10. API MVP

```text
POST /api/pvp/duels/async/start
GET  /api/pvp/duels/{matchId}
POST /api/pvp/duels/{matchId}/answer
POST /api/pvp/duels/{matchId}/finish
POST /api/pvp/challenges/{token}/accept
GET  /api/ranked/profile
GET  /api/ranked/season
GET  /api/ranked/leaderboard/global
GET  /api/ranked/leaderboard/friends
GET  /api/ranked/leaderboard/category/{categorySlug}
```

---

## 11. Frontend screens

Нужные экраны:

```text
ArenaScreen
DuelIntroScreen
DuelQuestionScreen
DuelResultScreen
RankedProfileCard
SeasonOverviewScreen
LeaderboardScreen
LeagueBadge
RatingDeltaBadge
RematchCard
```

Roman UI правила:

- PvP должен выглядеть как арена, а не казино;
- победа показывается как печать/лавр;
- поражение не унижает игрока;
- rating delta показывается понятно;
- текущий сезон должен быть виден на главном экране.

---

## 12. MVP priority

Порядок реализации:

1. Async Duel.
2. Result comparison.
3. Rematch CTA.
4. RankedProfile skeleton.
5. Season model.
6. Global leaderboard.
7. Rating calculation.
8. Placement matches.
9. Season rewards.
10. Friends leaderboard.

Live Duel делать позже.

---

## 13. Definition of Done

PvP/ranked/seasons готовы для MVP, когда:

- пользователь может создать async-duel;
- второй пользователь может принять challenge link;
- оба проходят один серверный сет;
- backend сравнивает результат;
- показывается победитель;
- можно сделать rematch;
- есть RankedProfile;
- есть активный Season;
- есть leaderboard;
- rating delta считается сервером;
- premium не влияет на победу;
- есть тесты на rating и match lifecycle.
