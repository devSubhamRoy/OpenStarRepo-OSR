import { Icon } from './Icon'
import { CopyButton } from './CopyButton'
import type { Repository } from '../types'
import { categoryMeta } from '../lib/categories'
import { cn, formatStars, initials } from '../lib/utils'

interface RepoCardProps {
  repo: Repository
  onOpen: (repo: Repository) => void
  onCompare?: (repo: Repository) => void
  isComparing?: boolean
  className?: string
}

export function TechTag({ tech, className }: { tech: string; className?: string }) {
  return (
    <span
      className={cn(
        'rounded-[var(--radius-xs)] border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] font-medium text-ink-3',
        className,
      )}
    >
      {tech}
    </span>
  )
}

export function CategoryChip({ category }: { category: string }) {
  const meta = categoryMeta(category)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[var(--radius-xs)] border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-ink-2',
      )}
    >
      <Icon name={meta?.icon ?? 'tag'} size={11} className="text-ink-3" />
      {category}
    </span>
  )
}

export function RepoCard({ repo, onOpen, onCompare, isComparing = false, className }: RepoCardProps) {
  const stars = formatStars(repo.stars)

  return (
    <article
      className={cn(
        'card-surface group relative flex flex-col justify-between p-4 transition-all duration-[var(--motion-duration-instant)]',
        'hover:border-[var(--color-text-tertiary)]',
        isComparing && 'ring-2 ring-[var(--color-text-primary)]',
        className,
      )}
    >
      <div>
        {/* Top Header: Rank / Icon / Name & Stars */}
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => onOpen(repo)}
            className="flex min-w-0 flex-1 items-start gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)] rounded-[var(--radius-xs)] p-0.5"
            aria-label={`View details and comparisons for ${repo.name}`}
          >
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-xs)] border border-line bg-surface-3 font-mono text-xs font-semibold text-ink"
              aria-hidden="true"
            >
              {initials(repo.name)}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold text-ink group-hover:text-white transition-colors duration-[var(--motion-duration-instant)]">
                {repo.name}
              </h3>
              <p className="truncate text-[11px] text-ink-3">
                {repo.owner} / {repo.name.toLowerCase().replace(/\s+/g, '-')}
              </p>
            </div>
          </button>

          {stars !== null && (
            <span
              className="flex shrink-0 items-center gap-1 rounded-[var(--radius-xs)] border border-line bg-surface-2 px-2 py-1 text-[11px] font-medium text-ink-2"
              title={`${(repo.stars ?? 0).toLocaleString()} GitHub stars`}
              aria-label={`${stars} stars`}
            >
              <Icon name="star" size={12} className="text-amber-400" />
              {stars}
            </span>
          )}
        </div>

        {/* Alternative to Tag / Replaced Software */}
        {repo.alternative_to && (
          <div className="mt-3 flex items-center gap-1.5 rounded-[var(--radius-xs)] border border-line bg-surface-3 px-2 py-1 text-xs">
            <span className="text-ink-3">Alternative to:</span>
            <span className="truncate font-medium text-ink">{repo.alternative_to}</span>
          </div>
        )}

        {/* Description clamped to 2 lines per design.md §5.3 */}
        <button
          type="button"
          onClick={() => onOpen(repo)}
          className="mt-2.5 w-full text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-text-primary)] rounded"
          aria-label={`Read full summary of ${repo.name}`}
        >
          <p className="line-clamp-2 text-xs leading-relaxed text-ink-2">
            {repo.description}
          </p>
        </button>

        {/* Category & License Badges */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <CategoryChip category={repo.category} />
          {repo.license && (
            <span className="rounded-[var(--radius-xs)] border border-line bg-surface-2 px-1.5 py-0.5 text-[11px] font-mono text-ink-3">
              {repo.license}
            </span>
          )}
          {repo.savings_annual && (
            <span className="rounded-[var(--radius-xs)] border border-emerald-900/60 bg-emerald-950/40 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-400">
              Save {repo.savings_annual}
            </span>
          )}
        </div>

        {/* Tech tags */}
        <div className="mt-2 flex flex-wrap gap-1">
          {repo.technologies.slice(0, 3).map((t) => (
            <TechTag key={t} tech={t} />
          ))}
        </div>
      </div>

      {/* Action Row: max 2 actions per design.md §3.5 */}
      <div className="mt-4 flex flex-col gap-2 border-t border-line pt-3 sm:flex-row sm:items-center">
        <a
          href={repo.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]"
          aria-label={`Visit ${repo.name} repository on GitHub`}
        >
          <Icon name="github" size={14} />
          <span>Visit repo</span>
        </a>

        <div className="flex items-center gap-2">
          {onCompare && (
            <button
              type="button"
              onClick={() => onCompare(repo)}
              className={cn(
                'btn-secondary inline-flex min-h-[44px] flex-1 sm:flex-none items-center justify-center gap-1 px-3 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]',
                isComparing && 'bg-surface-3 text-ink border-white/20'
              )}
              aria-label={`Compare ${repo.name} with commercial alternatives`}
              aria-pressed={isComparing}
            >
              <Icon name="layers" size={13} />
              <span>{isComparing ? 'Comparing' : 'Compare'}</span>
            </button>
          )}

          <CopyButton
            text={repo.github_url}
            title={`Copy ${repo.name} repository URL`}
            className="min-h-[44px] min-w-[44px] shrink-0 border border-line bg-surface-2 hover:bg-surface-3 text-ink-2"
          />
        </div>
      </div>
    </article>
  )
}
