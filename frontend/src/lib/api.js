const TOKEN_KEY = 'coach.token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable (private mode); sign-in just won't persist */
  }
}

function errorMessage(data, status) {
  if (typeof data?.detail === 'string') return data.detail
  if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
    return data.detail[0].msg.replace(/^Value error, /, '')
  }
  if (status === 429) return 'Too many requests. Please wait a few minutes.'
  return 'Something went wrong. Please try again.'
}

// AI calls can take a while; past this, show an error the user can retry instead of a spinner forever.
export const TIMEOUT_MS = 45_000

export async function api(path, { method = 'GET', body, auth = false, timeout = TIMEOUT_MS } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  let res
  try {
    res = await fetch(path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
  } catch (e) {
    const err = new Error(
      e?.name === 'AbortError'
        ? 'This is taking too long. Please try again.'
        : 'Could not reach the server. Check your connection.',
    )
    err.status = e?.name === 'AbortError' ? 408 : 0
    throw err
  } finally {
    clearTimeout(timer)
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(errorMessage(data, res.status))
    err.status = res.status
    throw err
  }
  return data
}
