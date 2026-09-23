import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

export default function DocumentTable({ documents, loading }) {
  if (loading) return <p className="py-4 text-center text-sm text-gray-500">Loading documents...</p>
  if (!documents || documents.length === 0)
    return <p className="py-4 text-center text-sm text-gray-500">No documents found.</p>

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">File Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Source</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Invoice No</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Hospital</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Patient</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Vector</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Excp</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">View</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">{doc.id}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{doc.file_name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                <span className={doc.source_type === 'BULK_FOLDER' ? 'text-navy-600' : 'text-primary-600'}>
                  {doc.source_type === 'BULK_FOLDER' ? 'Folder' : 'Upload'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{doc.invoice_no || '—'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{doc.hospital_name || '—'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{doc.patient_name || '—'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{doc.invoice_date || '—'}</td>
              <td className="px-4 py-3 text-right text-sm text-gray-900">
                {doc.printed_total != null ? `₹${doc.printed_total.toLocaleString('en-IN')}` : '—'}
              </td>
              <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
              <td className="px-4 py-3"><StatusBadge status={doc.vector_status} /></td>
              <td className="px-4 py-3 text-center text-sm">
                {doc.exception_count > 0 ? (
                  <span className="font-medium text-warning-600">{doc.exception_count}</span>
                ) : (
                  <span className="text-gray-400">0</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <Link
                  to={`/documents/${doc.id}`}
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-primary-600 transition hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
