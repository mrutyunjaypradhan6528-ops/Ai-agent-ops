import api from './api'
import { USE_MOCKS } from '../config/apiConfig'
import { mockIngestionJob, mockIngestionStats } from '../mocks/mockData'

export async function startBulkIngestion() {
  if (USE_MOCKS) {
    return { job_id: 'mock-job-001', status: 'QUEUED' }
  }
  const res = await api.post('/api/v1/ingestion/bulk', { recursive: true })
  return res.data
}

export async function getIngestionJob(jobId) {
  if (USE_MOCKS) {
    return mockIngestionJob(jobId)
  }
  const res = await api.get(`/api/v1/ingestion/jobs/${jobId}`)
  return res.data
}

export async function getIngestionStats() {
  if (USE_MOCKS) {
    return mockIngestionStats
  }
  const res = await api.get('/api/v1/ingestion/stats')
  return res.data
}

export async function reindexDocument(documentId) {
  if (USE_MOCKS) {
    return { message: `Document ${documentId} reindexing started` }
  }
  const res = await api.post(`/api/v1/ingestion/reindex/${documentId}`)
  return res.data
}
