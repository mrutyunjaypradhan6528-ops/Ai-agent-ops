import { useEffect, useState } from 'react'
import DocumentTable from '../components/documents/DocumentTable'
import { getDocuments } from '../services/documentService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

const statusOptions = ['', 'APPROVED', 'REVIEW_REQUIRED', 'PROCESSING', 'FAILED']
const vectorOptions = ['', 'INDEXED', 'PENDING', 'SKIPPED', 'FAILED']
const sourceOptions = ['', 'BULK_FOLDER', 'UI_UPLOAD']
const exceptionTypes = ['', 'TOTAL_MISMATCH', 'DUPLICATE_FILE', 'DUPLICATE_INVOICE', 'MISSING_PATIENT_NAME', 'MISSING_DIAGNOSIS', 'MISSING_INSURER', 'MISSING_INVOICE_DATE', 'EXTRACTION_FAILED']

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [documents, setDocuments] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [sourceType, setSourceType] = useState('')
  const [vectorStatus, setVectorStatus] = useState('')
  const [hospital, setHospital] = useState('')
  const [exceptionType, setExceptionType] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await getDocuments({
          page,
          page_size: pageSize,
          search,
          status,
          source_type: sourceType,
          vector_status: vectorStatus,
          hospital,
          exception_type: exceptionType,
        })
        setDocuments(res.items || [])
        setTotal(res.total || 0)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    const debounce = setTimeout(load, 300)
    return () => clearTimeout(debounce)
  }, [page, pageSize, search, status, sourceType, vectorStatus, hospital, exceptionType])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="mt-1 text-sm text-gray-500">Browse and search all processed invoice documents</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name, invoice, hospital, patient..."
              className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
            {statusOptions.map((s) => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
          </select>
          <select value={sourceType} onChange={(e) => { setSourceType(e.target.value); setPage(1) }} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
            {sourceOptions.map((s) => <option key={s} value={s}>{s || 'All Sources'}</option>)}
          </select>
          <select value={vectorStatus} onChange={(e) => { setVectorStatus(e.target.value); setPage(1) }} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
            {vectorOptions.map((s) => <option key={s} value={s}>{s || 'All Vector Statuses'}</option>)}
          </select>
          <input
            type="text"
            value={hospital}
            onChange={(e) => { setHospital(e.target.value); setPage(1) }}
            placeholder="Hospital name"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <select value={exceptionType} onChange={(e) => { setExceptionType(e.target.value); setPage(1) }} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
            {exceptionTypes.map((s) => <option key={s} value={s}>{s || 'All Exception Types'}</option>)}
          </select>
        </div>
      </div>

      {error ? (
        <ErrorMessage message={error} />
      ) : loading ? (
        <LoadingSpinner label="Loading documents..." />
      ) : (
        <>
          <DocumentTable documents={documents} loading={false} />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages || 1}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
