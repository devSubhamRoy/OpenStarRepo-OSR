import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { CATEGORIES } from '../lib/categories'
import type { Repository } from '../types'

interface CategoriesPageProps {
  repositories: Repository[]
}

export function CategoriesPage({ repositories }: CategoriesPageProps) {
  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const r of repositories) map.set(r.category, (map.get(r.category) ?? 0) + 1)
    return map
  }, [repositories])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">
          Taxonomy & Classification
        </p>
        <h1 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-ink">
          Software Categories
        </h1>
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink-2">
          Discover open-source alternatives organized across {CATEGORIES.length} functional software domains.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const count = counts.get(cat.label) ?? 0
          return (
            <Link
              key={cat.slug}
              to={`/categories/${cat.slug}`}
              className="card-surface group flex flex-col justify-between p-4 transition-all duration-[var(--motion-duration-instant)] hover:border-[var(--color-text-tertiary)]"
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-xs)] border border-line bg-surface-3 text-ink">
                    <Icon name={cat.icon} size={18} />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-ink group-hover:text-white">{cat.label}</h2>
                    <span className="text-[11px] text-ink-3 font-mono">{count} alternatives</span>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ink-2">{cat.tagline}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-2 text-xs text-ink-3">
                <span>Explore alternatives</span>
                <Icon name="arrow-right" size={12} className="text-ink-2" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
