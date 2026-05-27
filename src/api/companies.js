import { apiFetch } from './client.js'

export function fetchCompanies() {
  return apiFetch('/companies/', { auth: true })
}

export function fetchCompanyDetail(id) {
  return apiFetch(`/companies/${id}/`, { auth: true })
}

export function createCompany(data) {
  return apiFetch('/companies/create/', {
    method: 'POST',
    body: JSON.stringify(data),
    auth: true,
  })
}
