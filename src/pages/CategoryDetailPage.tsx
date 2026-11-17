import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { RepoCard } from '../components/RepoCard'
import { RepoModal } from '../components/RepoModal'
import { EmptyState } from '../components/EmptyState'
import { CATEGORIES, categoryBySlug } from '../lib/categories'
import type { Repository } from '../types'

interface CategoryDetailPageProps {
  repositories: Repository[]
}

export function CategoryDetailPage({ repositories }: CategoryDetailPageProps) {
  const { slug = '' } = useParams()
  const [selected, setSelected] = useState<Repository | null>(null)
  const cat = categoryBySlug(slug)

  const repos = useMemo(() => repositories.filter((r) => r.category === cat?.label), [repositories, cat])

  const technologies = useMemo(
    () => [...new Set(repos.flatMap((r) => r.technologies))].sort((a, b) => a.localeCompare(b)),
    [repos],
  )

  if (!cat) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState
          icon="alert-circle"
          title="Category not found"
          message={`We couldn't find a category called "${slug}". Browse all available categories instead.`}
          action={
            <Link
              to="/categories"
              className="btn-primary inline-flex min-h-[44px] items-center gap-2 px-5 py-2.5 text-xs font-semibold"
            >
              <Icon name="layers" size={15} /> All categories
            </Link>
          }
        />
      </div>
    )
  }

  const otherCategories = CATEGORIES.filter((c) => c.slug !== cat.slug).slice(0, 5)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-3">
        <Link to="/" className="hover:text-ink transition-colors">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/categories" className="hover:text-ink transition-colors">Categories</Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink font-medium">{cat.label}</span>
      </nav>

      {/* Header Banner */}
      <header className="card-surface mt-6 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--radius-xs)] border border-line bg-surface-3 text-ink">
              <Icon name={cat.icon} size={22} />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-ink">{cat.label} Alternatives</h1>
              <p className="mt-1 text-xs sm:text-sm text-ink-2 leading-relaxed max-w-2xl">{cat.tagline}</p>
            </div>
          </div>
          <span className="w-fit rounded-[var(--radius-xs)] border border-line bg-surface-2 px-3 py-1.5 text-xs font-mono text-ink-2">
            {repos.length} {repos.length === 1 ? 'alternative' : 'alternatives'}
          </span>
        </div>

        {technologies.length > 0 && (
          <div className="mt-6 border-t border-line pt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-3">Common stacks:</span>
            {technologies.slice(0, 8).map((t) => (
              <span key={t} className="rounded-[var(--radius-xs)] border border-line bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-ink-2">
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Alternatives Grid */}
      <section className="mt-8" aria-label={`${cat.label} alternatives list`}>
        {repos.length === 0 ? (
          <EmptyState
            icon="compass"
            title="No alternatives yet in this category"
            message={`We haven't indexed an alternative under ${cat.label} yet. Be the first to submit one!`}
            action={
              <Link
                to="/contribute"
                className="btn-primary inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-xs font-semibold"
              >
                <Icon name="send" size={14} /> Submit an alternative
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} onOpen={setSelected} />
            ))}
          </div>
        )}
      </section>

      {/* Other Categories */}
      <aside className="mt-12 rounded-[var(--radius-sm)] border border-line bg-surface-2 p-5" aria-label="Other categories">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-3">Other Categories</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {otherCategories.map((c) => (
            <Link
              key={c.slug}
              to={`/categories/${c.slug}`}
              className="btn-secondary inline-flex min-h-[36px] items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
            >
              <Icon name={c.icon} size={12} />
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      <RepoModal repo={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
