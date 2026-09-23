import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, CheckCircle, AlertTriangle, Copy, IndianRupee, TrendingUp, ArrowRight } from 'lucide-react'
import DocumentTable from '../components/documents/DocumentTable'
import ExceptionChart from '../components/charts/ExceptionChart'
import InvoiceTrendChart from '../components/charts/InvoiceTrendChart'
import { getDocuments } from '../services/documentService'
import { getAnalyticsSummary, getAnalyticsTrends } from '../services/analyticsService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState(null)
  const [recentDocs, setRecentDocs] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const [s, t, docs] = await Promise.all([
          getAnalyticsSummary(),
          getAnalyticsTrends(),
          getDocuments({ page: 1, page_size: 5 }),
        ])
        setSummary(s)
        setTrends(t)
        setRecentDocs(docs.items || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner label="Loading dashboard..." />
  if (error) return <ErrorMessage message={error} />

  const kpis = [
    { label: 'Total Documents', value: summary.total_documents?.toLocaleString(), icon: FileText, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Approved', value: summary.approved_documents?.toLocaleString(), icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-50' },
    { label: 'Review Required', value: summary.review_required?.toLocaleString(), icon: AlertTriangle, color: 'text-warning-600', bg: 'bg-warning-50' },
    { label: 'Duplicate Invoices', value: (summary.failed_documents || 0).toLocaleString(), icon: Copy, color: 'text-gray-600', bg: 'bg-gray-100' },
    { label: 'Total Invoice Value', value: `₹${(summary.total_invoice_value / 10000000).toFixed(1)}Cr`, icon: IndianRupee, color: 'text-navy-600', bg: 'bg-navy-50' },
    { label: 'Exception Rate', value: `${summary.exception_rate}%`, icon: TrendingUp, color: 'text-danger-600', bg: 'bg-danger-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Operational overview of invoice processing pipeline</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className={`inline-flex rounded-lg p-2 ${kpi.bg}`}>
                <Icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <p className="mt-3 text-xs font-medium uppercase tracking-wider text-gray-500">{kpi.label}</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Exception Breakdown</h2>
          <ExceptionChart data={summary.by_exception_type} />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Invoice Processing Trend</h2>
          <InvoiceTrendChart data={trends} />
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Recent Documents</h2>
          <Link
            to="/documents"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <DocumentTable documents={recentDocs} loading={false} />
      </div>
    </div>
  )
}
