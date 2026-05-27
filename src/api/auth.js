import { apiFetch } from './client.js'

export function login(email, password) {
  return apiFetch('/accounts/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function register({ username, email, password }) {
  return apiFetch('/accounts/register/', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  })
}

export function forgotPassword(email) {
  return apiFetch('/accounts/forgot-password/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function resetPassword({ uid, token, new_password, confirm_password }) {
  return apiFetch('/accounts/reset-password/', {
    method: 'POST',
    body: JSON.stringify({ uid, token, new_password, confirm_password }),
  })
}
