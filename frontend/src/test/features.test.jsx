import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ErrorBoundary from '../components/ErrorBoundary'
import { api } from '../lib/api'
import { clearDraft, loadDraft, saveDraft } from '../lib/storage'
import Interview from '../pages/Interview'
import Intro from '../pages/Intro'
import { mockFetch, renderPage } from './utils'

const QUESTIONS = [
  { question: 'Tell me about yourself.', category: 'hr', tip: 'Present, past, future.' },
  { question: 'Why Infosys?', category: 'hr', tip: '' },
]
const FEEDBACK = { rating: 7, verdict: 'Good start', strengths: ['Clear'], improvements: ['Add numbers'], model_answer: 'Model', source: 'fallback' }

describe('api errors', () => {
  it('reports a timeout instead of spinning forever', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(Object.assign(new Error('aborted'), { name: 'AbortError' })))
    const err = await api('/api/health').catch((e) => e)
    expect(err.status).toBe(408)
    expect(err.message).toMatch(/taking too long/)
  })
  it('reports a dropped connection', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const err = await api('/api/health').catch((e) => e)
    expect(err.status).toBe(0)
    expect(err.message).toMatch(/Check your connection/)
  })
  it('passes an abort signal to fetch', async () => {
    const calls = mockFetch({ '/api/health': { status: 'ok' } })
    await api('/api/health')
    expect(calls.length).toBe(1)
    expect(vi.mocked(fetch).mock.calls[0][1].signal).toBeInstanceOf(AbortSignal)
  })
})

describe('ErrorBoundary', () => {
  it('shows a reload screen on a crash', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const Boom = () => {
      throw new Error('boom')
    }
    render(<ErrorBoundary><Boom /></ErrorBoundary>)
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
  })
  it('explains a stale chunk after a deploy', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const Boom = () => {
      throw new TypeError('Failed to fetch dynamically imported module: /assets/Resume-abc.js')
    }
    render(<ErrorBoundary><Boom /></ErrorBoundary>)
    expect(screen.getByRole('alert')).toHaveTextContent('A new version is available')
  })
})

describe('interview draft', () => {
  it('round-trips and ignores junk', () => {
    expect(loadDraft()).toBeNull()
    saveDraft({ setup: { role: 'SE' }, results: [{ question: QUESTIONS[0], feedback: null }], index: 0 })
    expect(loadDraft().setup.role).toBe('SE')
    clearDraft()
    expect(loadDraft()).toBeNull()
    localStorage.setItem('coach.interview.draft', '{bad json')
    expect(loadDraft()).toBeNull()
  })

  it('saves progress and offers to resume after a reload', async () => {
    const user = userEvent.setup()
    mockFetch({
      'POST /api/interview/start': { session_id: 's', questions: QUESTIONS, source: 'fallback' },
      'POST /api/interview/feedback': FEEDBACK,
    })
    const first = renderPage(<Interview />, { path: '/interview' })
    await user.type(screen.getByLabelText('Role'), 'Software Engineer')
    await user.click(screen.getByRole('button', { name: 'Start interview' }))
    await user.type(await screen.findByLabelText('Your answer'), 'I am a CS graduate')
    await user.click(screen.getByRole('button', { name: 'Get feedback' }))
    await screen.findByText('Good start')
    await user.click(screen.getByRole('button', { name: 'Next question' }))
    await user.type(screen.getByLabelText('Your answer'), 'Half typed')
    expect(loadDraft()).toMatchObject({ index: 1, answer: 'Half typed' })
    first.unmount()

    renderPage(<Interview />, { path: '/interview' })
    expect(screen.getByText(/Unfinished interview:/).closest('p')).toHaveTextContent('Software Engineer · 1 of 2 answered')
    await user.click(screen.getByRole('button', { name: 'Resume' }))
    expect(screen.getByRole('heading', { name: 'Why Infosys?' })).toBeInTheDocument()
    expect(screen.getByLabelText('Your answer')).toHaveValue('Half typed')

    await user.click(screen.getByRole('button', { name: 'Skip' }))
    expect(screen.getByRole('heading', { name: 'Interview complete!' })).toBeInTheDocument()
    expect(loadDraft()).toBeNull()
  })

  it('clears the draft when discarded', async () => {
    const user = userEvent.setup()
    saveDraft({ setup: { role: 'SE', level: 'junior' }, results: QUESTIONS.map((q) => ({ question: q, answer: '', feedback: null })), index: 1, answer: '' })
    mockFetch()
    renderPage(<Interview />, { path: '/interview' })
    await user.click(screen.getByRole('button', { name: 'Discard' }))
    expect(loadDraft()).toBeNull()
    expect(screen.queryByText(/Unfinished interview/)).toBeNull()
  })
})

describe('"Tell me about yourself" writer', () => {
  it('works without login, sends only the relevant fields and shows the answer', async () => {
    const user = userEvent.setup()
    const calls = mockFetch({
      'POST /api/intro/generate': { intro: 'I am Priya, a final-year student.', tips: ['Add a number'], source: 'ai', word_count: 7, speaking_seconds: 3 },
    })
    renderPage(<Intro />, { path: '/tell-me-about-yourself' })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('"Tell me about yourself" generator')
    await waitFor(() => expect(document.title).toMatch(/Tell Me About Yourself/))
    expect(screen.queryByLabelText('Current job title')).toBeNull()

    await user.type(screen.getByLabelText('Your name'), 'Priya')
    await user.type(screen.getByLabelText('Role you are applying for'), 'Software Engineer')
    await user.type(screen.getByLabelText('Company (optional)'), 'Infosys')
    await user.click(screen.getByRole('button', { name: 'Write my answer' }))

    expect(await screen.findByTestId('intro-text')).toHaveTextContent('I am Priya, a final-year student.')
    expect(screen.getByTestId('intro-stats')).toHaveTextContent('7 words · about 3 seconds')
    expect(screen.getByText('Add a number')).toBeInTheDocument()
    const post = calls.find((c) => c.path === '/api/intro/generate')
    expect(post.body).toMatchObject({ name: 'Priya', target_role: 'Software Engineer', level: 'fresher', experience_years: 0 })
    expect(screen.getByRole('link', { name: /Practise the rest/ })).toHaveAttribute('href', '/interview?role=Software+Engineer&company=Infosys')
  })

  it('asks for experience details when not a fresher', async () => {
    const user = userEvent.setup()
    mockFetch()
    renderPage(<Intro />, { path: '/tell-me-about-yourself' })
    await user.selectOptions(screen.getByLabelText('Experience'), 'mid')
    expect(screen.getByLabelText('Current job title')).toBeInTheDocument()
    expect(screen.getByLabelText('Years')).toBeInTheDocument()
  })

  it('validates the role before calling the API', async () => {
    const user = userEvent.setup()
    const calls = mockFetch()
    renderPage(<Intro />, { path: '/tell-me-about-yourself' })
    await user.click(screen.getByRole('button', { name: 'Write my answer' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Enter the role you are applying for.')
    expect(calls.some((c) => c.path === '/api/intro/generate')).toBe(false)
  })

  it('shows server errors', async () => {
    const user = userEvent.setup()
    mockFetch({ 'POST /api/intro/generate': new Response(JSON.stringify({ detail: 'Slow down' }), { status: 429 }) })
    renderPage(<Intro />, { path: '/tell-me-about-yourself' })
    await user.type(screen.getByLabelText('Role you are applying for'), 'Analyst')
    await user.click(screen.getByRole('button', { name: 'Write my answer' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Slow down')
  })
})
