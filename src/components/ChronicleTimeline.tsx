import { timeline } from '../theme/content'

export function ChronicleTimeline() {
  return (
    <section className="rounded-[1.7rem] border border-codex-gold/20 bg-white/70 p-6 shadow-card">
      <h2 className="text-center font-display text-3xl">Хроники</h2>
      <div className="mt-7 space-y-6 border-l border-codex-gold/30 pl-6">
        {timeline.map((item) => (
          <div key={item.date} className="relative">
            <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border border-codex-deepGold bg-codex-marble" />
            <p className="text-xs text-codex-muted">{item.date}</p>
            <h3 className="mt-1 font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-codex-muted">{item.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-7 rounded-2xl border border-codex-gold/20 bg-codex-ivory p-5 text-center font-display text-xl">
        «Мудрость — высшее из благ»<br />
        <span className="text-base text-codex-deepGold">Цицерон</span>
      </div>
    </section>
  )
}
