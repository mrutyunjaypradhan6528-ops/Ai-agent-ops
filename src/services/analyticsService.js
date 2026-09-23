import api from './api'
import { USE_MOCKS } from '../config/apiConfig'
import { mockAnalyticsSummary, mockAnalyticsTrends } from '../mocks/mockData'

export async function getAnalyticsSummary(params = {}) {
  if (USE_MOCKS) {
    return mockAnalyticsSummary
  }
  const res = await api.get('/api/v1/analytics/summary', { params })
  return res.data
}

export async function getAnalyticsTrends(params = {}) {
  if (USE_MOCKS) {
    return mockAnalyticsTrends
  }
  const res = await api.get('/api/v1/analytics/trends', { params })
  return res.data
}

export function getExportUrl() {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  return `${base}/api/v1/exports/invoices.xlsx`
}
