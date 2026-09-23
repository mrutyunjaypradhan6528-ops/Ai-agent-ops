import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { FileText, CheckCircle, AlertTriangle, IndianRupee, Download, TrendingUp } from 'lucide-react'
import { getAnalyticsSummary, getAnalyticsTrends, getExportUrl } from '../services/analyticsService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

const pieColors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState(null)
  const [dateFilter, setDateFilter] = useState('')
  const [hospitalFilter, setHospitalFilter] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [s, t] = await Promise.all([
          getAnalyticsSummary({ date: dateFilter, hospital: hospitalFilter }),
          getAnalyticsTrends({ date: dateFilter, hospital: hospitalFilter }),
        ])
        setSummary(s)
        setTrends(t)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [dateFilter, hospitalFilter])

  if (loading) return <LoadingSpinner label="Loading analytics..." />
  if (error) return <ErrorMessage message={error} />

  const kpis = [
    { label: 'Total Documents', value: summary.total_documents?.toLocaleString(), icon: FileText, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Approved', value: summary.approved_documents?.toLocaleString(), icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-50' },
    { label: 'Review Required', value: summary.review_required?.toLocaleString(), icon: AlertTriangle, color: 'text-warning-600', bg: 'bg-warning-50' },
    { label: 'Total Value', value: `₹${(summary.total_invoice_value / 10000000).toFixed(1)}Cr`, icon: IndianRupee, color: 'text-navy-600', bg: 'bg-navy-50' },
    { label: 'Exception Rate', value: `${summary.exception_rate}%`, icon: TrendingUp, color: 'text-danger-600', bg: 'bg-danger-50' },
    { label: 'Failed', value: summary.failed_documents?.toLocaleString(), icon: AlertTriangle, color: 'text-danger-600', bg: 'bg-danger-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Operational analytics and reporting</p>
        </div>
        <a
          href={getExportUrl()}
          className="inline-flex items-center gap-2 rounded-md bg-success-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-success-400"
        >
          <Download className="h-4 w-4" />
          Export Excel
        </a>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
        <select
          value={hospitalFilter}
          onChange={(e) => setHospitalFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="">All Hospitals</option>
          {(summary.by_hospital || []).map((h) => (
            <option key={h.hospital} value={h.hospital}>{h.hospital}</option>
          ))}
        </select>
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
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Invoice Value Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 10000000).toFixed(0)}Cr`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="total_value" name="Total Value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Hospital Comparison</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.by_hospital} layout="vertical" margin={{ top: 10, right: 10, left: 80, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="hospital" tick={{ fontSize: 10 }} width={80} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                <Bar dataKey="count" name="Documents" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Insurer Split</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary.by_insurer}
                  dataKey="count"
                  nameKey="insurer"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ insurer, count }) => `${insurer}: ${count}`}
                  labelLine={false}
                >
                  {summary.by_insurer.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Exception Breakdown</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.by_exception_type} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="type" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                <Bar dataKey="count" name="Exceptions" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Processing Status Distribution</h2>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.by_status} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="status" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Bar dataKey="count" name="Documents" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
