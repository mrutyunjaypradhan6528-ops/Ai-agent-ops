import api from './api'
import { USE_MOCKS } from '../config/apiConfig'
import {
  mockDocuments,
  mockDocumentDetail,
  mockUploadResult,
} from '../mocks/mockData'

export async function getDocuments(params = {}) {
  if (USE_MOCKS) {
    let results = [...mockDocuments]
    if (params.search) {
      const q = params.search.toLowerCase()
      results = results.filter(
        (d) =>
          d.file_name.toLowerCase().includes(q) ||
          d.invoice_no?.toLowerCase().includes(q) ||
          d.hospital_name?.toLowerCase().includes(q) ||
          d.patient_name?.toLowerCase().includes(q)
      )
    }
    if (params.status) results = results.filter((d) => d.status === params.status)
    if (params.hospital)
      results = results.filter((d) => d.hospital_name === params.hospital)
    if (params.exception_type)
      results = results.filter((d) => d.exception_count > 0)
    const page = params.page || 1
    const pageSize = params.page_size || 20
    const total = results.length
    const start = (page - 1) * pageSize
    const items = results.slice(start, start + pageSize)
    return { items, total, page, page_size: pageSize }
  }
  const res = await api.get('/api/v1/documents', { params })
  return res.data
}

export async function getDocumentById(id) {
  if (USE_MOCKS) {
    const doc = mockDocumentDetail[id] || mockDocumentDetail[1]
    return doc
  }
  const res = await api.get(`/api/v1/documents/${id}`)
  return res.data
}

export async function uploadDocuments(formData, onProgress) {
  if (USE_MOCKS) {
    return mockUploadResult
  }
  const res = await api.post('/api/v1/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  })
  return res.data
}

export async function reprocessDocument(id) {
  if (USE_MOCKS) {
    return { message: `Document ${id} reprocessing started` }
  }
  const res = await api.post(`/api/v1/documents/${id}/reprocess`)
  return res.data
}

export async function sendToReview(id) {
  if (USE_MOCKS) {
    return { message: `Document ${id} sent to review` }
  }
  const res = await api.patch(`/api/v1/documents/${id}/review`)
  return res.data
}

export async function checkHealth() {
  if (USE_MOCKS) {
    return { status: 'healthy' }
  }
  const res = await api.get('/api/v1/health')
  return res.data
}
