import { motion } from 'framer-motion'
import { PremiumButton } from './PremiumButton'
import { stats } from '../theme/content'

export function HeroPanel() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2rem] border border-codex-gold/25 bg-codex-marble/85 shadow-marble backdrop-blur px-6 py-8 md:px-10 md:py-12"
    >
      <img src="/assets/laurel.svg" className="absolute right-20 top-20 h-48 w-48 opacity-50" aria-hidden="true" />
      <img src="/assets/column.svg" className="absolute -left-10 bottom-0 h-72 w-72 opacity-10" aria-hidden="true" />

      <div className="relative max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-codex-deepGold">Codex · Discere est vincere</p>
        <h1 className="mt-5 font-display text-6xl leading-[0.96] tracking-tight text-codex-ink md:text-7xl">
          Discere<br />est vincere
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-codex-muted">
          Учись как римлянин. Побеждай как мудрец. Ежедневные ритуалы, исторические главы и дуэли умов.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <PremiumButton>Начать ритуал</PremiumButton>
          <PremiumButton variant="secondary">Узнать больше</PremiumButton>
        </div>
      </div>

      <div className="relative mt-10 grid grid-cols-2 gap-3 rounded-2xl border border-codex-gold/20 bg-white/70 p-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border-codex-gold/20 px-3 md:border-r last:border-r-0">
            <div className="font-display text-4xl font-semibold text-codex-ink">{stat.value}</div>
            <div className="mt-1 text-xs text-codex-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
