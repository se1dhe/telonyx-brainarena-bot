import type { CategorySummary } from '../../api/contracts'

type CategoryStripProps = {
  categories: CategorySummary[]
}

export function CategoryStrip({ categories }: CategoryStripProps) {
  return (
    <section className="arena-card p-4">
      <p className="arena-label">Выбор категории</p>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {categories.map(({ title, icon: Icon, active }) => (
          <button key={title} className={active ? 'category-tile category-tile-active' : 'category-tile'}>
            <Icon className="mx-auto h-7 w-7" />
            <span className="mt-2 block text-xs font-semibold">{title}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
