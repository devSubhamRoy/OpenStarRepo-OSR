import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { CATEGORIES } from '../lib/categories'

const REPO_URL = 'https://github.com/opensource-hub/opensource-hub'
const CURRENT_YEAR = 2026

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-2 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-xs)] border border-line bg-surface-3 text-ink">
                <Icon name="gitbranch" size={15} />
              </span>
              <span className="text-sm font-semibold text-ink">OpenStarRepo</span>
            </div>
            <p className="text-xs leading-relaxed text-ink-3">
              Open Source Alternatives to Popular Software. Designed for online shoppers, consumers, and development teams seeking to reduce software subscription costs.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex min-h-[44px] items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
                aria-label="View OpenStarRepo repository on GitHub"
              >
                <Icon name="github" size={14} />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>

          {/* Directory Sitemap Nav Landmark */}
          <nav aria-label="Directory sitemap" className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">Directory Index</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link className="inline-flex min-h-[44px] items-center text-ink-2 hover:text-ink transition-colors" to="/explore">
                  All 70 Alternatives
                </Link>
              </li>
              <li>
                <Link className="inline-flex min-h-[44px] items-center text-ink-2 hover:text-ink transition-colors" to="/categories">
                  Software Categories
                </Link>
              </li>
              <li>
                <Link className="inline-flex min-h-[44px] items-center text-ink-2 hover:text-ink transition-colors" to="/explore?sort=stars">
                  Most Starred Alternatives
                </Link>
              </li>
              <li>
                <Link className="inline-flex min-h-[44px] items-center text-ink-2 hover:text-ink transition-colors" to="/explore?sort=newest">
                  Recently Added Software
                </Link>
              </li>
            </ul>
          </nav>

          {/* Community & Guidelines */}
          <nav aria-label="Community resources" className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">Community & Criteria</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link className="inline-flex min-h-[44px] items-center text-ink-2 hover:text-ink transition-colors" to="/contribute">
                  Submit Software Alternative
                </Link>
              </li>
              <li>
                <Link className="inline-flex min-h-[44px] items-center text-ink-2 hover:text-ink transition-colors" to="/guidelines">
                  Contribution Standards
                </Link>
              </li>
              <li>
                <Link className="inline-flex min-h-[44px] items-center text-ink-2 hover:text-ink transition-colors" to="/guidelines#rules">
                  Community Rules & Licenses
                </Link>
              </li>
            </ul>
          </nav>

          {/* Popular Categories */}
          <nav aria-label="Popular categories" className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">Popular Categories</h3>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 4).map((c) => (
                <li key={c.slug}>
                  <Link
                    className="inline-flex min-h-[44px] items-center text-ink-2 hover:text-ink transition-colors"
                    to={`/categories/${c.slug}`}
                  >
                    {c.label} Alternatives
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-ink-3 sm:flex-row">
          <p>
            © {CURRENT_YEAR} OpenStarRepo. Token-driven UI guidance compliant with WCAG 2.2 AA.
          </p>
          <p className="flex items-center gap-1.5">
            <span>Powered by open JSON community dataset</span>
            <Icon name="heart" size={12} className="text-red-400" />
          </p>
        </div>
      </div>
    </footer>
  )
}
