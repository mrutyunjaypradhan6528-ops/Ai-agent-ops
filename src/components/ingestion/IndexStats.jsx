import { RefreshCw, Database, FileText, CheckCircle, XCircle, Copy, Layers, FolderOpen } from 'lucide-react'

export default function IndexStats({ stats, onRefresh, refreshing }) {
  const items = [
    { label: 'Source Folder', value: stats.source_folder || 'data/source_invoices', icon: FolderOpen, color: 'text-navy-600' },
    { label: 'Discovered PDFs', value: stats.discovered_pdfs?.toLocaleString(), icon: Database, color: 'text-primary-600' },
    { label: 'Processed', value: stats.processed?.toLocaleString(), icon: FileText, color: 'text-primary-600' },
    { label: 'Succeeded', value: stats.succeeded?.toLocaleString(), icon: CheckCircle, color: 'text-success-600' },
    { label: 'Failed', value: stats.failed?.toLocaleString(), icon: XCircle, color: 'text-danger-600' },
    { label: 'Skipped Duplicates', value: stats.skipped_duplicates?.toLocaleString(), icon: Copy, color: 'text-gray-600' },
    { label: 'Indexed Documents', value: stats.indexed_documents?.toLocaleString(), icon: FileText, color: 'text-success-600' },
    { label: 'Indexed Chunks', value: stats.indexed_chunks?.toLocaleString(), icon: Layers, color: 'text-success-600' },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Vector Index Statistics</h3>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="rounded-lg border border-gray-200 bg-white p-4">
              <Icon className={`h-5 w-5 ${item.color}`} />
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">{item.label}</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{item.value || '—'}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
