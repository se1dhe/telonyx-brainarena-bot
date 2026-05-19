import { motion } from 'framer-motion'
import { Brain, Swords, Timer } from 'lucide-react'
import { PremiumButton } from './PremiumButton'

export function DuelPanel() {
  return (
    <section className="rounded-[1.7rem] border border-codex-gold/20 bg-codex-ink p-6 text-codex-marble shadow-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-codex-laurel">Дуэль умов</p>
          <h2 className="mt-3 font-display text-4xl leading-tight">Матч против Praetor Maximus</h2>
        </div>
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-codex-gold/30 bg-white/10">
          <Swords className="h-6 w-6 text-codex-laurel" />
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Brain, label: 'Вероятность', value: '52%' },
          { icon: Timer, label: 'Раунд', value: '45 сек' },
          { icon: Swords, label: 'Категория', value: 'История' }
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <Icon className="h-5 w-5 text-codex-laurel" />
            <p className="mt-3 text-xs text-white/55">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-codex-gold/20 bg-white/[0.06] p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Честность матча</span>
          <span className="font-semibold text-codex-laurel">баланс высокий</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '84%' }}
            transition={{ duration: 0.7 }}
            className="h-full rounded-full bg-codex-laurel"
          />
        </div>
      </div>

      <PremiumButton className="mt-6 w-full">Войти в дуэль</PremiumButton>
    </section>
  )
}
