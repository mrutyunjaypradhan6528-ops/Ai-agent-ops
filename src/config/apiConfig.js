const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// The backend is not included yet; a fresh checkout should run in demo mode.
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'

export { API_BASE_URL, USE_MOCKS }
