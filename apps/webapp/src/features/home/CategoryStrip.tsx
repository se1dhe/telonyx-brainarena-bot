import type { CategorySummary } from '../../api/contracts'

type CategoryStripProps = {
  categories: CategorySummary[]
}

export function CategoryStrip({ categories }: CategoryStripProps) {
  return (
    <section className="arena-card p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="arena-label">Категории</p>
        <span className="text-xs font-bold text-arena-muted">свайп</span>
      </div>
      <div className="category-carousel mt-3">
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
