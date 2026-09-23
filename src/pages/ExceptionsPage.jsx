import { useEffect, useState } from 'react'
import ExceptionTable from '../components/exceptions/ExceptionTable'
import { getExceptions, reviewException } from '../services/exceptionService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'

const exceptionTypes = ['', 'TOTAL_MISMATCH', 'DUPLICATE_FILE', 'DUPLICATE_INVOICE', 'MISSING_PATIENT_NAME', 'MISSING_DIAGNOSIS', 'MISSING_INSURER', 'MISSING_INVOICE_DATE', 'EXTRACTION_FAILED']

export default function ExceptionsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exceptions, setExceptions] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [reviewing, setReviewing] = useState(null)
  const [reviewForm, setReviewForm] = useState({ corrected_fields: '', reviewer_note: '', action: 'APPROVE' })
  const [reviewMsg, setReviewMsg] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await getExceptions({ page, page_size: pageSize, status: status || 'OPEN', type })
        setExceptions(res.items || [])
        setTotal(res.total || 0)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, pageSize, status, type])

  const startReview = (exc) => {
    setReviewing(exc)
    setReviewForm({ corrected_fields: '', reviewer_note: '', action: 'APPROVE' })
    setReviewMsg(null)
  }

  const submitReview = async () => {
    try {
      const res = await reviewException(reviewing.id, reviewForm)
      setReviewMsg(res.message)
      setReviewing(null)
      const data = await getExceptions({ page, page_size: pageSize, status: status || 'OPEN', type })
      setExceptions(data.items || [])
      setTotal(data.total || 0)
    } catch (err) {
      setReviewMsg(err.message)
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exceptions</h1>
        <p className="mt-1 text-sm text-gray-500">Review and resolve processing exceptions</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
          <option value="">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1) }} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
          {exceptionTypes.map((t) => <option key={t} value={t}>{t || 'All Exception Types'}</option>)}
        </select>
      </div>

      {error ? (
        <ErrorMessage message={error} />
      ) : loading ? (
        <LoadingSpinner label="Loading exceptions..." />
      ) : (
        <>
          <ExceptionTable exceptions={exceptions} loading={false} />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{total} exception(s) found</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-400">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages || 1}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-400">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {exceptions.length > 0 && !reviewing && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Review Exception</h3>
          <p className="text-sm text-gray-500">Click an exception row to review it. Select from the table above.</p>
          <div className="mt-3 space-y-2">
            {exceptions.slice(0, 5).map((exc) => (
              <button
                key={exc.id}
                onClick={() => startReview(exc)}
                className="block w-full rounded-md border border-gray-200 px-3 py-2 text-left text-sm transition hover:border-primary-300 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <span className="font-medium text-gray-900">{exc.type}</span>
                <span className="ml-2 text-gray-500">— {exc.file_name} (ID: {exc.id})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {reviewing && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Reviewing: {reviewing.type} (ID: {reviewing.id})
            </h3>
            <button onClick={() => setReviewing(null)} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">Corrected Fields (JSON)</label>
              <textarea
                value={reviewForm.corrected_fields}
                onChange={(e) => setReviewForm({ ...reviewForm, corrected_fields: e.target.value })}
                placeholder='{"patient_name": "Correct Name"}'
                rows={3}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">Reviewer Note</label>
              <textarea
                value={reviewForm.reviewer_note}
                onChange={(e) => setReviewForm({ ...reviewForm, reviewer_note: e.target.value })}
                placeholder="Add a note about this review..."
                rows={2}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setReviewForm({ ...reviewForm, action: 'APPROVE' }); submitReview() }}
                className="inline-flex items-center gap-2 rounded-md bg-success-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-success-400"
              >
                <CheckCircle className="h-4 w-4" /> Approve
              </button>
              <button
                onClick={() => { setReviewForm({ ...reviewForm, action: 'REJECT' }); submitReview() }}
                className="inline-flex items-center gap-2 rounded-md bg-danger-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-danger-400"
              >
                <XCircle className="h-4 w-4" /> Reject
              </button>
            </div>
            {reviewMsg && <p className="text-sm text-gray-600">{reviewMsg}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
