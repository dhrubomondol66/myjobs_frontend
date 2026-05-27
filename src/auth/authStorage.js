const ACCESS_KEY = 'myjobs_access_token'
const REFRESH_KEY = 'myjobs_refresh_token'
const USER_KEY = 'myjobs_user'

export function readAuthenticated() {
  return !!localStorage.getItem(ACCESS_KEY)
}

export function writeAuthenticated(value) {
  if (!value) {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
  }
}

export function saveTokens({ access, refresh }) {
  localStorage.setItem(ACCESS_KEY, access)
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}
