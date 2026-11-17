import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { RepoCard } from '../components/RepoCard'
import { CATEGORIES } from '../lib/categories'
import { formatStars } from '../lib/utils'
import type { Repository } from '../types'

interface HomePageProps {
  repositories: Repository[]
  onOpen: (repo: Repository) => void
}

function StatCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="card-surface flex items-center gap-3 p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-xs)] border border-line bg-surface-3 text-ink">
        <Icon name={icon} size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-xl font-bold tracking-tight text-ink">{value}</p>
        <p className="truncate text-xs text-ink-3">{label}</p>
      </div>
    </div>
  )
}

export function HomePage({ repositories, onOpen }: HomePageProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const featured = useMemo(() => repositories.filter((r) => r.featured), [repositories])
  const recent = useMemo(
    () => [...repositories].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 6),
    [repositories],
  )

  const stats = useMemo(() => {
    const contributors = new Set(repositories.map((r) => r.contributor))
    const totalStars = repositories.reduce((sum, r) => sum + (r.stars ?? 0), 0)
    return {
      repos: repositories.length,
      categories: CATEGORIES.length,
      contributors: contributors.size,
      totalStars,
    }
  }, [repositories])

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const r of repositories) counts.set(r.category, (counts.get(r.category) ?? 0) + 1)
    return counts
  }, [repositories])

  const popularCategories = [...CATEGORIES]
    .sort((a, b) => (categoryCounts.get(b.label) ?? 0) - (categoryCounts.get(a.label) ?? 0))
    .slice(0, 6)

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    navigate(query.trim() ? `/explore?q=${encodeURIComponent(query.trim())}` : '/explore')
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-line bg-black py-12 sm:py-20">
        <div className="hero-grid-bg absolute inset-0 opacity-40" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-[var(--radius-xs)] border border-line bg-surface-2 px-3 py-1 text-xs font-medium text-ink-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {stats.repos} open-source alternatives · 100% token-driven UI
            </span>
          </div>

          <h1 className="mt-6 text-brand-title text-3xl sm:text-5xl font-bold tracking-tight text-ink">
            Open Source Alternatives to Popular Software
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-ink-2">
            Discover implementation-ready, self-hostable open-source alternatives to commercial SaaS and desktop software.
            Save on recurring subscriptions, maintain data ownership, and build with verifiable code.
          </p>

          {/* Search Form */}
          <form onSubmit={onSearch} className="mx-auto mt-8 max-w-xl" role="search">
            <div className="flex flex-col sm:flex-row items-stretch gap-2 rounded-[var(--radius-sm)] border border-line bg-surface-2 p-1.5 focus-within:border-[var(--color-text-secondary)]">
              <div className="flex flex-1 items-center gap-2 px-2.5">
                <Icon name="search" size={17} className="text-ink-3 shrink-0" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by alternative (e.g., Photoshop, Figma, Notion, Slack)…"
                  aria-label="Search open source alternatives"
                  className="min-w-0 flex-1 bg-transparent py-2 text-xs sm:text-sm text-ink placeholder:text-ink-3 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="btn-primary min-h-[44px] px-5 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]"
              >
                Search Alternatives
              </button>
            </div>
          </form>

          {/* Action triggers */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/explore"
              className="btn-primary inline-flex min-h-[44px] items-center gap-2 px-5 py-2.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]"
            >
              <Icon name="compass" size={15} />
              <span>Explore All {stats.repos} Alternatives</span>
            </Link>
            <Link
              to="/contribute"
              className="btn-secondary inline-flex min-h-[44px] items-center gap-2 px-5 py-2.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]"
            >
              <Icon name="send" size={14} />
              <span>Submit Alternative</span>
            </Link>
          </div>

          {/* Stat metrics */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon="folder" value={String(stats.repos)} label="Alternatives Curated" />
            <StatCard icon="layers" value={String(stats.categories)} label="Categories" />
            <StatCard icon="users" value={String(stats.contributors)} label="Community Maintainers" />
            <StatCard icon="star" value={formatStars(stats.totalStars) ?? '0'} label="GitHub Stars Tracked" />
          </div>
        </div>
      </section>

      {/* Featured Alternatives Grid with id #alternatives-grid for Skip Link */}
      <section
        id="alternatives-grid"
        className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        aria-label="Featured alternatives"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-3">
              <Icon name="trophy" size={13} />
              <span>Top Community Picks</span>
            </p>
            <h2 className="mt-1 text-lg sm:text-2xl font-bold tracking-tight text-ink">
              Featured Software Alternatives
            </h2>
          </div>
          <Link
            to="/explore"
            className="btn-secondary inline-flex min-h-[44px] items-center gap-1.5 px-3 py-2 text-xs font-medium w-fit"
          >
            <span>View all {repositories.length} alternatives</span>
            <Icon name="arrow-right" size={13} />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((repo) => (
            <RepoCard key={repo.id} repo={repo} onOpen={onOpen} />
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="border-y border-line bg-surface-2 py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-3">
                <Icon name="layers" size={13} />
                <span>Taxonomy</span>
              </p>
              <h2 className="mt-1 text-lg sm:text-2xl font-bold tracking-tight text-ink">
                Browse Alternatives by Category
              </h2>
            </div>
            <Link
              to="/categories"
              className="btn-secondary inline-flex min-h-[44px] items-center gap-1.5 px-3 py-2 text-xs font-medium w-fit"
            >
              <span>All categories</span>
              <Icon name="arrow-right" size={13} />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/categories/${cat.slug}`}
                className="card-surface group flex flex-col justify-between p-4 transition-all duration-[var(--motion-duration-instant)] hover:border-[var(--color-text-tertiary)]"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-xs)] border border-line bg-surface-3 text-ink">
                      <Icon name={cat.icon} size={16} />
                    </span>
                    <h3 className="text-sm font-semibold text-ink group-hover:text-white">{cat.label}</h3>
                  </div>
                  <p className="mt-2.5 text-xs text-ink-2 leading-relaxed">{cat.tagline}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-2.5 text-xs text-ink-3">
                  <span>{categoryCounts.get(cat.label) ?? 0} alternatives</span>
                  <Icon name="arrow-right" size={12} className="text-ink-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added Alternatives */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-3">
              <Icon name="clock" size={13} />
              <span>Recent Submissions</span>
            </p>
            <h2 className="mt-1 text-lg sm:text-2xl font-bold tracking-tight text-ink">
              Recently Added Alternatives
            </h2>
          </div>
          <Link
            to="/explore?sort=newest"
            className="btn-secondary inline-flex min-h-[44px] items-center gap-1.5 px-3 py-2 text-xs font-medium w-fit"
          >
            <span>View newest</span>
            <Icon name="arrow-right" size={13} />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((repo) => (
            <RepoCard key={repo.id} repo={repo} onOpen={onOpen} />
          ))}
        </div>
      </section>

      {/* Contribution Callout Banner */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="card-surface p-6 sm:p-10 text-center">
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-ink">
            Know an open-source alternative not listed here?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-ink-2 leading-relaxed">
            Help software consumers and shoppers discover free alternatives. Contribute a project with verifiable repository details and annual savings estimates.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/contribute"
              className="btn-primary inline-flex min-h-[44px] items-center gap-2 px-5 py-2.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]"
            >
              <Icon name="send" size={14} />
              <span>Submit an Alternative</span>
            </Link>
            <Link
              to="/guidelines"
              className="btn-secondary inline-flex min-h-[44px] items-center gap-2 px-5 py-2.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]"
            >
              <Icon name="book" size={14} />
              <span>Review Guidelines</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
