const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://myjobs-backend-b2y5.onrender.com'

function getAccessToken() {
  return localStorage.getItem('myjobs_access_token')
}

export async function apiFetch(path, { auth = false, ...opts } = {}) {
  const headers = { 'Content-Type': 'application/json', ...opts.headers }

  if (auth) {
    const token = getAccessToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...opts, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const err = new Error(body?.detail || res.statusText)
    err.status = res.status
    err.data = body
    throw err
  }

  if (res.status === 204) return null
  return res.json()
}
