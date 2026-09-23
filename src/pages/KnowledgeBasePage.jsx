import { useEffect, useState, useRef } from 'react'
import { Play, RefreshCw, Search, Info } from 'lucide-react'
import IndexStats from '../components/ingestion/IndexStats'
import IngestionProgress from '../components/ingestion/IngestionProgress'
import { startBulkIngestion, getIngestionJob, getIngestionStats, reindexDocument } from '../services/ingestionService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

export default function KnowledgeBasePage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [job, setJob] = useState(null)
  const [reindexId, setReindexId] = useState('')
  const [reindexMsg, setReindexMsg] = useState(null)
  const pollRef = useRef(null)

  const loadStats = async () => {
    try {
      setRefreshing(true)
      const s = await getIngestionStats()
      setStats(s)
    } catch (err) {
      setError(err.message)
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  const handleStart = async () => {
    try {
      const res = await startBulkIngestion()
      pollJob(res.job_id)
    } catch (err) {
      setError(err.message)
    }
  }

  const pollJob = (jobId) => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const j = await getIngestionJob(jobId)
        setJob(j)
        if (j.status !== 'QUEUED' && j.status !== 'RUNNING') {
          clearInterval(pollRef.current)
          pollRef.current = null
          loadStats()
        }
      } catch (err) {
        clearInterval(pollRef.current)
        pollRef.current = null
        setError(err.message)
      }
    }, 5000)
  }

  const handleReindex = async () => {
    if (!reindexId.trim()) return
    try {
      const res = await reindexDocument(reindexId.trim())
      setReindexMsg(res.message)
      setReindexId('')
    } catch (err) {
      setReindexMsg(err.message)
    }
  }

  if (loading) return <LoadingSpinner label="Loading knowledge base..." />
  if (error) return <ErrorMessage message={error} onRetry={loadStats} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
        <p className="mt-1 text-sm text-gray-500">Bulk folder ingestion and vector index management</p>
      </div>

      <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 flex-shrink-0 text-primary-600" />
          <p className="text-sm text-primary-800">
            The backend reads PDFs only from its configured <code className="rounded bg-primary-100 px-1">data/source_invoices</code> folder.
            The browser does not upload all 18,000 files. The safe folder path is configured in the backend environment.
          </p>
        </div>
      </div>

      <IndexStats stats={stats || {}} onRefresh={loadStats} refreshing={refreshing} />

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleStart}
          disabled={job?.status === 'QUEUED' || job?.status === 'RUNNING'}
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          {job?.status === 'QUEUED' || job?.status === 'RUNNING' ? 'Ingestion Running...' : 'Start / Resume Bulk Ingestion'}
        </button>
        <button
          onClick={loadStats}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Statistics
        </button>
      </div>

      {job && <IngestionProgress job={job} />}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Reindex Single Document</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={reindexId}
            onChange={(e) => setReindexId(e.target.value)}
            placeholder="Enter document ID"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <button
            onClick={handleReindex}
            className="inline-flex items-center gap-2 rounded-md bg-navy-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500"
          >
            <Search className="h-4 w-4" />
            Reindex
          </button>
        </div>
        {reindexMsg && <p className="mt-2 text-sm text-gray-600">{reindexMsg}</p>}
      </div>
    </div>
  )
}
