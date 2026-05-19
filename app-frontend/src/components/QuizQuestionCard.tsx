import { answers } from '../theme/content'
import { PremiumButton } from './PremiumButton'

export function QuizQuestionCard() {
  return (
    <section className="rounded-[1.7rem] border border-codex-gold/20 bg-codex-marble p-6 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-codex-deepGold">←</span>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-codex-muted">Ритуал · 3/10</p>
        <span />
      </div>
      <h2 className="mx-auto mt-9 max-w-md text-center font-display text-3xl leading-tight">
        Кто произнёс фразу «Пришёл, увидел, победил»?
      </h2>
      <div className="mt-8 space-y-3">
        {answers.map((answer, index) => (
          <button
            key={answer}
            className={index === 0
              ? 'w-full rounded-xl border border-codex-deepGold bg-codex-parchment px-4 py-4 font-medium text-codex-ink'
              : 'w-full rounded-xl border border-codex-gold/15 bg-white/70 px-4 py-4 font-medium text-codex-ink transition hover:border-codex-gold/40'
            }
          >
            {answer}
          </button>
        ))}
      </div>
      <PremiumButton className="mt-6 w-full">Далее</PremiumButton>
    </section>
  )
}
