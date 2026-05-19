import { motion } from 'framer-motion'
import {
  Award,
  ChevronRight,
  Flame,
  Home as HomeIcon,
  Lock,
  Play,
  Search,
  Shield,
  Sparkles,
  Star,
  Zap,
  Swords,
  Trophy,
  User
} from 'lucide-react'
import { activeStage, categories, dailyModes, duel, leaderboard, mapNodes, player } from '../theme/content'

function RatingCard() {
  return (
    <section className="arena-card p-4">
      <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
        <div className="grid h-16 w-16 shrink-0 place-items-center bg-[url('/assets/seal.svg')] bg-contain bg-center bg-no-repeat font-display text-2xl font-bold text-arena-gold">
          {player.league}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold text-arena-ivory">{player.name}</h2>
          <p className="text-sm text-arena-muted">Рейтинг IQ</p>
          <p className="font-display text-4xl font-bold text-arena-gold">{player.iq}</p>
        </div>
        <div className="grid w-full grid-cols-3 gap-3 border-t border-codex-gold/15 pt-4 text-center sm:w-auto sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          <div><p className="text-xs text-arena-muted">Победы</p><p className="text-lg font-bold text-arena-ivory">{player.wins}</p></div>
          <div><p className="text-xs text-arena-muted">Винрейт</p><p className="text-lg font-bold text-arena-ivory">{player.winrate}</p></div>
          <div>
            <p className="text-xs text-arena-muted">Серия</p>
            <p className="flex items-center justify-center gap-1 text-lg font-bold text-arena-ivory">
              {player.streak}<Flame className="h-4 w-4 fill-arena-gold text-arena-gold" />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CategoryStrip() {
  return (
    <section className="arena-card p-4">
      <p className="arena-label">Выбор категории</p>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {categories.map(({ title, icon: Icon, active }) => (
          <button key={title} className={active ? 'category-tile category-tile-active' : 'category-tile'}>
            <Icon className="mx-auto h-7 w-7" />
            <span className="mt-2 block text-xs font-semibold">{title}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function ProgressMap() {
  return (
    <section className="arena-card relative overflow-hidden p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="arena-label">Карта прохождения</p>
          <h2 className="mt-1 text-2xl font-bold text-arena-ivory">Глава I · Путь знатока</h2>
        </div>
        <div className="rounded-full border border-arena-blue/40 bg-arena-blue/10 px-3 py-1 text-sm font-bold text-arena-blue">6 / 15 ★</div>
      </div>

      <div className="map-surface mt-4">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M16 74 C28 63 31 60 42 52 S58 39 68 32 S78 45 82 62 S70 77 56 82" fill="none" stroke="rgba(166,124,52,.24)" strokeWidth="1.8" strokeDasharray="4 4" />
          <path d="M16 74 C28 63 31 60 42 52 S58 39 68 32" fill="none" stroke="rgba(166,124,52,.58)" strokeWidth="2.4" />
        </svg>
        {mapNodes.map((node) => (
          <motion.button
            key={node.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: node.id * 0.06 }}
            className={node.status === 'active' ? 'map-node map-node-active' : node.status === 'locked' ? 'map-node map-node-locked' : 'map-node map-node-done'}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <span className="text-lg font-bold">{node.id}</span>
            <span className="mt-1 flex gap-0.5">
              {[0, 1, 2].map((star) => (
                <Star key={star} className={star < node.stars ? 'h-3 w-3 fill-arena-gold text-arena-gold' : 'h-3 w-3 text-codex-muted/30'} />
              ))}
            </span>
            {node.status === 'locked' && <Lock className="absolute -right-1 -top-1 h-4 w-4 text-arena-muted" />}
          </motion.button>
        ))}
      </div>
    </section>
  )
}

function StageCard() {
  return (
    <section className="arena-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="arena-label">{activeStage.subtitle}</p>
          <h2 className="mt-1 text-2xl font-bold text-arena-ivory">{activeStage.title}</h2>
          <p className="mt-1 text-sm text-arena-muted">{activeStage.completed} из {activeStage.questions} вопросов · лучший результат {activeStage.best}</p>
        </div>
        <div className="flex rounded-full border border-arena-gold/30 bg-arena-gold/10 px-3 py-2">
          {[0, 1, 2].map((star) => (
            <Star key={star} className={star < activeStage.stars ? 'h-5 w-5 fill-arena-gold text-arena-gold' : 'h-5 w-5 text-codex-muted/30'} />
          ))}
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-codex-sand">
        <motion.div initial={{ width: 0 }} animate={{ width: `${(activeStage.completed / activeStage.questions) * 100}%` }} className="h-full rounded-full bg-gradient-to-r from-arena-blue to-arena-gold" />
      </div>
      <div className="mt-5 grid gap-2">
        {activeStage.questionTypes.map(({ title, icon: Icon }) => (
          <div key={title} className="flex items-center justify-between rounded-xl border border-codex-gold/15 bg-codex-marble/75 px-3 py-3">
            <span className="flex items-center gap-3 text-sm font-semibold text-arena-ivory"><Icon className="h-5 w-5 text-arena-blue" />{title}</span>
            <ChevronRight className="h-4 w-4 text-arena-muted" />
          </div>
        ))}
      </div>
      <button className="arena-primary mt-5 w-full"><Play className="h-5 w-5 fill-current" />Играть точку</button>
    </section>
  )
}

function DuelCard() {
  return (
    <section className="arena-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-arena-blue">Раунд {duel.round}</p>
        <span className="text-sm font-bold text-arena-blue">{duel.timer}</span>
      </div>
      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {[duel.me, duel.opponent].map((fighter, index) => (
          <div key={fighter.name} className="text-center">
            <div className={index === 0 ? 'avatar-ring avatar-ring-blue' : 'avatar-ring avatar-ring-gold'}>
              <Shield className="h-8 w-8" /><span>{fighter.league}</span>
            </div>
            <p className="mt-2 font-bold text-arena-ivory">{fighter.name}</p>
            <p className={index === 0 ? 'font-display text-2xl text-arena-blue' : 'font-display text-2xl text-arena-gold'}>{fighter.mmr}</p>
          </div>
        ))}
        <div className="text-center font-display text-5xl font-bold text-arena-ivory">{duel.score}</div>
      </div>
      <div className="mt-5 rounded-2xl border border-codex-gold/15 bg-codex-ivory p-4 text-center">
        <p className="text-lg font-semibold leading-7 text-arena-ivory">{duel.question}</p>
      </div>
      <div className="mt-3 grid gap-2">
        {duel.answers.map((answer, index) => (
          <button key={answer} className="answer-row"><span>{String.fromCharCode(65 + index)}</span>{answer}</button>
        ))}
      </div>
    </section>
  )
}

function DailyModes() {
  return (
    <section className="arena-card p-4">
      <p className="arena-label">Сегодня</p>
      <div className="mt-3 grid gap-2">
        {dailyModes.map((mode) => (
          <button key={mode.title} className="flex items-center justify-between rounded-xl border border-codex-gold/15 bg-codex-marble/75 px-3 py-3 text-left">
            <span><span className="block font-semibold text-arena-ivory">{mode.title}</span><span className="text-xs text-arena-muted">{mode.progress}</span></span>
            <span className="rounded-full bg-arena-gold/10 px-3 py-1 text-xs font-bold text-arena-gold">{mode.reward}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function Leaderboard() {
  return (
    <section className="arena-card p-4">
      <div className="flex items-center justify-between"><p className="arena-label">Топ игроков</p><Trophy className="h-5 w-5 text-arena-gold" /></div>
      <div className="mt-3 divide-y divide-codex-gold/15">
        {leaderboard.map((row) => (
          <div key={row.name} className={row.active ? 'leader-row leader-row-active' : 'leader-row'}><span>{row.place}</span><span>{row.name}</span><strong>{row.rating}</strong></div>
        ))}
      </div>
    </section>
  )
}

function BottomNav() {
  return (
    <nav className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-30 mx-auto grid max-w-xl grid-cols-4 overflow-hidden rounded-2xl border border-codex-gold/20 bg-codex-marble/95 shadow-marble backdrop-blur md:static md:mt-4">
      {[{ title: 'Карта', icon: HomeIcon, active: true }, { title: 'Арена', icon: Swords }, { title: 'Топ', icon: Trophy }, { title: 'Профиль', icon: User }].map(({ title, icon: Icon, active }) => (
        <button key={title} className={active ? 'nav-item nav-item-active' : 'nav-item'}><Icon className="h-5 w-5" /><span>{title}</span></button>
      ))}
    </nav>
  )
}

export function Home() {
  return (
    <main className="min-h-screen px-3 pb-28 pt-[calc(16px+env(safe-area-inset-top))] text-arena-ivory sm:px-5 md:pb-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="grid grid-cols-[1fr_auto] items-center gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-arena-gold/40 bg-arena-gold/10 font-display text-lg font-bold text-arena-gold shadow-card sm:h-12 sm:w-12 sm:text-xl">IQ</div>
            <div className="min-w-0"><h1 className="truncate text-[clamp(1.65rem,7vw,3.5rem)] font-black leading-none tracking-tight">Brain Arena</h1><p className="mt-1 hidden text-xs font-bold uppercase tracking-[0.2em] text-codex-deepGold sm:block">Codex Quiz League</p></div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span className="pill" aria-label="Звёзды"><Sparkles className="h-4 w-4" />{player.coins}</span>
            <span className="pill" aria-label="Энергия"><Zap className="h-4 w-4 fill-current" />{player.energy}</span>
          </div>
        </header>

        <RatingCard />
        <CategoryStrip />
        <div className="grid gap-4 lg:grid-cols-[1.05fr_.95fr]"><ProgressMap /><div className="space-y-4"><StageCard /><DailyModes /></div></div>
        <button className="arena-secondary w-full"><Search className="h-5 w-5" />Найти матч</button>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <DuelCard />
          <div className="space-y-4">
            <Leaderboard />
            <section className="arena-card p-4">
              <p className="arena-label">Профиль</p>
              <div className="mt-4 flex items-center gap-4"><div className="avatar-ring avatar-ring-blue"><Award className="h-8 w-8" /><span>{player.league}</span></div><div><h2 className="text-xl font-bold">{player.name}</h2><p className="text-arena-blue">{player.title}</p></div></div>
              <div className="mt-4 grid grid-cols-3 border-y border-codex-gold/15 py-4 text-center"><div><p className="text-xs text-arena-muted">IQ</p><strong>{player.iq}</strong></div><div><p className="text-xs text-arena-muted">Победы</p><strong>{player.wins}</strong></div><div><p className="text-xs text-arena-muted">Винрейт</p><strong>{player.winrate}</strong></div></div>
              <p className="mt-4 text-sm text-arena-muted">До следующего ранга</p><div className="mt-2 h-2 overflow-hidden rounded-full bg-codex-sand"><div className="h-full w-[63%] rounded-full bg-arena-blue" /></div><p className="mt-2 text-sm text-arena-blue">633 / 1000</p>
            </section>
          </div>
        </div>
        <BottomNav />
      </div>
    </main>
  )
}
