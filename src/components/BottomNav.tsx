import { BookOpen, Home, Medal, Swords, User } from 'lucide-react'

const items = [
  { label: 'Главная', icon: Home, active: true },
  { label: 'Курсы', icon: BookOpen },
  { label: 'Дуэли', icon: Swords },
  { label: 'Сенат', icon: Medal },
  { label: 'Профиль', icon: User }
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-4 bottom-4 z-20 mx-auto flex max-w-md justify-between rounded-3xl border border-codex-gold/20 bg-codex-marble/90 px-4 py-3 shadow-marble backdrop-blur md:static md:mt-8">
      {items.map(({ label, icon: Icon, active }) => (
        <button key={label} className={active ? 'min-w-12 text-codex-deepGold' : 'min-w-12 text-codex-muted'}>
          <Icon className="mx-auto h-5 w-5" />
          <span className="mt-1 block text-[11px] font-semibold">{label}</span>
        </button>
      ))}
    </nav>
  )
}
