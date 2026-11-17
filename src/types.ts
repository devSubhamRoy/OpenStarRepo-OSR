export interface Repository {
  id: string
  name: string
  owner: string
  description: string
  github_url: string
  category: string
  technologies: string[]
  stars: number | null
  contributor: string
  created_at: string
  featured?: boolean
  alternative_to?: string
  license?: string
  savings_annual?: string
  commercial_cost?: string
}

export interface RepositoryContribution extends Repository {
  notes?: string
}

export type SortOption = 'featured' | 'alphabetical' | 'newest' | 'stars'

export type CategorySlug =
  | 'web-development'
  | 'ui-ux-design'
  | 'ai-machine-learning'
  | 'ai-agents-skills'
  | 'productivity-office'
  | 'media-creative-tools'
  | 'developer-tools'
  | 'mobile-applications'
  | 'education'
  | 'open-source-resources'
  | 'design-systems'
  | 'apis-backend'
  | 'cybersecurity'
  | (string & {})
