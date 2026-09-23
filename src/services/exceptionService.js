import api from './api'
import { USE_MOCKS } from '../config/apiConfig'
import { mockExceptions } from '../mocks/mockData'

export async function getExceptions(params = {}) {
  if (USE_MOCKS) {
    let results = [...mockExceptions]
    if (params.status) results = results.filter((e) => e.status === params.status)
    if (params.type) results = results.filter((e) => e.type === params.type)
    const page = params.page || 1
    const pageSize = params.page_size || 20
    const total = results.length
    const start = (page - 1) * pageSize
    const items = results.slice(start, start + pageSize)
    return { items, total, page, page_size: pageSize }
  }
  const res = await api.get('/api/v1/exceptions', { params })
  return res.data
}

export async function reviewException(exceptionId, payload) {
  if (USE_MOCKS) {
    return { message: `Exception ${exceptionId} reviewed`, action: payload.action }
  }
  const res = await api.patch(`/api/v1/exceptions/${exceptionId}/review`, payload)
  return res.data
}
