import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import Layout from '../components/Layout'
import { AuthProvider } from '../lib/auth'

const META = { categories: ['behavioral', 'technical', 'hr'], industries: [], companies: ['Infosys', 'TCS'], roles: ['software engineer'], total: 2 }

// Route-based fetch mock. `routes` maps "METHOD /path" (or "/path") to a body or (body) => body.
export function mockFetch(routes = {}) {
  const calls = []
  const fn = vi.fn(async (url, opts = {}) => {
    const method = opts.method || 'GET'
    const path = url.split('?')[0]
    const body = opts.body ? JSON.parse(opts.body) : undefined
    calls.push({ method, url, path, body, headers: opts.headers })
    const handler =
      routes[`${method} ${path}`] ?? routes[path] ??
      (path === '/api/config' ? { google_client_id: '', ai_enabled: true } : undefined) ??
      (path === '/api/questions/meta' ? META : undefined)
    if (handler === undefined) return new Response(JSON.stringify({ detail: 'Not found' }), { status: 404 })
    const value = typeof handler === 'function' ? handler(body, url) : handler
    if (value instanceof Response) return value
    return new Response(JSON.stringify(value), { status: 200, headers: { 'Content-Type': 'application/json' } })
  })
  vi.stubGlobal('fetch', fn)
  return calls
}

export function renderPage(ui, { path = '/', route = '*' } = {}) {
  return render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path={route} element={ui} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}
