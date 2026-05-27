import { apiFetch } from './client.js'

export function fetchMyProfile() {
  return apiFetch('/myprofile/me/', { auth: true })
}

export function updateMyProfile(data) {
  return apiFetch('/myprofile/update/', {
    method: 'PUT',
    body: JSON.stringify(data),
    auth: true,
  })
}
