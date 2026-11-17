import { Icon } from './Icon'
import { useCopy } from '../hooks/useCopy'
import { cn } from '../lib/utils'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
  iconSize?: number
  title?: string
}

export function CopyButton({ text, label, className, iconSize = 14, title }: CopyButtonProps) {
  const { copied, copy } = useCopy()
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        void copy(text)
      }}
      className={cn(
        'btn-secondary inline-flex min-h-[44px] items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]',
        copied && 'border-emerald-600 text-emerald-400 bg-emerald-950/40',
        className,
      )}
      aria-label={title ?? (label ? `Copy ${label}` : 'Copy to clipboard')}
      title={title ?? (copied ? 'Copied to clipboard' : 'Copy')}
    >
      <Icon name={copied ? 'check' : 'copy'} size={iconSize} />
      {label && <span>{copied ? 'Copied' : label}</span>}
    </button>
  )
}
