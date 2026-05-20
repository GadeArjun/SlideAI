import { motion } from 'framer-motion'
import { FolderOpen, Plus } from 'lucide-react'

export function EmptyState({ icon: Icon = FolderOpen, title = 'Nothing here yet', description = '', action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-[var(--text-muted)]" />
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--text-secondary)] max-w-xs mb-5">{description}</p>
      )}
      {action && (
        <button onClick={action.onClick} className="btn-primary">
          <Plus className="w-4 h-4" />
          {action.label}
        </button>
      )}
    </motion.div>
  )
}
