import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'

export default function ExceptionTable({ exceptions, loading }) {
  if (loading) return <p className="py-4 text-center text-sm text-gray-500">Loading exceptions...</p>
  if (!exceptions || exceptions.length === 0)
    return <p className="py-4 text-center text-sm text-gray-500">No exceptions found.</p>

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Document</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Invoice No</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Hospital</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Message</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {exceptions.map((exc) => (
            <tr key={exc.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">{exc.id}</td>
              <td className="px-4 py-3 text-sm">
                <Link
                  to={`/documents/${exc.document_id}`}
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  {exc.file_name}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{exc.invoice_no || '—'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{exc.hospital_name || '—'}</td>
              <td className="px-4 py-3 text-sm">
                <span className="rounded bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700">
                  {exc.type}
                </span>
              </td>
              <td className="px-4 py-3"><StatusBadge status={exc.status} /></td>
              <td className="px-4 py-3 text-sm text-gray-600">{exc.message}</td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(exc.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
