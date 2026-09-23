import api from './api'
import { USE_MOCKS } from '../config/apiConfig'
import { mockChatResponse } from '../mocks/mockData'

export async function sendChatQuery(question) {
  if (USE_MOCKS) {
    return mockChatResponse(question)
  }
  const res = await api.post('/api/v1/chat/query', { question })
  return res.data
}
