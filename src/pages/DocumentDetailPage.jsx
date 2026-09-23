import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Send, Search, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { getDocumentById, reprocessDocument, sendToReview } from '../services/documentService'
import { reindexDocument } from '../services/ingestionService'
import InvoiceFields from '../components/documents/InvoiceFields'
import LineItemsTable from '../components/documents/LineItemsTable'
import StatusBadge from '../components/common/StatusBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

export default function DocumentDetailPage() {
  const { documentId } = useParams()
  const navigate = useNavigate()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionMsg, setActionMsg] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const d = await getDocumentById(documentId)
        setDoc(d)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [documentId])

  const handleReprocess = async () => {
    try {
      const res = await reprocessDocument(documentId)
      setActionMsg(res.message)
    } catch (err) {
      setActionMsg(err.message)
    }
  }

  const handleReview = async () => {
    try {
      const res = await sendToReview(documentId)
      setActionMsg(res.message)
    } catch (err) {
      setActionMsg(err.message)
    }
  }

  const handleReindex = async () => {
    try {
      const res = await reindexDocument(documentId)
      setActionMsg(res.message)
    } catch (err) {
      setActionMsg(err.message)
    }
  }

  if (loading) return <LoadingSpinner label="Loading document..." />
  if (error) return <ErrorMessage message={error} />

  const header = doc.invoice_header || {}
  const totalsMismatch =
    header.printed_total != null &&
    header.computed_total != null &&
    Math.abs(header.printed_total - header.computed_total) > 0.01

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/documents')}
          className="inline-flex items-center gap-1 text-sm text-gray-600 transition hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{doc.file_name}</h1>
          <p className="mt-1 text-sm text-gray-500">Document ID: {doc.id}</p>
        </div>
      </div>

      {actionMsg && (
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-3">
          <p className="text-sm text-primary-700">{actionMsg}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button onClick={handleReprocess} className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400">
          <RefreshCw className="h-4 w-4" /> Reprocess
        </button>
        <button onClick={handleReview} className="inline-flex items-center gap-2 rounded-md bg-warning-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-warning-600 focus:outline-none focus:ring-2 focus:ring-warning-400">
          <Send className="h-4 w-4" /> Send to Review
        </button>
        <button onClick={handleReindex} className="inline-flex items-center gap-2 rounded-md bg-navy-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500">
          <Search className="h-4 w-4" /> Reindex
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Extraction Method</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{doc.extraction_method || '—'}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">OCR Status</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{doc.ocr_status || '—'}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Vector Status</p>
          <div className="mt-1"><StatusBadge status={doc.vector_status} /></div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Chunk Count</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{doc.chunk_count || 0}</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">File Information</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div><p className="text-xs text-gray-500">File Name</p><p className="text-sm text-gray-900">{doc.file_name}</p></div>
          <div><p className="text-xs text-gray-500">Page Count</p><p className="text-sm text-gray-900">{doc.page_count || '—'}</p></div>
          <div><p className="text-xs text-gray-500">File Size</p><p className="text-sm text-gray-900">{doc.file_size_bytes ? `${(doc.file_size_bytes / 1024).toFixed(0)} KB` : '—'}</p></div>
          <div><p className="text-xs text-gray-500">SHA-256</p><p className="text-sm font-mono text-gray-900 break-all">{doc.sha256 || '—'}</p></div>
          <div><p className="text-xs text-gray-500">Source Type</p><p className="text-sm text-gray-900">{doc.source_type}</p></div>
          <div><p className="text-xs text-gray-500">Created At</p><p className="text-sm text-gray-900">{new Date(doc.created_at).toLocaleString()}</p></div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Invoice Header Fields</h2>
        <InvoiceFields header={header} />
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Line Items</h2>
        <LineItemsTable items={doc.line_items} />
      </div>

      <div className={`rounded-lg border p-6 ${totalsMismatch ? 'border-danger-300 bg-danger-50' : 'border-gray-200 bg-white'}`}>
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Totals</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Printed Total</p>
            <p className={`mt-1 text-xl font-bold ${totalsMismatch ? 'text-danger-700' : 'text-gray-900'}`}>
              ₹{header.printed_total?.toLocaleString('en-IN') || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Computed Total</p>
            <p className={`mt-1 text-xl font-bold ${totalsMismatch ? 'text-danger-700' : 'text-gray-900'}`}>
              ₹{header.computed_total?.toLocaleString('en-IN') || '—'}
            </p>
          </div>
        </div>
        {totalsMismatch && (
          <div className="mt-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-danger-500" />
            <p className="text-sm font-medium text-danger-700">Printed total does not match computed total.</p>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Validation Results</h2>
        <div className="space-y-2">
          {(doc.validation_results || []).map((vr, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-md bg-gray-50 px-3 py-2">
              {vr.status === 'PASS' ? (
                <CheckCircle className="h-4 w-4 text-success-500" />
              ) : (
                <XCircle className="h-4 w-4 text-danger-500" />
              )}
              <div>
                <span className="text-sm font-medium text-gray-900">{vr.field}</span>
                <span className="ml-2 text-xs text-gray-500">{vr.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {doc.exceptions && doc.exceptions.length > 0 && (
        <div className="rounded-lg border border-warning-200 bg-warning-50 p-6">
          <h2 className="mb-4 text-sm font-semibold text-warning-800">Exceptions ({doc.exceptions.length})</h2>
          <div className="space-y-2">
            {doc.exceptions.map((exc) => (
              <div key={exc.id} className="flex items-center gap-3 rounded-md bg-white px-3 py-2">
                <AlertCircle className="h-4 w-4 text-warning-500" />
                <span className="text-sm font-medium text-gray-900">{exc.type}</span>
                <span className="text-sm text-gray-600">{exc.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Audit Trail</h2>
        <div className="space-y-3">
          {(doc.audit_trail || []).map((entry, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-navy-100">
                <div className="h-2 w-2 rounded-full bg-navy-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                <p className="text-xs text-gray-500">{entry.detail}</p>
                <p className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
