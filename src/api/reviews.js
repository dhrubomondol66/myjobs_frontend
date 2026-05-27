import { apiFetch } from './client.js'

export function fetchReviews() {
  return apiFetch('/reviews/', { auth: true })
}

export function createReview(data) {
  return apiFetch('/reviews/create/', {
    method: 'POST',
    body: JSON.stringify(data),
    auth: true,
  })
}

export function fetchReviewDetail(id) {
  return apiFetch(`/reviews/${id}/`, { auth: true })
}
