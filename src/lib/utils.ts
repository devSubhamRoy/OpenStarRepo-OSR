import type { Repository } from '../types'

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function formatStars(stars: number | null): string | null {
  if (stars === null || stars === undefined) return null
  if (stars >= 1_000_000) {
    const m = stars / 1_000_000
    return `${m >= 100 ? Math.round(m) : Math.round(m * 10) / 10}M`
  }
  if (stars >= 1000) {
    const k = stars / 1000
    return `${k >= 100 ? Math.round(k) : Math.round(k * 10) / 10}k`
  }
  return String(stars)
}

export function formatDate(iso: string): string {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

const GITHUB_URL_RE = /^https:\/\/github\.com\/[A-Za-z0-9](?:[A-Za-z0-9-]{0,38}[A-Za-z0-9])?\/[A-Za-z0-9_.-]{1,100}(?:\.git)?\/?$/

export function isValidGithubUrl(url: string): boolean {
  return GITHUB_URL_RE.test(url.trim())
}

export function parseOwnerRepo(url: string): { owner: string; repo: string } | null {
  if (!isValidGithubUrl(url)) return null
  const parts = url
    .trim()
    .replace(/^https:\/\/github\.com\//i, '')
    .replace(/\.git\/?$/, '')
    .split('/')
  return { owner: parts[0] ?? '', repo: parts[1] ?? '' }
}

export function isDuplicateUrl(url: string, repositories: Repository[]): boolean {
  const normalized = url.trim().replace(/\.git\/?$/, '').toLowerCase()
  return repositories.some((r) => r.github_url.replace(/\.git\/?$/, '').toLowerCase() === normalized)
}

export function nextRepoId(repositories: Repository[]): string {
  let max = 0
  for (const r of repositories) {
    const n = parseInt(r.id, 10)
    if (!Number.isNaN(n) && n > max) max = n
  }
  return String(max + 1).padStart(3, '0')
}

export function todayIso(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(el)
      return ok
    } catch {
      return false
    }
  }
}

export function downloadJson(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function initials(name: string): string {
  return name
    .split(/[\s-_]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
}
