import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'

const REPO_URL = 'https://github.com/devSubhamRoy/OpenStarRepo-OSR'
const DATASET_PATH = 'src/data/repositories.json'

const CONTRIBUTION_STEPS = [
  {
    title: 'Fill in the alternative submission form',
    text: 'Use the Contribute page to specify the alternative name, repository URL, commercial software replaced, and license.',
  },
  {
    title: 'Generate verified JSON data',
    text: 'Click "Generate JSON contribution" to view formatted JSON schema matching our 70+ indexed alternatives.',
  },
  {
    title: 'Copy or download the JSON object',
    text: 'Copy the snippet directly to your clipboard. The file is formatted client-side with zero telemetry.',
  },
  {
    title: 'Fork the GitHub repository',
    text: `Fork ${REPO_URL.replace('https://', '')} on GitHub where the open dataset is maintained in version control.`,
  },
  {
    title: `Add the contribution to ${DATASET_PATH}`,
    text: 'Append your JSON entry to the "repositories" array using the next sequential three-digit ID.',
  },
  {
    title: 'Submit a Pull Request',
    text: 'Open a PR from your fork. Community maintainers verify OSI license, repo activity, and merge the entry.',
  },
]

const JSON_EXAMPLE = `{
  "id": "071",
  "name": "Penpot",
  "owner": "penpot",
  "description": "The open-source web-based design and prototyping platform for product teams. Native web standards and SVG by default.",
  "github_url": "https://github.com/penpot/penpot",
  "category": "UI/UX Design",
  "technologies": ["Clojure", "ClojureScript", "SVG"],
  "stars": 33400,
  "contributor": "Community",
  "created_at": "2026-11-17",
  "featured": true,
  "alternative_to": "Figma ($144/yr)",
  "savings_annual": "$144/yr",
  "license": "MPL-2.0"
}`

const COMMUNITY_RULES = [
  {
    icon: 'shield',
    title: 'Submit only verifiable open-source projects',
    text: 'Every entry must link to a public repository with an OSI-approved license (MIT, Apache-2.0, GPL, AGPL, MPL). No closed source or proprietary wrappers.',
  },
  {
    icon: 'check',
    title: 'Specify commercial software replaced',
    text: 'Help consumers and shoppers understand the direct value. Specify what proprietary software or SaaS subscription this alternative replaces.',
  },
  {
    icon: 'heart',
    title: 'Provide realistic savings estimates',
    text: 'Calculate honest annual subscription savings based on standard individual or small team commercial pricing tiers.',
  },
  {
    icon: 'code',
    title: 'Describe honestly without marketing fluff',
    text: 'Write concise, implementation-focused descriptions. Explain technical capabilities and self-hosting options factually.',
  },
  {
    icon: 'users',
    title: 'Credit authors and contributors',
    text: 'Respect project maintainers and provide correct repository owners and developer attribution.',
  },
  {
    icon: 'info',
    title: 'Zero telemetry and transparent JSON',
    text: 'This dashboard runs entirely static on client browsers. All directory data lives in transparent, version-controlled JSON.',
  },
]

const FAQS = [
  {
    q: 'Why focus on Open Source Alternatives to Popular Software?',
    a: 'Proprietary software subscriptions often lock user data and accumulate significant monthly expenses. Open-source alternatives offer consumers data privacy, zero recurring license fees, and the freedom to self-host.',
  },
  {
    q: 'Do I need an account to browse alternatives?',
    a: 'No account, email, or login is required. The dashboard is accessible to all users and shoppers with zero tracking cookies.',
  },
  {
    q: 'How are annual savings calculated?',
    a: 'Savings are estimated by comparing typical annual single-user license fees of commercial tools (like Figma, Photoshop, 1Password, Slack) against free community editions.',
  },
  {
    q: 'How do I report an unmaintained project?',
    a: 'Open a GitHub issue or PR to update the status badge to "Archived" or suggest an active alternative.',
  },
]

export function GuidelinesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">
          Contribution Standards
        </p>
        <h1 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-ink">
          Guidelines & Open Source Criteria
        </h1>
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink-2">
          Everything you need to know about indexing software alternatives, submitting pull requests, and maintaining community quality.
        </p>
      </div>

      {/* 6 Steps */}
      <section className="mt-10" aria-label="Step-by-step submission guide">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-3">
          Submission Workflow
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CONTRIBUTION_STEPS.map((step, idx) => (
            <div key={step.title} className="card-surface p-4 flex flex-col justify-between">
              <div>
                <span className="inline-block rounded-[var(--radius-xs)] border border-line bg-surface-3 px-2 py-0.5 font-mono text-xs font-bold text-ink mb-2">
                  0{idx + 1}
                </span>
                <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-2">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Schema Example */}
      <section className="mt-12" aria-label="JSON Schema specification">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-3">
              Standard JSON Schema
            </h2>
            <p className="text-xs text-ink-2">Example entry formatted for {DATASET_PATH}</p>
          </div>
          <Link to="/contribute" className="btn-secondary inline-flex min-h-[36px] items-center gap-1.5 px-3 py-1 text-xs font-medium w-fit">
            <span>Use Form Generator</span>
            <Icon name="arrow-right" size={12} />
          </Link>
        </div>

        <div className="mt-4 rounded-[var(--radius-xs)] border border-line bg-surface-2 p-4">
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-ink-2">
            <code>{JSON_EXAMPLE}</code>
          </pre>
        </div>
      </section>

      {/* Community Rules */}
      <section id="rules" className="mt-12" aria-label="Quality and community rules">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-3">
          Quality Acceptance Criteria
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COMMUNITY_RULES.map((r) => (
            <div key={r.title} className="card-surface p-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-xs)] border border-line bg-surface-3 text-ink">
                  <Icon name={r.icon} size={15} />
                </span>
                <h3 className="text-sm font-semibold text-ink">{r.title}</h3>
              </div>
              <p className="mt-2.5 text-xs text-ink-2 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="mt-12" aria-label="Frequently asked questions">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-3">
          Frequently Asked Questions
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {FAQS.map((faq) => (
            <div key={faq.q} className="card-surface p-4">
              <h3 className="text-sm font-semibold text-ink">{faq.q}</h3>
              <p className="mt-2 text-xs text-ink-2 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
