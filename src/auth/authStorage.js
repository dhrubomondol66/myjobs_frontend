const ACCESS_KEY = 'access'
const REFRESH_KEY = 'refresh'

export function readAuthenticated() {
  return Boolean(localStorage.getItem(ACCESS_KEY))
}

export function setAuthTokens({ access, refresh }) {
  if (access) localStorage.setItem(ACCESS_KEY, access)
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}
