import { describe, expect, it, vi } from 'vitest'
import { api, getToken, setToken } from '../lib/api'
import { summarize, weakestCategory } from '../lib/stats'
import { addSession, clearSessions, loadSessions, mergeSessions } from '../lib/storage'
import { mockFetch } from './utils'

describe('storage', () => {
  it('adds, loads and clears sessions and fires an event', () => {
    const listener = vi.fn()
    window.addEventListener('coach:sessions', listener)
    const s = addSession({ kind: 'resume', score: 60 })
    expect(s.id).toBeTruthy()
    expect(loadSessions()).toHaveLength(1)
    expect(listener).toHaveBeenCalled()
    clearSessions()
    expect(loadSessions()).toEqual([])
    window.removeEventListener('coach:sessions', listener)
  })

  it('survives corrupt storage', () => {
    localStorage.setItem('coach.sessions.v1', '{not json')
    expect(loadSessions()).toEqual([])
    localStorage.setItem('coach.sessions.v1', '{"a":1}')
    expect(loadSessions()).toEqual([])
  })

  it('merges by id, local wins, sorted by time', () => {
    const merged = mergeSessions(
      [{ id: 'a', created_at: 3, score: 90 }],
      [{ id: 'a', created_at: 3, score: 10 }, { id: 'b', created_at: 1 }],
    )
    expect(merged.map((s) => s.id)).toEqual(['b', 'a'])
    expect(merged[1].score).toBe(90)
  })
})

describe('stats', () => {
  const mk = (score, i, cats) => ({ id: String(i), kind: 'interview', score, created_at: 1_700_000_000 + i * 86400, details: { answered: 2, categoryScores: cats } })

  it('summarizes sessions', () => {
    const sessions = [mk(40, 0), mk(50, 1), mk(60, 2), mk(70, 3), mk(80, 4), mk(90, 5), { id: 'r', kind: 'resume', score: 95, created_at: 1_700_000_000 }]
    const s = summarize(sessions)
    expect(s.total).toBe(7)
    expect(s.interviews).toBe(6)
    expect(s.questionsAnswered).toBe(12)
    expect(s.averageInterview).toBe(65)
    expect(s.best).toBe(95)
    expect(s.trend).toBe(30)
    expect(s.activeDays).toBe(6)
  })

  it('handles empty input', () => {
    expect(summarize([])).toMatchObject({ total: 0, averageInterview: null, best: null, trend: null })
  })

  it('finds the weakest category only when there are several', () => {
    expect(weakestCategory([mk(50, 0, { hr: 80, technical: 40 }), mk(50, 1, { technical: 60 })])).toBe('technical')
    expect(weakestCategory([mk(50, 0, { hr: 80 })])).toBeNull()
  })
})

describe('api', () => {
  it('sends JSON and auth header when asked', async () => {
    setToken('tok')
    const calls = mockFetch({ 'POST /api/x': { ok: 1 } })
    expect(await api('/api/x', { method: 'POST', body: { a: 1 }, auth: true })).toEqual({ ok: 1 })
    expect(calls[0].headers).toEqual({ 'Content-Type': 'application/json', Authorization: 'Bearer tok' })
    setToken('')
    expect(getToken()).toBe('')
  })

  it('surfaces FastAPI validation messages', async () => {
    mockFetch({ '/api/v': new Response(JSON.stringify({ detail: [{ msg: 'Value error, Use LPA' }] }), { status: 422 }) })
    await expect(api('/api/v')).rejects.toThrow('Use LPA')
  })

  it('handles rate limits and network failures', async () => {
    mockFetch({ '/api/r': new Response('', { status: 429 }) })
    await expect(api('/api/r')).rejects.toMatchObject({ status: 429, message: expect.stringMatching(/Too many/) })
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    await expect(api('/api/z')).rejects.toThrow(/Could not reach/)
  })
})
