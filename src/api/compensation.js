import { apiFetch } from './client.js'

export function fetchCompensationList() {
  return apiFetch('/compensation/', { auth: true })
}

export function createCompensation(data) {
  return apiFetch('/compensation/create/', {
    method: 'POST',
    body: JSON.stringify(data),
    auth: true,
  })
}

export function fetchCompensationDetail(id) {
  return apiFetch(`/compensation/${id}/`, { auth: true })
}
