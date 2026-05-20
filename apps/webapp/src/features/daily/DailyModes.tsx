import type { DailyMode, DailyRitualStatus } from '../../api/contracts'

type DailyModesProps = {
  modes: DailyMode[]
  ritual: DailyRitualStatus
  onStartRitual?: () => void
  isStartingRitual?: boolean
}

export function DailyModes({ modes, ritual, onStartRitual, isStartingRitual = false }: DailyModesProps) {
  const ritualProgress = ritual.completedToday
    ? `${ritual.starsEarned} ★ сегодня`
    : isStartingRitual
      ? 'открываем'
      : modes[0]?.progress ?? 'готово'
  const ritualReward = ritual.currentStreak > 0
    ? `${ritual.currentStreak} дней`
    : modes[0]?.reward ?? '+1 звезда'

  return (
    <section className="arena-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="arena-label">Сегодня</p>
        <span className="rounded-full bg-arena-gold/10 px-3 py-1 text-xs font-bold text-arena-gold">
          рекорд {ritual.longestStreak}
        </span>
      </div>
      <div className="mt-3 grid gap-2">
        {modes.map((mode, index) => (
          <button
            key={mode.title}
            className="flex items-center justify-between rounded-xl border border-codex-gold/15 bg-codex-marble/75 px-3 py-3 text-left disabled:opacity-70"
            onClick={index === 0 ? onStartRitual : undefined}
            disabled={index === 0 && (isStartingRitual || ritual.completedToday)}
          >
            <span>
              <span className="block font-semibold text-arena-ivory">{mode.title}</span>
              <span className="text-xs text-arena-muted">{index === 0 ? ritualProgress : mode.progress}</span>
            </span>
            <span className="rounded-full bg-arena-gold/10 px-3 py-1 text-xs font-bold text-arena-gold">
              {index === 0 ? ritualReward : mode.reward}
            </span>
          </button>
        ))}
      </div>
      {ritual.streakSaves > 0 && (
        <p className="mt-3 text-xs font-bold text-arena-muted">Мягких сохранений серии: {ritual.streakSaves}</p>
      )}
    </section>
  )
}
