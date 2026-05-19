import type { DailyMode } from '../../api/contracts'

type DailyModesProps = {
  modes: DailyMode[]
}

export function DailyModes({ modes }: DailyModesProps) {
  return (
    <section className="arena-card p-4">
      <p className="arena-label">Сегодня</p>
      <div className="mt-3 grid gap-2">
        {modes.map((mode) => (
          <button key={mode.title} className="flex items-center justify-between rounded-xl border border-codex-gold/15 bg-codex-marble/75 px-3 py-3 text-left">
            <span>
              <span className="block font-semibold text-arena-ivory">{mode.title}</span>
              <span className="text-xs text-arena-muted">{mode.progress}</span>
            </span>
            <span className="rounded-full bg-arena-gold/10 px-3 py-1 text-xs font-bold text-arena-gold">{mode.reward}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
