import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Icon } from './Icon'
import { cn } from '../lib/utils'

const LINKS = [
  { to: '/', label: 'Overview', end: true },
  { to: '/explore', label: 'Explore Alternatives' },
  { to: '/categories', label: 'Categories' },
  { to: '/contribute', label: 'Submit Alternative' },
  { to: '/guidelines', label: 'Guidelines' },
]

const GITHUB_REPO_URL = 'https://github.com/devSubhamRoy/OpenStarRepo-OSR-'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => (typeof window !== 'undefined' ? window.scrollY > 8 : false))
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'inline-flex min-h-[44px] items-center rounded-[var(--radius-xs)] px-3 py-2 text-xs font-medium transition-colors duration-[var(--motion-duration-instant)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]',
      isActive
        ? 'bg-surface-3 text-ink font-semibold'
        : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
    )

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-colors duration-[var(--motion-duration-instant)]',
        scrolled ? 'border-line bg-black/90 backdrop-blur-md' : 'border-line bg-black',
      )}
    >
      <nav
        className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Brand logo / wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-[var(--radius-xs)] py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]"
          aria-label="OpenStarRepo home page"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-xs)] border border-line bg-surface-3 text-ink">
            <Icon name="gitbranch" size={16} />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-ink">
              Open<span className="text-ink-3">StarRepo</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-ink-3">
              Open Source Alternatives to Popular Software
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary hidden min-h-[44px] items-center gap-1.5 px-3 py-2 text-xs font-medium sm:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]"
            aria-label="Visit OpenStarRepo GitHub repository (opens in new tab)"
          >
            <Icon name="github" size={14} />
            <span>GitHub</span>
          </a>

          <Link
            to="/contribute"
            className="btn-primary hidden min-h-[44px] items-center gap-1.5 px-3 py-2 text-xs font-semibold sm:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]"
            aria-label="Submit a new open source alternative"
          >
            <Icon name="send" size={13} />
            <span>Submit</span>
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-11 w-11 place-items-center rounded-[var(--radius-xs)] border border-line bg-surface-2 text-ink-2 hover:bg-surface-3 hover:text-ink md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]"
            aria-expanded={open}
            aria-label={open ? 'Close mobile menu' : 'Open mobile menu'}
          >
            <Icon name={open ? 'x' : 'menu'} size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div
          ref={menuRef}
          className="border-t border-line bg-black/95 px-4 pb-6 pt-3 md:hidden backdrop-blur-md"
        >
          <div className="flex flex-col gap-1.5">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-line pt-3">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex min-h-[44px] items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium"
              >
                <Icon name="github" size={14} />
                <span>OpenStarRepo on GitHub</span>
              </a>
              <Link
                to="/contribute"
                onClick={() => setOpen(false)}
                className="btn-primary flex min-h-[44px] items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold"
              >
                <Icon name="send" size={13} />
                <span>Submit Alternative</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
