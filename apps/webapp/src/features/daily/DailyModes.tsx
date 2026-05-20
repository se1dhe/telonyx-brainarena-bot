import type { DailyMode } from '../../api/contracts'

type DailyModesProps = {
  modes: DailyMode[]
  onStartRitual?: () => void
  isStartingRitual?: boolean
}

export function DailyModes({ modes, onStartRitual, isStartingRitual = false }: DailyModesProps) {
  return (
    <section className="arena-card p-4">
      <p className="arena-label">Сегодня</p>
      <div className="mt-3 grid gap-2">
        {modes.map((mode, index) => (
          <button
            key={mode.title}
            className="flex items-center justify-between rounded-xl border border-codex-gold/15 bg-codex-marble/75 px-3 py-3 text-left disabled:opacity-70"
            onClick={index === 0 ? onStartRitual : undefined}
            disabled={index === 0 && isStartingRitual}
          >
            <span>
              <span className="block font-semibold text-arena-ivory">{mode.title}</span>
              <span className="text-xs text-arena-muted">{index === 0 && isStartingRitual ? 'открываем' : mode.progress}</span>
            </span>
            <span className="rounded-full bg-arena-gold/10 px-3 py-1 text-xs font-bold text-arena-gold">{mode.reward}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
