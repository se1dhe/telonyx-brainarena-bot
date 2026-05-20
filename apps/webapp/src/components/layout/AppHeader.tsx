import { Sparkles, Zap } from 'lucide-react'
import type { PlayerSummary } from '../../api/contracts'

type AppHeaderProps = {
  player: PlayerSummary
}

export function AppHeader({ player }: AppHeaderProps) {
  return (
    <header className="grid grid-cols-[1fr_auto] items-center gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-arena-gold/40 bg-arena-gold/10 font-display text-lg font-bold text-arena-gold shadow-card sm:h-12 sm:w-12 sm:text-xl">
          IQ
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-[clamp(1.65rem,7vw,3.5rem)] font-black leading-none tracking-tight">Brain Arena</h1>
          <p className="mt-1 hidden text-xs font-bold uppercase tracking-[0.2em] text-codex-deepGold sm:block">Codex Quiz League</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <span className="pill" aria-label="Звёзды">
          <Sparkles className="h-4 w-4" />
          {player.stars}/{player.maxStars}
        </span>
        <span className="pill" aria-label="Энергия">
          <Zap className="h-4 w-4 fill-current" />
          {player.energy}
        </span>
      </div>
    </header>
  )
}
