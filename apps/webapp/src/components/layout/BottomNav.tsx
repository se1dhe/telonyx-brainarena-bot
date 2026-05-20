import { Home, Swords, Trophy, User } from 'lucide-react'

export type AppView = 'map' | 'arena' | 'top' | 'profile'

const items = [
  { id: 'map', title: 'Карта', icon: Home },
  { id: 'arena', title: 'Арена', icon: Swords },
  { id: 'top', title: 'Топ', icon: Trophy },
  { id: 'profile', title: 'Профиль', icon: User }
] satisfies Array<{
  id: AppView
  title: string
  icon: typeof Home
}>

type BottomNavProps = {
  activeView: AppView
  onChange: (view: AppView) => void
}

export function BottomNav({ activeView, onChange }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-30 mx-auto grid max-w-xl grid-cols-4 overflow-hidden rounded-2xl border border-codex-gold/20 bg-codex-marble/95 shadow-marble backdrop-blur">
      {items.map(({ id, title, icon: Icon }) => (
        <button
          key={id}
          className={activeView === id ? 'nav-item nav-item-active' : 'nav-item'}
          onClick={() => onChange(id)}
          type="button"
        >
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </button>
      ))}
    </nav>
  )
}
