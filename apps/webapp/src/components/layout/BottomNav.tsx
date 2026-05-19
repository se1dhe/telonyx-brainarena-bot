import { Home, Swords, Trophy, User } from 'lucide-react'

const items = [
  { title: 'Карта', icon: Home, active: true },
  { title: 'Арена', icon: Swords },
  { title: 'Топ', icon: Trophy },
  { title: 'Профиль', icon: User }
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-30 mx-auto grid max-w-xl grid-cols-4 overflow-hidden rounded-2xl border border-codex-gold/20 bg-codex-marble/95 shadow-marble backdrop-blur md:static md:mt-4">
      {items.map(({ title, icon: Icon, active }) => (
        <button key={title} className={active ? 'nav-item nav-item-active' : 'nav-item'}>
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </button>
      ))}
    </nav>
  )
}
