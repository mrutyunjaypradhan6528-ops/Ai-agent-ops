export default function IngestionProgress({ job }) {
  if (!job) return null

  const percent = job.progress_percent || (job.total > 0 ? Math.round((job.processed / job.total) * 100) : 0)
  const isRunning = job.status === 'QUEUED' || job.status === 'RUNNING'

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Ingestion Job Progress</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isRunning ? 'bg-primary-100 text-primary-700' : 'bg-success-100 text-success-700'
          }`}
        >
          {job.status}
        </span>
      </div>

      <div className="w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${isRunning ? 'bg-primary-500' : 'bg-success-500'}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">{percent}% complete</span>
        <span className="text-gray-500">
          {job.processed?.toLocaleString()} / {job.total?.toLocaleString()} files
        </span>
      </div>

      {job.current_file && isRunning && (
        <p className="text-sm text-gray-500">
          Processing: <span className="font-mono text-gray-700">{job.current_file}</span>
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-success-50 p-3">
          <p className="text-xs font-medium uppercase text-success-700">Succeeded</p>
          <p className="mt-1 text-lg font-bold text-success-800">{job.succeeded?.toLocaleString() || 0}</p>
        </div>
        <div className="rounded-lg bg-danger-50 p-3">
          <p className="text-xs font-medium uppercase text-danger-700">Failed</p>
          <p className="mt-1 text-lg font-bold text-danger-800">{job.failed?.toLocaleString() || 0}</p>
        </div>
        <div className="rounded-lg bg-gray-100 p-3">
          <p className="text-xs font-medium uppercase text-gray-600">Skipped Duplicates</p>
          <p className="mt-1 text-lg font-bold text-gray-800">{job.skipped_duplicates?.toLocaleString() || 0}</p>
        </div>
        <div className="rounded-lg bg-primary-50 p-3">
          <p className="text-xs font-medium uppercase text-primary-700">Indexed Docs</p>
          <p className="mt-1 text-lg font-bold text-primary-800">{job.indexed_documents?.toLocaleString() || 0}</p>
        </div>
      </div>
    </div>
  )
}
