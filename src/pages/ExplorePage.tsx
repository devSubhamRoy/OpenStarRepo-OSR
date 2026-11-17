import { useDeferredValue, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { RepoCard } from '../components/RepoCard'
import { RepoModal } from '../components/RepoModal'
import { EmptyState } from '../components/EmptyState'
import { CATEGORIES } from '../lib/categories'
import { formatStars } from '../lib/utils'
import type { Repository, SortOption } from '../types'

interface ExplorePageProps {
  repositories: Repository[]
}

function SkeletonCard() {
  return (
    <div className="card-surface flex flex-col p-4 space-y-3" aria-hidden="true">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 animate-pulse rounded-[var(--radius-xs)] bg-surface-3" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-2/3 animate-pulse rounded bg-surface-3" />
          <div className="h-2.5 w-1/2 animate-pulse rounded bg-surface-2" />
        </div>
      </div>
      <div className="h-3 w-full animate-pulse rounded bg-surface-2" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-surface-2" />
      <div className="flex gap-2">
        <div className="h-5 w-20 animate-pulse rounded-[var(--radius-xs)] bg-surface-2" />
        <div className="h-5 w-16 animate-pulse rounded-[var(--radius-xs)] bg-surface-2" />
      </div>
      <div className="h-9 animate-pulse rounded-[var(--radius-xs)] bg-surface-2 mt-2" />
    </div>
  )
}

const SORT_OPTIONS: Array<{ value: SortOption | 'savings'; label: string }> = [
  { value: 'featured', label: 'Curated Order' },
  { value: 'alphabetical', label: 'Alphabetical (A–Z)' },
  { value: 'newest', label: 'Recently Added' },
  { value: 'stars', label: 'Most Stars' },
  { value: 'savings', label: 'Highest Estimated Savings' },
]

const LICENSES = ['All Licenses', 'MIT', 'Apache-2.0', 'GPL-3.0', 'AGPL-3.0', 'MPL-2.0', 'BSD-3-Clause']

const selectClass =
  'w-full min-w-0 appearance-none truncate rounded-[var(--radius-xs)] border border-line bg-surface-2 py-2.5 pl-8 pr-8 text-xs font-medium text-ink transition-colors hover:border-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text-primary)] min-h-[44px]'

export function ExplorePage({ repositories }: ExplorePageProps) {
  const [params, setParams] = useSearchParams()
  const [selected, setSelected] = useState<Repository | null>(null)
  const [comparingList, setComparingList] = useState<Repository[]>([])
  const [showCompareDrawer, setShowCompareDrawer] = useState(false)

  const query = params.get('q') ?? ''
  const category = params.get('category') ?? 'all'
  const license = params.get('license') ?? 'all'
  const sort = (params.get('sort') as SortOption | 'savings') ?? 'featured'
  const [search, setSearch] = useState(query)

  const deferredSearch = useDeferredValue(search)

  const updateParam = (key: string, value: string, defaultValue: string) => {
    const next = new URLSearchParams(params)
    if (value === defaultValue) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const toggleCompare = (repo: Repository) => {
    setComparingList((prev) => {
      const exists = prev.some((r) => r.id === repo.id)
      if (exists) {
        return prev.filter((r) => r.id !== repo.id)
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), repo]
      }
      return [...prev, repo]
    })
    setShowCompareDrawer(true)
  }

  const filtered = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase()
    let list = repositories.filter((r) => {
      if (category !== 'all' && r.category !== category) return false
      if (license !== 'all' && r.license !== license) return false
      if (q) {
        const haystack = `${r.name} ${r.owner} ${r.description} ${r.category} ${r.alternative_to ?? ''} ${r.technologies.join(' ')}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })

    switch (sort) {
      case 'alphabetical':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
        list = [...list].sort((a, b) => b.created_at.localeCompare(a.created_at))
        break
      case 'stars':
        list = [...list].sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1))
        break
      case 'savings':
        list = [...list].sort((a, b) => {
          const numA = parseInt((a.savings_annual ?? '').replace(/[^0-9]/g, '') || '0', 10)
          const numB = parseInt((b.savings_annual ?? '').replace(/[^0-9]/g, '') || '0', 10)
          return numB - numA
        })
        break
      default:
        list = [...list].sort(
          (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || a.id.localeCompare(b.id),
        )
    }
    return list
  }, [repositories, deferredSearch, category, license, sort])

  const hasFilters = query !== '' || category !== 'all' || license !== 'all' || sort !== 'featured'
  const isPending = search !== deferredSearch

  const clearFilters = () => {
    setSearch('')
    setParams(new URLSearchParams(), { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Screen reader live announcement region per design.md §4.5 */}
      <div aria-live="polite" className="sr-only">
        {filtered.length} open source alternatives displayed
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">
          Explore Alternatives
        </p>
        <h1 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-ink">
          Open Source Alternatives Directory
        </h1>
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink-2">
          Compare {repositories.length} open-source alternatives to proprietary SaaS. Filter by commercial app, license, and annual subscription savings.
        </p>
      </div>

      {/* Filters Container */}
      <div className="card-surface mt-8 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="flex flex-1 items-center gap-2 rounded-[var(--radius-xs)] border border-line bg-surface-2 px-3 py-2 transition-all focus-within:border-[var(--color-text-secondary)] min-h-[44px]">
            <Icon name="search" size={16} className="shrink-0 text-ink-3" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => updateParam('q', search, '')}
              placeholder="Search by name, commercial tool replaced (e.g. Photoshop, Figma, Notion)…"
              aria-label="Search open source alternatives"
              className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-ink placeholder:text-ink-3 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  updateParam('q', '', '')
                }}
                aria-label="Clear search query"
                className="grid h-8 w-8 place-items-center text-ink-3 hover:text-ink"
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </div>

          {/* Facets & Sort controls */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:min-w-0 lg:shrink-0 lg:basis-[38rem]">
            {/* Category Filter */}
            <div className="relative min-w-0">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3">
                <Icon name="layers" size={14} />
              </span>
              <select
                value={category}
                onChange={(e) => updateParam('category', e.target.value, 'all')}
                aria-label="Filter alternatives by category"
                className={selectClass}
              >
                <option value="all">All Categories ({CATEGORIES.length})</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                size={13}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3"
              />
            </div>

            {/* License Filter */}
            <div className="relative min-w-0">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3">
                <Icon name="shield" size={14} />
              </span>
              <select
                value={license}
                onChange={(e) => updateParam('license', e.target.value, 'all')}
                aria-label="Filter alternatives by open source license"
                className={selectClass}
              >
                {LICENSES.map((lic) => (
                  <option key={lic} value={lic === 'All Licenses' ? 'all' : lic}>
                    {lic}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                size={13}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3"
              />
            </div>

            {/* Sort Filter */}
            <div className="relative min-w-0">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3">
                <Icon name="filter" size={14} />
              </span>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value, 'featured')}
                aria-label="Sort alternatives list"
                className={selectClass}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                size={13}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3"
              />
            </div>
          </div>
        </div>

        {/* Active filter summary bar */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-ink-3">
              {isPending ? 'Filtering…' : `Showing ${filtered.length} of ${repositories.length} alternatives`}
            </span>
            {category !== 'all' && (
              <button
                type="button"
                onClick={() => updateParam('category', 'all', 'all')}
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] border border-line bg-surface-3 px-2 py-1 text-ink-2 hover:text-ink"
                aria-label={`Remove category filter: ${category}`}
              >
                <span>{category}</span>
                <Icon name="x" size={11} />
              </button>
            )}
            {license !== 'all' && (
              <button
                type="button"
                onClick={() => updateParam('license', 'all', 'all')}
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] border border-line bg-surface-3 px-2 py-1 text-ink-2 hover:text-ink"
                aria-label={`Remove license filter: ${license}`}
              >
                <span>License: {license}</span>
                <Icon name="x" size={11} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {comparingList.length > 0 && (
              <button
                type="button"
                onClick={() => setShowCompareDrawer((s) => !s)}
                className="btn-secondary inline-flex min-h-[36px] items-center gap-1.5 px-2.5 py-1 text-xs font-medium"
                aria-label={`Toggle comparison drawer with ${comparingList.length} items`}
              >
                <Icon name="layers" size={12} />
                <span>Compare ({comparingList.length}/3)</span>
              </button>
            )}

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-ink-2 hover:text-white underline"
                aria-label="Clear all applied filters"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Drawer / Side-by-side Matrix if activated */}
      {showCompareDrawer && comparingList.length > 0 && (
        <div
          className="card-surface mt-6 p-4 sm:p-5 border-l-4 border-l-[var(--color-text-secondary)]"
          role="region"
          aria-label="Software comparison drawer"
        >
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <Icon name="layers" size={16} />
              <h2 className="text-sm font-semibold text-ink">
                Side-by-side Comparison ({comparingList.length} selected)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setComparingList([])}
                className="text-xs text-ink-3 hover:text-ink"
              >
                Clear comparison
              </button>
              <button
                type="button"
                onClick={() => setShowCompareDrawer(false)}
                className="grid h-8 w-8 place-items-center rounded text-ink-3 hover:text-ink"
                aria-label="Close comparison panel"
              >
                <Icon name="x" size={14} />
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {comparingList.map((item) => (
              <div key={item.id} className="rounded-[var(--radius-xs)] border border-line bg-surface-2 p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-ink">{item.name}</h3>
                  <button
                    type="button"
                    onClick={() => toggleCompare(item)}
                    className="text-ink-3 hover:text-ink text-xs"
                    aria-label={`Remove ${item.name} from comparison`}
                  >
                    <Icon name="x" size={13} />
                  </button>
                </div>
                <p className="text-xs text-emerald-400 font-medium">
                  {item.savings_annual ? `Saves ${item.savings_annual}` : 'Free & Open Source'}
                </p>
                <p className="text-xs text-ink-3">
                  Replaces: <span className="text-ink font-medium">{item.alternative_to ?? 'Proprietary tool'}</span>
                </p>
                <p className="text-xs text-ink-3">
                  License: <span className="font-mono text-ink">{item.license ?? 'Open Source'}</span>
                </p>
                <p className="text-xs text-ink-3">
                  GitHub Stars: <span className="text-ink font-mono">{formatStars(item.stars) ?? 'N/A'}</span>
                </p>
                <a
                  href={item.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-2 flex min-h-[36px] items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium"
                >
                  <Icon name="github" size={13} />
                  <span>View Repository</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Region with id #alternatives-grid */}
      <section id="alternatives-grid" className="mt-8" aria-label="Alternatives directory list">
        {isPending ? (
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-label="Loading alternatives list"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state pattern complying strictly with design.md §5.4 */
          <div className="mt-6">
            <EmptyState
              icon="search"
              title="No open-source alternatives match your criteria"
              message="Try clearing specific filters or search by proprietary software name (e.g., Photoshop, Slack, Notion)."
              action={
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="btn-secondary min-h-[44px] px-4 py-2 text-xs font-semibold"
                  >
                    Clear all filters
                  </button>
                  <Link
                    to="/contribute"
                    className="btn-primary inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-xs font-semibold"
                  >
                    <Icon name="send" size={14} />
                    <span>Submit this alternative</span>
                  </Link>
                </div>
              }
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((repo) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                onOpen={setSelected}
                onCompare={toggleCompare}
                isComparing={comparingList.some((r) => r.id === repo.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      <RepoModal repo={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
