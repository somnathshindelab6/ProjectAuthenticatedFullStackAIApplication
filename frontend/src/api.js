function getApiBase() {
  const configured = process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim()
  if (configured) {
    return configured.replace(/\/$/, '')
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
      return 'http://localhost:5000'
    }
  }

  return ''
}

const API_BASE = getApiBase()

function authHeaders() {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
}

async function request(path, options = {}) {
  const targetUrl = API_BASE ? `${API_BASE}${path}` : path

  try {
    const res = await fetch(targetUrl, options)
    const data = await res.json().catch(() => ({ msg: 'Invalid JSON response' }))

    if (!res.ok) {
      return { ...data, _status: res.status }
    }

    return data
  } catch (error) {
    return {
      msg: 'Unable to reach the API server. Deploy the Flask backend and set REACT_APP_API_URL to its public URL.',
      error: error.message
    }
  }
}

export async function register(email, password) {
  return request('/api/auth/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
}

export async function login(email, password) {
  return request('/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
}

export async function forgotPassword(email) {
  return request('/api/auth/forgot-password', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email }) })
}

export async function resetPassword(token, password) {
  return request('/api/auth/reset-password', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ token, password }) })
}

export async function fetchTasks() {
  return request('/api/tasks/', { headers: authHeaders() })
}

export async function fetchTask(id) {
  return request(`/api/tasks/${id}`, { headers: authHeaders() })
}

export async function createTask(payload) {
  return request('/api/tasks/', { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) })
}

export async function updateTask(id, payload) {
  return request(`/api/tasks/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) })
}

export async function deleteTask(id) {
  return request(`/api/tasks/${id}`, { method: 'DELETE', headers: authHeaders() })
}

export async function askAI(query) {
  return request('/api/ai/ask', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ query }) })
}

export async function ingestDoc(payload) {
  return request('/api/ai/ingest', { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) })
}

export default { register, login, forgotPassword, resetPassword, fetchTasks, fetchTask, createTask, updateTask, deleteTask, askAI, ingestDoc }
