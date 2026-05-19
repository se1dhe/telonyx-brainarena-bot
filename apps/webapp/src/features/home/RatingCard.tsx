import { Flame } from 'lucide-react'
import type { PlayerSummary } from '../../api/contracts'

type RatingCardProps = {
  player: PlayerSummary
}

export function RatingCard({ player }: RatingCardProps) {
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
          <div>
            <p className="text-xs text-arena-muted">Победы</p>
            <p className="text-lg font-bold text-arena-ivory">{player.wins}</p>
          </div>
          <div>
            <p className="text-xs text-arena-muted">Винрейт</p>
            <p className="text-lg font-bold text-arena-ivory">{player.winrate}</p>
          </div>
          <div>
            <p className="text-xs text-arena-muted">Серия</p>
            <p className="flex items-center justify-center gap-1 text-lg font-bold text-arena-ivory">
              {player.streak}
              <Flame className="h-4 w-4 fill-arena-gold text-arena-gold" />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
