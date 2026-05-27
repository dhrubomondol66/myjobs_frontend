const AUTH_KEY = 'myjobs_authenticated'

export function readAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === 'true'
}

export function writeAuthenticated(value) {
  if (value) {
    localStorage.setItem(AUTH_KEY, 'true')
  } else {
    localStorage.removeItem(AUTH_KEY)
  }
}
