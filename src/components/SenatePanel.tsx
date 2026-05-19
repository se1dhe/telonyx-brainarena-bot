import { Crown, ShieldCheck } from 'lucide-react'
import { leagueRows } from '../theme/content'

export function SenatePanel() {
  return (
    <section className="rounded-[1.7rem] border border-codex-gold/20 bg-white/70 p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-codex-deepGold">Лига · Сенат</p>
          <h2 className="mt-2 font-display text-4xl">Рейтинг мудрецов</h2>
        </div>
        <ShieldCheck className="h-7 w-7 text-codex-deepGold" />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-codex-gold/15">
        {leagueRows.map((row) => (
          <div
            key={row.name}
            className={row.name === 'Tu'
              ? 'grid grid-cols-[52px_1fr_72px_64px] items-center gap-3 bg-codex-parchment px-4 py-4'
              : 'grid grid-cols-[52px_1fr_72px_64px] items-center gap-3 bg-codex-marble px-4 py-4 odd:bg-white/60'
            }
          >
            <span className="font-display text-2xl text-codex-deepGold">{row.place}</span>
            <span className="font-semibold">{row.name}</span>
            <span className="text-sm text-codex-muted">{row.rating}</span>
            <span className="flex items-center justify-end gap-1 text-sm font-semibold text-codex-bronze">
              <Crown className="h-4 w-4" />
              {row.streak}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
