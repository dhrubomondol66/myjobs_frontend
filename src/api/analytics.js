import { apiFetch } from './client.js'

export function fetchDashboardSummary() {
  return apiFetch('/analytics/summary/', { auth: true })
}

export function fetchSalaryList(params = {}) {
  const qs = new URLSearchParams(params).toString()
  return apiFetch(`/analytics/salary/${qs ? `?${qs}` : ''}`, { auth: true })
}

export function fetchSalaryStats(params = {}) {
  const qs = new URLSearchParams(params).toString()
  return apiFetch(`/analytics/salary/stats/${qs ? `?${qs}` : ''}`, { auth: true })
}
