const statusConfig = {
  APPROVED: { bg: 'bg-success-100', text: 'text-success-700', dot: 'bg-success-500' },
  REVIEW_REQUIRED: { bg: 'bg-warning-100', text: 'text-warning-700', dot: 'bg-warning-500' },
  PROCESSING: { bg: 'bg-primary-100', text: 'text-primary-700', dot: 'bg-primary-500' },
  FAILED: { bg: 'bg-danger-100', text: 'text-danger-700', dot: 'bg-danger-500' },
  INDEXED: { bg: 'bg-success-100', text: 'text-success-700', dot: 'bg-success-500' },
  PENDING: { bg: 'bg-warning-100', text: 'text-warning-700', dot: 'bg-warning-500' },
  SKIPPED: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  OPEN: { bg: 'bg-warning-100', text: 'text-warning-700', dot: 'bg-warning-500' },
  RESOLVED: { bg: 'bg-success-100', text: 'text-success-700', dot: 'bg-success-500' },
  QUEUED: { bg: 'bg-primary-100', text: 'text-primary-700', dot: 'bg-primary-500' },
  RUNNING: { bg: 'bg-primary-100', text: 'text-primary-700', dot: 'bg-primary-500' },
  COMPLETED: { bg: 'bg-success-100', text: 'text-success-700', dot: 'bg-success-500' },
}

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  )
}
