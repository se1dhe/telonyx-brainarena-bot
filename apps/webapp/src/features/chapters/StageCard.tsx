import { motion } from 'framer-motion'
import { ChevronRight, Play } from 'lucide-react'
import type { ActiveStageSummary } from '../../api/contracts'
import { NodeStars } from './NodeStars'

type StageCardProps = {
  stage: ActiveStageSummary
  onStart: () => void
  isStarting?: boolean
}

export function StageCard({ stage, onStart, isStarting = false }: StageCardProps) {
  return (
    <section className="arena-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="arena-label">{stage.subtitle}</p>
          <h2 className="mt-1 text-2xl font-bold text-arena-ivory">{stage.title}</h2>
          <p className="mt-1 text-sm text-arena-muted">
            {stage.completed} из {stage.questions} вопросов · лучший результат {stage.best}
          </p>
        </div>
        <div className="flex rounded-full border border-arena-gold/30 bg-arena-gold/10 px-3 py-2">
          <NodeStars stars={stage.stars} size="md" />
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-codex-sand">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(stage.completed / stage.questions) * 100}%` }}
          className="h-full rounded-full bg-gradient-to-r from-arena-blue to-arena-gold"
        />
      </div>
      <div className="mt-5 grid gap-2">
        {stage.questionTypes.map(({ title, icon: Icon }) => (
          <div key={title} className="flex items-center justify-between rounded-xl border border-codex-gold/15 bg-codex-marble/75 px-3 py-3">
            <span className="flex items-center gap-3 text-sm font-semibold text-arena-ivory">
              <Icon className="h-5 w-5 text-arena-blue" />
              {title}
            </span>
            <ChevronRight className="h-4 w-4 text-arena-muted" />
          </div>
        ))}
      </div>
      <button className="arena-primary mt-5 w-full" onClick={onStart} disabled={isStarting}>
        <Play className="h-5 w-5 fill-current" />
        {isStarting ? 'Открываем' : 'Играть точку'}
      </button>
    </section>
  )
}
