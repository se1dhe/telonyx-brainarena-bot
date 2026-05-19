import { Trophy } from 'lucide-react'
import type { LeaderboardRow } from '../../api/contracts'

type LeaderboardProps = {
  rows: LeaderboardRow[]
}

export function Leaderboard({ rows }: LeaderboardProps) {
  return (
    <section className="arena-card p-4">
      <div className="flex items-center justify-between">
        <p className="arena-label">Топ игроков</p>
        <Trophy className="h-5 w-5 text-arena-gold" />
      </div>
      <div className="mt-3 divide-y divide-codex-gold/15">
        {rows.map((row) => (
          <div key={row.name} className={row.active ? 'leader-row leader-row-active' : 'leader-row'}>
            <span>{row.place}</span>
            <span>{row.name}</span>
            <strong>{row.rating}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}
