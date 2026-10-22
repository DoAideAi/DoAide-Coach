import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Home from '../pages/Home'
import { getToken, setToken } from '../lib/api'
import { loadSessions, saveSessions } from '../lib/storage'
import { mockFetch, renderPage } from './utils'

function installGsi() {
  const gsi = { initialize: vi.fn(), renderButton: vi.fn(), disableAutoSelect: vi.fn() }
  window.google = { accounts: { id: gsi } }
  return gsi
}

describe('Google sign-in', () => {
  it('signs in with a Google credential, syncs local sessions, and signs out', async () => {
    const gsi = installGsi()
    saveSessions([{ id: 'local', kind: 'resume', score: 40, created_at: 2 }])
    const calls = mockFetch({
      '/api/config': { google_client_id: 'cid.apps.googleusercontent.com', ai_enabled: true },
      'POST /api/auth/google': { token: 'tok-1', user: { id: 'g1', email: 'a@b.in', name: 'A', picture: 'https://pic' } },
      'POST /api/sessions/sync': (body) => ({ sessions: [...body.sessions, { id: 'remote', kind: 'interview', score: 70, created_at: 1 }] }),
    })
    renderPage(<Home />)
    await waitFor(() => expect(gsi.initialize).toHaveBeenCalled())
    expect(gsi.initialize.mock.calls[0][0].client_id).toBe('cid.apps.googleusercontent.com')

    await act(() => gsi.initialize.mock.calls[0][0].callback({ credential: 'google-jwt' }))
    expect(getToken()).toBe('tok-1')
    expect(calls.find((c) => c.path === '/api/auth/google').body).toEqual({ credential: 'google-jwt' })
    const sync = calls.find((c) => c.path === '/api/sessions/sync')
    expect(sync.headers.Authorization).toBe('Bearer tok-1')
    expect(loadSessions().map((s) => s.id)).toEqual(['remote', 'local'])

    fireEvent.click(await screen.findByRole('button', { name: 'Sign out' }))
    expect(getToken()).toBe('')
    expect(gsi.disableAutoSelect).toHaveBeenCalled()
    delete window.google
  })

  it('restores a saved session on load and drops an expired token', async () => {
    setToken('old')
    mockFetch({ '/api/auth/me': new Response('{}', { status: 401 }) })
    renderPage(<Home />)
    await waitFor(() => expect(getToken()).toBe(''))

    setToken('good')
    mockFetch({
      '/api/auth/me': { user: { id: 'g1', email: 'a@b.in', picture: '' } },
      'POST /api/sessions/sync': { sessions: [] },
    })
    renderPage(<Home />)
    expect((await screen.findAllByRole('button', { name: 'Sign out' })).length).toBeGreaterThan(0)
  })
})
