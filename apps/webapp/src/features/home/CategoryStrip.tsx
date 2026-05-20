import type { CategorySummary } from '../../api/contracts'

type CategoryStripProps = {
  categories: CategorySummary[]
  onSelect?: (slug: string) => void
}

export function CategoryStrip({ categories, onSelect }: CategoryStripProps) {
  return (
    <section className="arena-card p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="arena-label">Категории</p>
        <span className="text-xs font-bold text-arena-muted">свайп</span>
      </div>
      <div className="category-carousel mt-3">
        {categories.map(({ slug, title, icon: Icon, active, earnedStars, maxStars }) => (
          <button
            key={slug}
            onClick={() => onSelect?.(slug)}
            className={active ? 'category-tile category-tile-active' : 'category-tile'}
          >
            <Icon className="mx-auto h-7 w-7" />
            <span className="mt-2 block text-xs font-semibold whitespace-nowrap">{title}</span>
            <span className="mt-1 block text-[10px] text-arena-muted">
              {earnedStars} / {maxStars} ★
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
