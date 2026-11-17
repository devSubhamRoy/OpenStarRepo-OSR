import type { CategorySlug } from '../types'

export interface CategoryMeta {
  slug: CategorySlug
  label: string
  tagline: string
  icon: string
  gradient: string
  chip: string
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'web-development',
    label: 'Web Development',
    tagline: 'Frameworks, libraries and tools for building for the web.',
    icon: 'globe',
    gradient: 'from-indigo-500 via-blue-500 to-cyan-400',
    chip: 'from-indigo-500/15 to-cyan-400/10 text-indigo-500 dark:text-indigo-300 border-indigo-500/25',
  },
  {
    slug: 'ui-ux-design',
    label: 'UI/UX Design',
    tagline: 'Icons, illustration libraries and design resources for interfaces.',
    icon: 'palette',
    gradient: 'from-fuchsia-500 via-pink-500 to-rose-400',
    chip: 'from-fuchsia-500/15 to-rose-400/10 text-fuchsia-500 dark:text-fuchsia-300 border-fuchsia-500/25',
  },
  {
    slug: 'ai-machine-learning',
    label: 'AI & Machine Learning',
    tagline: 'Models, tooling and resources for the AI era of software.',
    icon: 'sparkles',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    chip: 'from-violet-500/15 to-fuchsia-500/10 text-violet-500 dark:text-violet-300 border-violet-500/25',
  },
  {
    slug: 'ai-agents-skills',
    label: 'AI Agents & Skills',
    tagline: 'Skills, MCP servers, subagents, and automated workflows for AI assistants.',
    icon: 'zap',
    gradient: 'from-purple-500 via-violet-500 to-indigo-500',
    chip: 'from-violet-500/15 to-indigo-500/10 text-violet-400 border-violet-500/25',
  },
  {
    slug: 'productivity-office',
    label: 'Productivity & Office',
    tagline: 'Notes, document editing, spreadsheets, tasks, and office collaboration suites.',
    icon: 'check',
    gradient: 'from-teal-500 via-emerald-500 to-green-500',
    chip: 'from-emerald-500/15 to-teal-500/10 text-emerald-400 border-emerald-500/25',
  },
  {
    slug: 'media-creative-tools',
    label: 'Media & Creative Tools',
    tagline: 'Audio workstations, video editing, 3D modeling, and digital painting suites.',
    icon: 'palette',
    gradient: 'from-rose-500 via-pink-500 to-amber-500',
    chip: 'from-rose-500/15 to-pink-500/10 text-rose-400 border-rose-500/25',
  },
  {
    slug: 'developer-tools',
    label: 'Developer Tools',
    tagline: 'Editors, build tooling and productivity utilities for developers.',
    icon: 'terminal',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    chip: 'from-emerald-500/15 to-cyan-500/10 text-emerald-500 dark:text-emerald-300 border-emerald-500/25',
  },
  {
    slug: 'mobile-applications',
    label: 'Mobile Applications',
    tagline: 'Frameworks and libraries for iOS, Android and cross-platform apps.',
    icon: 'smartphone',
    gradient: 'from-sky-500 via-blue-500 to-indigo-500',
    chip: 'from-sky-500/15 to-indigo-500/10 text-sky-500 dark:text-sky-300 border-sky-500/25',
  },
  {
    slug: 'education',
    label: 'Education',
    tagline: 'Curriculums, roadmaps and resources to learn to code for free.',
    icon: 'book',
    gradient: 'from-amber-500 via-orange-500 to-rose-400',
    chip: 'from-amber-500/15 to-rose-400/10 text-amber-500 dark:text-amber-300 border-amber-500/25',
  },
  {
    slug: 'open-source-resources',
    label: 'Open Source Resources',
    tagline: 'Guides, licenses and starter projects for contributing to open source.',
    icon: 'compass',
    gradient: 'from-lime-500 via-green-500 to-emerald-500',
    chip: 'from-lime-500/15 to-emerald-500/10 text-lime-600 dark:text-lime-300 border-lime-500/25',
  },
  {
    slug: 'design-systems',
    label: 'Design Systems',
    tagline: 'Component libraries, primitives and tokens for consistent product design.',
    icon: 'layers',
    gradient: 'from-purple-500 via-indigo-500 to-blue-500',
    chip: 'from-purple-500/15 to-blue-500/10 text-purple-500 dark:text-purple-300 border-purple-500/25',
  },
  {
    slug: 'apis-backend',
    label: 'APIs & Backend',
    tagline: 'Frameworks, servers and infrastructure for the back of the stack.',
    icon: 'plug',
    gradient: 'from-rose-500 via-red-500 to-orange-400',
    chip: 'from-rose-500/15 to-orange-400/10 text-rose-500 dark:text-rose-300 border-rose-500/25',
  },
  {
    slug: 'cybersecurity',
    label: 'Cybersecurity',
    tagline: 'Security tooling, standards and analysis engines for safer software.',
    icon: 'shield',
    gradient: 'from-slate-500 via-cyan-600 to-blue-600',
    chip: 'from-cyan-500/15 to-blue-600/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/25',
  },
]

export const UNCATEGORIZED = 'Uncategorized'

export function categoryMeta(category: string): CategoryMeta | undefined {
  const found = CATEGORIES.find((c) => c.label.toLowerCase() === category.toLowerCase())
  if (found) return found
  if (!category) return undefined
  return {
    slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    label: category,
    tagline: `Community-curated projects and tools in ${category}.`,
    icon: 'folder',
    gradient: 'from-blue-500 to-indigo-500',
    chip: 'border-line bg-surface-2 text-ink-2',
  }
}

export function categoryBySlug(slug: string): CategoryMeta | undefined {
  const found = CATEGORIES.find((c) => c.slug === slug)
  if (found) return found
  if (!slug) return undefined
  const formatted = slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
  return {
    slug,
    label: formatted,
    tagline: `Community-curated projects and tools in ${formatted}.`,
    icon: 'folder',
    gradient: 'from-blue-500 to-indigo-500',
    chip: 'border-line bg-surface-2 text-ink-2',
  }
}
