import { Target } from 'lucide-react'
import { weakTopics } from '../theme/content'

export function WeakTopicsPanel() {
  return (
    <section className="rounded-[1.7rem] border border-codex-gold/20 bg-codex-marble p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-codex-deepGold">QuizMaster</p>
          <h2 className="mt-2 font-display text-4xl">Слабые темы</h2>
        </div>
        <Target className="h-7 w-7 text-codex-deepGold" />
      </div>

      <div className="mt-6 space-y-3">
        {weakTopics.map((topic) => (
          <article key={topic.title} className="rounded-2xl border border-codex-gold/15 bg-white/70 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">{topic.title}</h3>
                <p className="mt-1 text-sm text-codex-muted">Фокус: {topic.accent}</p>
              </div>
              <span className="font-display text-2xl text-codex-deepGold">{topic.accuracy}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
