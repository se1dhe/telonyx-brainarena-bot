import { courseChapters } from '../theme/content'
import { Check, Lock } from 'lucide-react'

export function CoursePanel() {
  return (
    <section className="overflow-hidden rounded-[1.7rem] border border-codex-gold/20 bg-white/70 shadow-card md:grid md:grid-cols-[240px_1fr]">
      <aside className="bg-codex-parchment/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-codex-deepGold">Курс</p>
        <h3 className="mt-3 font-display text-3xl leading-tight">История Древнего Рима</h3>
        <nav className="mt-8 space-y-2 text-sm text-codex-muted">
          {['О курсе', 'Главы', 'Ритуалы', 'Материалы', 'Достижения'].map((item, index) => (
            <div key={item} className={index === 1 ? 'rounded-xl bg-white/60 px-4 py-3 text-codex-ink' : 'px-4 py-3'}>
              {item}
            </div>
          ))}
        </nav>
      </aside>

      <div className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-codex-deepGold">Глава III</p>
            <h2 className="mt-2 font-display text-4xl">Республика и её испытания</h2>
            <p className="mt-3 max-w-2xl leading-7 text-codex-muted">
              Период расцвета и падения. Внутренние конфликты, великие полководцы и путь к империи.
            </p>
          </div>
          <div className="grid h-24 w-24 place-items-center rounded-full border border-codex-gold/35 bg-codex-ivory font-display text-2xl">67%</div>
        </div>

        <div className="mt-7 space-y-3">
          {courseChapters.map((chapter) => (
            <div key={chapter.id} className="flex items-center justify-between rounded-xl border border-codex-gold/15 bg-codex-marble px-4 py-4">
              <div className="flex items-center gap-4">
                <span className="text-codex-muted">{chapter.id}</span>
                <span className="font-medium">{chapter.title}</span>
              </div>
              {chapter.done ? <Check className="h-5 w-5 text-codex-deepGold" /> : <Lock className="h-5 w-5 text-codex-muted" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
