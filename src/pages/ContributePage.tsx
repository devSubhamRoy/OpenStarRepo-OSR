import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Icon } from '../components/Icon'
import { CopyButton } from '../components/CopyButton'
import { CATEGORIES } from '../lib/categories'
import { cn, downloadJson, isDuplicateUrl, isValidGithubUrl, nextRepoId, parseOwnerRepo, todayIso } from '../lib/utils'
import type { Repository } from '../types'

interface ContributePageProps {
  repositories: Repository[]
}

interface FormState {
  name: string
  github_url: string
  alternative_to: string
  savings_annual: string
  license: string
  description: string
  category: string
  customCategory: string
  technologies: string
  contributor: string
  notes: string
}

const EMPTY: FormState = {
  name: '',
  github_url: '',
  alternative_to: '',
  savings_annual: '',
  license: 'MIT',
  description: '',
  category: '',
  customCategory: '',
  technologies: '',
  contributor: '',
  notes: '',
}

const DRAFT_KEY = 'openstarrepo-draft'
const GITHUB_REPO_URL = 'https://github.com/opensource-hub/opensource-hub'
const GITHUB_PR_URL = 'https://github.com/opensource-hub/opensource-hub/pulls'
const GITHUB_EDIT_URL = 'https://github.com/opensource-hub/opensource-hub/edit/main/src/data/repositories.json'

const SUGGESTED_SKILLS = [
  'Claude Code Skill',
  'Antigravity Skill',
  'MCP Server',
  'AI Agent',
  'CLI Tool',
  'Prompt Engineering',
  'Automation',
  'TypeScript',
  'Python',
  'Rust',
  'Go',
  'React',
  'Next.js',
  'Node.js',
  'PostgreSQL',
  'Docker',
]

const QUICK_CATEGORIES = [
  'AI Agents & Skills',
  'Developer Tools',
  'Web Development',
  'Productivity & Office',
  'Cybersecurity',
  'UI/UX Design',
  'Media & Creative Tools',
  'Open Source Resources',
]

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'User fills contribution form',
    description: 'Enter project details, repo URL, category & skills/tech stack.',
    icon: 'edit-3',
  },
  {
    step: 2,
    title: 'Generate JSON data',
    description: 'Click "Generate JSON contribution" to create verified schema.',
    icon: 'zap',
  },
  {
    step: 3,
    title: 'Download or copy JSON',
    description: 'Copy JSON directly or download the generated file to your disk.',
    icon: 'copy',
  },
  {
    step: 4,
    title: 'Submit GitHub Pull Request',
    description: 'Open PR on GitHub to append your JSON to repositories.json.',
    icon: 'gitbranch',
  },
]

function validate(form: FormState, activeCategory: string) {
  const errors: Partial<Record<keyof FormState, string>> = {}

  if (!form.name.trim()) errors.name = 'Alternative project name is required.'
  else if (form.name.trim().length > 80) errors.name = 'Keep the name under 80 characters.'

  if (!form.github_url.trim()) errors.github_url = 'GitHub repository URL is required.'
  else if (!isValidGithubUrl(form.github_url)) errors.github_url = 'Use format https://github.com/owner/repository'

  if (!form.description.trim()) errors.description = 'A short description is required.'
  else if (form.description.trim().length < 10) errors.description = 'Describe the alternative in at least 10 characters.'
  else if (form.description.trim().length > 350) errors.description = 'Keep the description under 350 characters.'

  if (!activeCategory.trim()) errors.category = 'Please choose or enter a category.'

  if (!form.technologies.trim()) errors.technologies = 'Please select or type at least one technology or skill.'

  return errors
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1 flex items-center gap-1.5 text-xs text-red-400" role="alert">
      <Icon name="alert-circle" size={12} />
      <span>{message}</span>
    </p>
  )
}

export function ContributePage({ repositories }: ContributePageProps) {
  const [form, setForm] = useState<FormState>(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) return { ...EMPTY, ...(JSON.parse(raw) as Partial<FormState>) }
    } catch {
      /* ignore */
    }
    return EMPTY
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [touchedUrl, setTouchedUrl] = useState(false)
  const [isCustomCategoryMode, setIsCustomCategoryMode] = useState(false)
  const [customTechInput, setCustomTechInput] = useState('')

  const activeCategory = useMemo(() => {
    if (isCustomCategoryMode || form.category === '__custom__') {
      return form.customCategory.trim()
    }
    return form.category.trim()
  }, [isCustomCategoryMode, form.category, form.customCategory])

  const techList = useMemo(
    () => [...new Set(form.technologies.split(',').map((t) => t.trim()).filter(Boolean))],
    [form.technologies],
  )

  const parsed = parseOwnerRepo(form.github_url)

  const duplicate = useMemo(() => {
    if (!isValidGithubUrl(form.github_url)) return false
    return isDuplicateUrl(form.github_url, repositories)
  }, [form.github_url, repositories])

  const contribution: Repository = useMemo(
    () => ({
      id: nextRepoId(repositories),
      name: form.name.trim() || 'Alternative Project Name',
      owner: parsed?.owner ?? 'owner',
      description: form.description.trim() || 'Concise description of the open source alternative or tool.',
      github_url: form.github_url.trim() || 'https://github.com/owner/repository',
      category: activeCategory || 'Developer Tools',
      technologies: techList.length > 0 ? techList : ['TypeScript'],
      stars: null,
      contributor: form.contributor.trim() || 'Community',
      created_at: todayIso(),
      featured: false,
      alternative_to: form.alternative_to.trim() || undefined,
      savings_annual: form.savings_annual.trim() || undefined,
      license: form.license.trim() || 'MIT',
    }),
    [repositories, form, parsed, activeCategory, techList],
  )

  const jsonOutput = useMemo(() => {
    const entry: Record<string, unknown> = { ...contribution }
    if (form.notes.trim()) entry.notes = form.notes.trim()
    return JSON.stringify(entry, null, 2)
  }, [contribution, form.notes])

  useEffect(() => {
    try {
      if (JSON.stringify(form) === JSON.stringify(EMPTY)) localStorage.removeItem(DRAFT_KEY)
      else localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
    } catch {
      /* storage unavailable */
    }
  }, [form])

  const set = <K extends keyof FormState>(key: K, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const toggleSkill = (skill: string) => {
    const current = new Set(techList)
    if (current.has(skill)) {
      current.delete(skill)
    } else {
      current.add(skill)
    }
    const updated = Array.from(current).join(', ')
    set('technologies', updated)
  }

  const handleAddCustomTech = () => {
    const trimmed = customTechInput.trim()
    if (!trimmed) return
    const current = new Set(techList)
    current.add(trimmed)
    set('technologies', Array.from(current).join(', '))
    setCustomTechInput('')
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(form, activeCategory)
    if (duplicate) {
      found.github_url = 'This alternative repository is already indexed in the dataset.'
      setErrors(found)
      return
    }
    if (Object.keys(found).length > 0) {
      setErrors(found)
      setSubmitted(false)
      return
    }
    setErrors({})
    setSubmitted(true)
    requestAnimationFrame(() => {
      document.getElementById('contribution-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const resetAll = () => {
    setForm(EMPTY)
    setErrors({})
    setSubmitted(false)
    setTouchedUrl(false)
    setIsCustomCategoryMode(false)
    setCustomTechInput('')
  }

  const filename = `${(parsed?.repo || form.name.trim() || 'alternative').toLowerCase().replace(/[^a-z0-9-]/g, '-')}-alternative.json`

  const inputClass = (hasError?: boolean) =>
    cn(
      'w-full min-h-[44px] rounded-[var(--radius-xs)] border bg-surface-2 px-3 py-2 text-xs sm:text-sm text-ink placeholder:text-ink-3 transition-colors duration-[var(--motion-duration-instant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text-primary)]',
      hasError ? 'border-red-500' : 'border-line hover:border-[var(--color-text-tertiary)] focus:border-[var(--color-text-secondary)]',
    )

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">
          Community Contributions
        </p>
        <h1 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-ink">
          Submit an Open Source Alternative or Tool
        </h1>
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink-2">
          Help consumers and developers find transparent, free alternatives. Fill in the verified details to generate your JSON contribution.
        </p>
      </div>

      {/* HOW THE CONTRIBUTION SYSTEM WORKS (Visual 4-Step Pipeline) */}
      <section className="mt-10 card-surface p-5 sm:p-7" aria-label="How the contribution system works">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-4">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-ink flex items-center gap-2">
              <Icon name="gitbranch" size={16} />
              <span>How the contribution system works</span>
            </h2>
            <p className="mt-1 text-xs text-ink-3">
              A 4-step transparent flow from filling the form to merging your pull request on GitHub.
            </p>
          </div>
          <span className="text-xs font-mono text-ink-3 bg-surface-2 px-2.5 py-1 rounded-[var(--radius-xs)] border border-line w-fit">
            No account required · Client-side generated
          </span>
        </div>

        {/* Sequential 4 Steps with arrows */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {WORKFLOW_STEPS.map((s, index) => {
            const isStepActive =
              (s.step === 1 && !submitted) ||
              (s.step === 2 && submitted) ||
              (s.step === 3 && submitted) ||
              (s.step === 4 && submitted)

            return (
              <div key={s.step} className="relative flex flex-col justify-between">
                <div
                  className={cn(
                    'rounded-[var(--radius-sm)] border p-4 transition-all duration-[var(--motion-duration-instant)] h-full flex flex-col justify-between',
                    isStepActive
                      ? 'border-[var(--color-text-secondary)] bg-surface-3 shadow-md'
                      : 'border-line bg-surface-2 opacity-80'
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-[var(--radius-xs)] font-mono text-xs font-bold border border-line bg-surface-2 text-ink">
                        0{s.step}
                      </span>
                      <Icon name={s.icon} size={15} className="text-ink-2" />
                    </div>
                    <h3 className="mt-3 text-xs font-semibold text-ink leading-snug">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-ink-3">
                      {s.description}
                    </p>
                  </div>

                  {/* Step Action Hints */}
                  <div className="mt-3 pt-2.5 border-t border-line/60 flex items-center justify-between text-[11px]">
                    {s.step === 1 && (
                      <span className="text-emerald-400 font-medium">1. Fill details below</span>
                    )}
                    {s.step === 2 && (
                      <span className="text-ink-2">2. Click Generate</span>
                    )}
                    {s.step === 3 && (
                      <span className="text-ink-2">3. Clipboard or File</span>
                    )}
                    {s.step === 4 && (
                      <a
                        href={GITHUB_PR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>4. Open PR</span>
                        <Icon name="external" size={10} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Arrow connector between steps (visible on desktop) */}
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 grid h-6 w-6 place-items-center rounded-full bg-black border border-line text-ink-3"
                  >
                    <Icon name="arrow-right" size={11} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Main Grid: Form + Preview (minmax ensures no horizontal blow out) */}
      <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        {/* Form Container */}
        <form onSubmit={onSubmit} noValidate className="card-surface min-w-0 w-full p-5 sm:p-7">
          <div className="border-b border-line pb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-ink">Step 1: Fill Alternative Details</h2>
              <p className="mt-0.5 text-xs text-ink-3">Enter project name, repository link, and tech stack.</p>
            </div>
            <span className="text-[11px] text-ink-3 font-mono">* Required fields</span>
          </div>

          <div className="mt-5 space-y-4">
            {/* Alternative Name */}
            <div>
              <label htmlFor="alt-name" className="mb-1 block text-xs font-medium text-ink">
                Alternative project name <span className="text-red-400">*</span>
              </label>
              <input
                id="alt-name"
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Everything Claude Code (ECC), Penpot, Supabase"
                className={inputClass(!!errors.name)}
                aria-invalid={!!errors.name}
              />
              <FieldError message={errors.name} />
            </div>

            {/* GitHub URL */}
            <div>
              <label htmlFor="alt-url" className="mb-1 block text-xs font-medium text-ink">
                GitHub repository URL <span className="text-red-400">*</span>
              </label>
              <input
                id="alt-url"
                type="url"
                value={form.github_url}
                onChange={(e) => set('github_url', e.target.value)}
                onBlur={() => setTouchedUrl(true)}
                placeholder="https://github.com/owner/repository"
                className={inputClass(!!errors.github_url || (touchedUrl && duplicate))}
                aria-invalid={!!errors.github_url || (touchedUrl && duplicate)}
              />
              {touchedUrl && duplicate ? (
                <p className="mt-1 text-xs text-amber-400" role="alert">
                  This repository is already indexed in our dataset.
                </p>
              ) : (
                <FieldError message={errors.github_url} />
              )}
            </div>

            {/* Replaces Commercial Tool (OPTIONAL) & Estimated Savings (OPTIONAL) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="alt-to" className="mb-1 block text-xs font-medium text-ink">
                  Replaces commercial tool <span className="text-ink-3 font-normal">(optional)</span>
                </label>
                <input
                  id="alt-to"
                  type="text"
                  value={form.alternative_to}
                  onChange={(e) => set('alternative_to', e.target.value)}
                  placeholder="e.g. Cursor, Figma, Notion, Photoshop (optional)"
                  className={inputClass(false)}
                />
                <p className="mt-1 text-[11px] text-ink-3">Leave blank if this is a standalone tool or skill library.</p>
              </div>

              <div>
                <label htmlFor="alt-savings" className="mb-1 block text-xs font-medium text-ink">
                  Estimated annual savings <span className="text-ink-3 font-normal">(optional)</span>
                </label>
                <input
                  id="alt-savings"
                  type="text"
                  value={form.savings_annual}
                  onChange={(e) => set('savings_annual', e.target.value)}
                  placeholder="e.g. $144/yr, $240/yr, Free (optional)"
                  className={inputClass(false)}
                />
                <p className="mt-1 text-[11px] text-ink-3">Estimated money saved by switching from commercial alternatives.</p>
              </div>
            </div>

            {/* Description (Guaranteed clean wrapping) */}
            <div className="min-w-0">
              <label htmlFor="alt-desc" className="mb-1 flex items-center justify-between text-xs font-medium text-ink">
                <span>Description <span className="text-red-400">*</span></span>
                <span className="text-ink-3">{form.description.trim().length}/350</span>
              </label>
              <textarea
                id="alt-desc"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={4}
                placeholder="Describe what this open source project does, its key features, and why it's useful to developers or consumers…"
                className={cn(inputClass(!!errors.description), 'min-h-[96px] w-full min-w-0 resize-y leading-relaxed')}
                aria-invalid={!!errors.description}
              />
              <FieldError message={errors.description} />
            </div>

            {/* Category * with Custom/Future Category Support */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="alt-cat" className="block text-xs font-medium text-ink">
                  Category <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomCategoryMode(!isCustomCategoryMode)}
                  className="text-xs text-ink-2 hover:text-white underline"
                >
                  {isCustomCategoryMode ? 'Choose from list' : '+ Add custom category'}
                </button>
              </div>

              {!isCustomCategoryMode ? (
                <div>
                  <select
                    id="alt-cat"
                    value={form.category}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomCategoryMode(true)
                      } else {
                        set('category', e.target.value)
                      }
                    }}
                    className={inputClass(!!errors.category)}
                    aria-invalid={!!errors.category}
                  >
                    <option value="">Select a category…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                    <option value="__custom__">+ Other / Enter Custom Category...</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={form.customCategory}
                    onChange={(e) => set('customCategory', e.target.value)}
                    placeholder="Enter custom category name (e.g. AI Skills, Browser Extensions, Automation)…"
                    className={inputClass(!!errors.category)}
                    aria-invalid={!!errors.category}
                  />
                  <p className="text-[11px] text-ink-3">
                    If this project belongs to a new domain or future category, enter it here. It will be indexed immediately in the dataset.
                  </p>
                </div>
              )}

              {/* Quick Category Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-ink-3">Quick picks:</span>
                {QUICK_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setIsCustomCategoryMode(false)
                      set('category', cat)
                    }}
                    className={cn(
                      'rounded-[var(--radius-xs)] border px-2 py-0.5 text-[11px] transition-colors',
                      activeCategory === cat
                        ? 'border-white bg-surface-3 text-white font-medium'
                        : 'border-line bg-surface-2 text-ink-2 hover:border-line-strong'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <FieldError message={errors.category} />
            </div>

            {/* License & Contributor Handle (OPTIONAL) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="alt-lic" className="mb-1 block text-xs font-medium text-ink">
                  License
                </label>
                <select
                  id="alt-lic"
                  value={form.license}
                  onChange={(e) => set('license', e.target.value)}
                  className={inputClass(false)}
                >
                  <option value="MIT">MIT</option>
                  <option value="Apache-2.0">Apache-2.0</option>
                  <option value="GPL-3.0">GPL-3.0</option>
                  <option value="AGPL-3.0">AGPL-3.0</option>
                  <option value="MPL-2.0">MPL-2.0</option>
                  <option value="BSD-3-Clause">BSD-3-Clause</option>
                  <option value="Open Source">Other Open Source</option>
                </select>
              </div>

              <div>
                <label htmlFor="alt-contrib" className="mb-1 block text-xs font-medium text-ink">
                  Contributor handle <span className="text-ink-3 font-normal">(optional)</span>
                </label>
                <input
                  id="alt-contrib"
                  type="text"
                  value={form.contributor}
                  onChange={(e) => set('contributor', e.target.value)}
                  placeholder="e.g. @yourusername (defaults to Community)"
                  className={inputClass(false)}
                />
              </div>
            </div>

            {/* Technologies & Skills (With Interactive Skill Pills) */}
            <div className="space-y-2">
              <label htmlFor="alt-tech" className="block text-xs font-medium text-ink">
                Technologies, Skills & Tooling <span className="text-red-400">*</span>
              </label>

              {/* Selected Skill Tags Display */}
              {techList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 rounded-[var(--radius-xs)] border border-line bg-surface-3">
                  {techList.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-[var(--radius-xs)] border border-line bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-ink"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => toggleSkill(tag)}
                        className="text-ink-3 hover:text-red-400 focus:outline-none"
                        aria-label={`Remove ${tag}`}
                      >
                        <Icon name="x" size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Input for custom technology or typing */}
              <div className="flex gap-2">
                <input
                  id="alt-tech"
                  type="text"
                  value={customTechInput}
                  onChange={(e) => setCustomTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault()
                      handleAddCustomTech()
                    }
                  }}
                  placeholder="Type skill or tech (e.g. Claude Code, Python, MCP) and press Add or Enter…"
                  className={inputClass(!!errors.technologies && techList.length === 0)}
                />
                <button
                  type="button"
                  onClick={handleAddCustomTech}
                  className="btn-secondary min-h-[44px] px-3.5 py-2 text-xs font-medium shrink-0"
                >
                  Add
                </button>
              </div>

              {/* Suggested Skills & Technologies Pills */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] text-ink-3">Click to add/remove popular skills and stacks:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_SKILLS.map((skill) => {
                    const isSelected = techList.includes(skill)
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={cn(
                          'rounded-[var(--radius-xs)] border px-2 py-1 text-[11px] font-mono transition-colors',
                          isSelected
                            ? 'border-emerald-500/70 bg-emerald-950/50 text-emerald-300 font-semibold'
                            : 'border-line bg-surface-2 text-ink-2 hover:border-line-strong hover:text-ink'
                        )}
                      >
                        {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                      </button>
                    )
                  })}
                </div>
              </div>
              <FieldError message={errors.technologies} />
            </div>

            {/* Optional notes */}
            <div>
              <label htmlFor="alt-notes" className="mb-1 block text-xs font-medium text-ink">
                Maintainer notes <span className="text-ink-3 font-normal">(optional)</span>
              </label>
              <input
                id="alt-notes"
                type="text"
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="Any special install instructions, context, or notes for the review PR"
                className={inputClass(false)}
              />
            </div>
          </div>

          {/* Form Actions (Step 2: Generate JSON) */}
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <button
              type="submit"
              className="btn-primary min-h-[44px] px-5 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]"
            >
              Step 2: Generate JSON contribution
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="btn-secondary min-h-[44px] px-4 py-2 text-xs font-medium"
            >
              Reset Form
            </button>
          </div>

          {submitted && (
            <div className="mt-4 rounded-[var(--radius-xs)] border border-emerald-800/60 bg-emerald-950/40 p-3 text-xs text-emerald-300" role="status">
              <p className="font-semibold flex items-center gap-1.5">
                <Icon name="check" size={14} />
                <span>JSON Generated Successfully!</span>
              </p>
              <p className="mt-1 text-emerald-400/90 leading-relaxed">
                Step 2 complete! Now follow Step 3 to copy/download the JSON, and Step 4 to submit your pull request on GitHub.
              </p>
            </div>
          )}
        </form>

        {/* JSON Preview Panel & Direct PR Submission Actions */}
        <aside id="contribution-result" className="min-w-0 w-full lg:sticky lg:top-20 space-y-4">
          <div className="card-surface overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface-2 px-4 py-3">
              <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <Icon name="code" size={14} />
                <span>Generated JSON Data</span>
              </span>
              <div className="flex items-center gap-2">
                <CopyButton text={jsonOutput} label="Copy JSON" className="btn-secondary min-h-[36px] px-2.5 py-1 text-xs" />
                <button
                  type="button"
                  onClick={() => downloadJson(jsonOutput, filename)}
                  className="btn-secondary min-h-[36px] px-2.5 py-1 text-xs font-medium"
                  aria-label="Download contribution as JSON file"
                >
                  <Icon name="download" size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-black overflow-x-hidden">
              <pre className="font-mono text-xs text-ink-2 leading-relaxed whitespace-pre-wrap break-all sm:break-words">
                <code>{jsonOutput}</code>
              </pre>
            </div>
          </div>

          {/* STEP 4 DIRECT ACTION CARD: Submit GitHub Pull Request */}
          <div className="card-surface p-5 space-y-3.5 border-l-4 border-l-emerald-500">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase text-emerald-400 font-semibold tracking-wider">
                  Step 4 of 4
                </span>
                <h3 className="text-sm font-semibold text-ink mt-0.5">
                  Submit GitHub Pull Request
                </h3>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-xs)] border border-line bg-surface-3 text-ink">
                <Icon name="gitbranch" size={15} />
              </span>
            </div>

            <p className="text-xs text-ink-2 leading-relaxed">
              Once you've copied your JSON, open a Pull Request to append it to <code className="font-mono text-ink bg-surface-2 px-1.5 py-0.5 rounded text-[11px]">src/data/repositories.json</code> in our dataset repository.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href={GITHUB_PR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary min-h-[44px] flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold"
                aria-label="Submit GitHub Pull Request (opens GitHub in new tab)"
              >
                <Icon name="github" size={15} />
                <span>Submit GitHub Pull Request</span>
                <Icon name="external" size={12} />
              </a>

              <a
                href={GITHUB_EDIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium"
                aria-label="Edit repositories.json directly on GitHub"
                title="Edit file directly on GitHub"
              >
                <Icon name="edit-3" size={13} />
                <span>Edit file online</span>
              </a>
            </div>

            <div className="text-[11px] text-ink-3 border-t border-line pt-2.5 flex items-center justify-between">
              <span>Repository: <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="text-ink hover:underline">opensource-hub/opensource-hub</a></span>
              <span>OSI-approved licenses only</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
