const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000'

function authHeaders() {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options)
  const data = await res.json().catch(() => ({ msg: 'Invalid JSON response' }))
  if (!res.ok) {
    return data
  }
  return data
}

export async function register(email, password) {
  return request('/api/auth/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
}

export async function login(email, password) {
  return request('/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
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

export default { register, login, fetchTasks, fetchTask, createTask, updateTask, deleteTask, askAI, ingestDoc }
