import { Icon } from './Icon'
import { cn } from '../lib/utils'

interface EmptyStateProps {
  icon?: string
  title: string
  message: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon = 'search', title, message, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'card-surface mx-auto flex max-w-lg flex-col items-center p-8 text-center',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="grid h-12 w-12 place-items-center rounded-[var(--radius-xs)] border border-line bg-surface-3 text-ink">
        <Icon name={icon} size={22} />
      </div>
      <h3 className="mt-4 text-[18px] font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-ink-2">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
