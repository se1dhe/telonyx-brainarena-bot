import { Shield } from 'lucide-react'
import type { DuelPreview } from '../../api/contracts'

type DuelCardProps = {
  duel: DuelPreview
}

export function DuelCard({ duel }: DuelCardProps) {
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
              <Shield className="h-8 w-8" />
              <span>{fighter.league}</span>
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
          <button key={answer} className="answer-row">
            <span>{String.fromCharCode(65 + index)}</span>
            {answer}
          </button>
        ))}
      </div>
    </section>
  )
}
