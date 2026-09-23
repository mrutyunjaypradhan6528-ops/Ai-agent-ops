import { Link } from 'react-router-dom'
import { FileText, Hash, File } from 'lucide-react'

export default function CitationCard({ citation }) {
  return (
    <Link
      to={`/documents/${citation.document_id}`}
      className="block rounded-lg border border-gray-200 bg-gray-50 p-3 transition hover:border-primary-300 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-400"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-medium text-gray-900">{citation.invoice_no}</span>
        </div>
        <span className="text-xs text-gray-500">Page {citation.page_number}</span>
      </div>
      <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><File className="h-3 w-3" />{citation.file_name}</span>
        <span className="flex items-center gap-1"><Hash className="h-3 w-3" />{citation.chunk_id}</span>
      </div>
      <p className="mt-2 rounded bg-white px-2 py-1 text-xs italic text-gray-600 border border-gray-200">
        "{citation.snippet}"
      </p>
    </Link>
  )
}
