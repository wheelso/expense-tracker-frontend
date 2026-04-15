const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim() || '/api'
const API_BASE_URL = configuredBaseUrl.endsWith('/')
  ? configuredBaseUrl.slice(0, -1)
  : configuredBaseUrl

const request = async (path, { method = 'GET', body, token } = {}) => {
  const headers = {}

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const raw = await response.text()
  const contentType = response.headers.get('content-type') ?? ''
  const data =
    raw && contentType.includes('application/json')
      ? JSON.parse(raw)
      : raw
        ? { message: raw }
        : {}

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed')
  }

  return data
}

export const registerUser = (payload) =>
  request('/auth/register', { method: 'POST', body: payload })

export const loginUser = (payload) =>
  request('/auth/login', { method: 'POST', body: payload })

export const getExpenses = (token) => request('/expenses', { token })

export const createExpense = (payload, token) =>
  request('/expenses', { method: 'POST', body: payload, token })

export const updateExpense = (id, payload, token) =>
  request(`/expenses/${id}`, { method: 'PUT', body: payload, token })

export const deleteExpense = (id, token) =>
  request(`/expenses/${id}`, { method: 'DELETE', token })

export const getCategories = (token) => request('/categories', { token })

export const createCategory = (payload, token) =>
  request('/categories', { method: 'POST', body: payload, token })

export const updateCategory = (id, payload, token) =>
  request(`/categories/${id}`, { method: 'PUT', body: payload, token })

export const deleteCategory = (id, token) =>
  request(`/categories/${id}`, { method: 'DELETE', token })
