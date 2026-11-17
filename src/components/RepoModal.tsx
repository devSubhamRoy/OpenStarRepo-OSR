import { useEffect, useRef } from 'react'
import { Icon } from './Icon'
import { CopyButton } from './CopyButton'
import { CategoryChip, TechTag } from './RepoCard'
import type { Repository } from '../types'
import { formatDate, formatStars, initials } from '../lib/utils'

interface RepoModalProps {
  repo: Repository | null
  onClose: () => void
}

export function RepoModal({ repo, onClose }: RepoModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!repo) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [repo, onClose])

  if (!repo) return null

  const stars = formatStars(repo.stars)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${repo.name} alternative details`}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="card-surface relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-[var(--radius-sm)] sm:rounded-[var(--radius-sm)] p-5 sm:p-7 z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--radius-xs)] border border-line bg-surface-3 font-mono text-base font-semibold text-ink"
              aria-hidden="true"
            >
              {initials(repo.name)}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg sm:text-xl font-bold text-ink">{repo.name}</h2>
              <p className="mt-0.5 truncate font-mono text-xs text-ink-3">
                {repo.owner} / {repo.name.toLowerCase().replace(/\s+/g, '-')}
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-xs)] border border-line bg-surface-2 text-ink-2 hover:bg-surface-3 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]"
            aria-label="Close dialog"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Alternative to Banner & Annual Savings for Consumers */}
        {repo.alternative_to && (
          <div className="mt-4 flex flex-col gap-2 rounded-[var(--radius-xs)] border border-line bg-surface-3 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-3">Direct Alternative to:</span>
              <span className="text-xs font-semibold text-ink">{repo.alternative_to}</span>
            </div>
            {repo.savings_annual && (
              <span className="inline-flex w-fit items-center gap-1 rounded-[var(--radius-xs)] bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                <Icon name="check" size={12} />
                Save {repo.savings_annual}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="mt-4 text-xs sm:text-sm leading-relaxed text-ink-2">
          {repo.description}
        </p>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <CategoryChip category={repo.category} />
          {repo.license && (
            <span className="rounded-[var(--radius-xs)] border border-line bg-surface-2 px-2 py-0.5 text-xs font-mono text-ink-3">
              License: {repo.license}
            </span>
          )}
          {stars !== null && (
            <span className="flex items-center gap-1.5 rounded-[var(--radius-xs)] border border-line bg-surface-2 px-2 py-0.5 text-xs font-medium text-ink-2">
              <Icon name="star" size={12} className="text-amber-400" />
              {stars} stars
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-[var(--radius-xs)] border border-line bg-surface-2 px-2 py-0.5 text-xs text-ink-3">
            <Icon name="clock" size={12} /> Verified {formatDate(repo.created_at)}
          </span>
        </div>

        {/* Tech Stack */}
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-3">Built with</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {repo.technologies.map((t) => (
              <TechTag key={t} tech={t} className="px-2 py-1 text-xs" />
            ))}
          </div>
        </div>

        {/* Code / URL */}
        <div className="mt-5 rounded-[var(--radius-xs)] border border-line bg-surface-2 p-3">
          <p className="break-all font-mono text-xs text-ink-3">{repo.github_url}</p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <a
            href={repo.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 px-4 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]"
            aria-label={`Open ${repo.name} repository on GitHub (external link)`}
          >
            <Icon name="github" size={15} />
            <span>View on GitHub</span>
          </a>
          <CopyButton
            text={repo.github_url}
            label="Copy URL"
            className="btn-secondary min-h-[44px] justify-center px-4 py-2 text-xs font-medium"
            iconSize={15}
          />
        </div>
      </div>
    </div>
  )
}
