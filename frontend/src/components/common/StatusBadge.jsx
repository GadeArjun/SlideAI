import { cn } from '../../lib/utils'
import { STATUS_COLORS, STATUS_LABELS } from '../../constants'
import { Loader2 } from 'lucide-react'
import { isActiveStatus } from '../../lib/utils'

export function StatusBadge({ status, className }) {
  const active = isActiveStatus(status)
  return (
    <span className={cn('status-badge', STATUS_COLORS[status], className)}>
      {active && <Loader2 className="w-3 h-3 animate-spin" />}
      {!active && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {STATUS_LABELS[status] || status}
    </span>
  )
}
