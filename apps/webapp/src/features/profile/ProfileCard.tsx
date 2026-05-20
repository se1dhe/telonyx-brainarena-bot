import { Award } from 'lucide-react'
import type { PlayerSummary } from '../../api/contracts'

type ProfileCardProps = {
  player: PlayerSummary
}

export function ProfileCard({ player }: ProfileCardProps) {
  const nextRankProgress = Math.min(100, Math.round((player.stars / Math.max(player.maxStars, 1)) * 100))

  return (
    <section className="arena-card p-4">
      <p className="arena-label">Профиль</p>
      <div className="mt-4 flex items-center gap-4">
        <div className="avatar-ring avatar-ring-blue">
          <Award className="h-8 w-8" />
          <span>{player.league}</span>
        </div>
        <div>
          <h2 className="text-xl font-bold">{player.name}</h2>
          <p className="text-arena-blue">{player.title}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 border-y border-codex-gold/15 py-4 text-center">
        <div><p className="text-xs text-arena-muted">IQ</p><strong>{player.iq}</strong></div>
        <div><p className="text-xs text-arena-muted">Победы</p><strong>{player.wins}</strong></div>
        <div><p className="text-xs text-arena-muted">Винрейт</p><strong>{player.winrate}</strong></div>
      </div>
      <p className="mt-4 text-sm text-arena-muted">До следующего ранга</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-codex-sand">
        <div className="h-full rounded-full bg-arena-blue" style={{ width: `${nextRankProgress}%` }} />
      </div>
      <p className="mt-2 text-sm text-arena-blue">{player.stars} / {player.maxStars} звёзд</p>
    </section>
  )
}
