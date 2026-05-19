import { motion } from 'framer-motion'
import { missions } from '../theme/content'

export function MissionPanel() {
  return (
    <section className="rounded-[1.7rem] border border-codex-gold/20 bg-white/70 p-6 shadow-card">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-codex-deepGold">Retention loop</p>
          <h2 className="mt-2 font-display text-4xl">Ежедневные поручения</h2>
        </div>
        <span className="rounded-full border border-codex-gold/30 bg-codex-ivory px-4 py-2 text-sm font-semibold text-codex-deepGold">
          2/3
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {missions.map((mission) => (
          <article key={mission.title} className="rounded-2xl border border-codex-gold/15 bg-codex-marble p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">{mission.title}</h3>
                <p className="mt-1 text-sm text-codex-muted">{mission.detail}</p>
              </div>
              <span className="shrink-0 rounded-full bg-codex-parchment px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-codex-deepGold">
                {mission.reward}
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-codex-sand">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${mission.progress}%` }}
                transition={{ duration: 0.55 }}
                className="h-full rounded-full bg-codex-deepGold"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
