// Practice history lives in this browser. Signed-in users also sync it to their account.
const KEY = 'coach.sessions.v1'

export function loadSessions() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveSessions(sessions) {
  try {
    localStorage.setItem(KEY, JSON.stringify(sessions))
  } catch {
    /* quota or private mode */
  }
  window.dispatchEvent(new Event('coach:sessions'))
}

export function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function addSession(session) {
  const full = { id: newId(), created_at: Date.now() / 1000, details: {}, title: '', ...session }
  saveSessions([...loadSessions(), full])
  return full
}

export function mergeSessions(local, remote) {
  const byId = new Map()
  for (const s of [...remote, ...local]) byId.set(s.id, s)
  return [...byId.values()].sort((a, b) => a.created_at - b.created_at)
}

export function clearSessions() {
  saveSessions([])
}
