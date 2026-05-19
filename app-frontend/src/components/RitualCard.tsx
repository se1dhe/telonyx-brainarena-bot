import { PremiumButton } from './PremiumButton'

export function RitualCard() {
  return (
    <section className="rounded-[1.7rem] border border-codex-gold/20 bg-white/70 p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-codex-deepGold">Сегодняшний ритуал</p>
          <h2 className="mt-3 font-display text-3xl text-codex-ink">История Древнего Рима</h2>
          <p className="mt-1 text-sm text-codex-muted">Глава III. Республика и её испытания</p>
        </div>
        <img src="/assets/seal.svg" className="h-16 w-16" aria-hidden="true" />
      </div>

      <div className="mt-7 rounded-2xl border border-codex-gold/20 bg-codex-ivory p-5">
        <div className="flex items-center gap-5">
          <div className="grid h-16 w-16 place-items-center rounded-full border-4 border-codex-gold/45 font-display text-xl">7/10</div>
          <div>
            <p className="text-sm font-semibold text-codex-ink">Прогресс ритуала</p>
            <p className="text-sm text-codex-muted">Осталось 3 вопроса до завершения</p>
          </div>
        </div>
      </div>

      <PremiumButton className="mt-5 w-full">Продолжить</PremiumButton>

      <div className="mt-5 flex items-center justify-between border-t border-codex-gold/15 pt-4 text-sm">
        <span className="text-codex-muted">Серия</span>
        <span className="font-semibold text-codex-ink">24 дня подряд</span>
      </div>
    </section>
  )
}
