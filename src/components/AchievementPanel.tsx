import { PremiumButton } from './PremiumButton'

export function AchievementPanel() {
  return (
    <section className="rounded-[1.7rem] border border-codex-gold/20 bg-codex-marble p-7 text-center shadow-card">
      <div className="relative mx-auto h-40 w-40">
        <img src="/assets/laurel.svg" className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <img src="/assets/crown.svg" className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
      </div>
      <h2 className="mt-3 font-display text-4xl">Corona Laurea</h2>
      <p className="mt-2 text-codex-muted">Серия 30 дней подряд</p>
      <p className="mx-auto mt-6 max-w-sm leading-7 text-codex-muted">
        За постоянство, дисциплину и жажду знаний. Ты идёшь по пути истинных мудрецов.
      </p>
      <PremiumButton className="mt-7 w-full">Продолжить</PremiumButton>
    </section>
  )
}
