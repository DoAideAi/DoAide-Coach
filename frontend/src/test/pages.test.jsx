import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { chartPoints } from '../components/ScoreChart'
import Dashboard from '../pages/Dashboard'
import Home from '../pages/Home'
import Interview, { scoreSession } from '../pages/Interview'
import Questions from '../pages/Questions'
import Resume from '../pages/Resume'
import Salary from '../pages/Salary'
import { loadSessions, saveSessions } from '../lib/storage'
import { mockFetch, renderPage } from './utils'

describe('Home & layout', () => {
  it('renders tool cards, the DoAide badge and SEO tags', async () => {
    mockFetch()
    renderPage(<Home />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/next interview/i)
    for (const name of ['AI Mock Interview', 'Resume Scorer', 'Question Bank', 'Salary Negotiator', 'Progress Dashboard']) {
      expect(screen.getByText(name)).toBeInTheDocument()
    }
    expect(screen.getByText('A DoAide Product')).toBeInTheDocument()
    await waitFor(() => expect(document.title).toMatch(/DoAide Coach/))
    expect(document.querySelector('link[rel="canonical"]').href).toBe('https://coach.doaide.com/')
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)['@type'])
    expect(ld).toEqual(expect.arrayContaining(['WebApplication', 'FAQPage']))
  })

  it('puts the three core tools up front and shows a dismissible quick-start guide', async () => {
    const user = userEvent.setup()
    mockFetch()
    const { unmount } = renderPage(<Home />)
    const tools = screen.getByRole('heading', { name: 'Start here' }).parentElement
    for (const name of ['AI Mock Interview', 'Resume Scorer', 'Question Bank']) {
      expect(within(tools).getByText(name)).toBeInTheDocument()
    }
    expect(screen.getByRole('heading', { name: /New here/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Got it' }))
    expect(screen.queryByRole('heading', { name: /New here/ })).toBeNull()
    unmount()

    renderPage(<Home />)
    expect(screen.queryByRole('heading', { name: /New here/ })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'How it works' }))
    expect(screen.getByRole('heading', { name: /New here/ })).toBeInTheDocument()
  })

  it('offers WhatsApp share-the-app links pointing at the site', () => {
    mockFetch()
    renderPage(<Home />)
    const links = screen.getAllByRole('link', { name: /WhatsApp/ })
    expect(links.length).toBeGreaterThanOrEqual(2)
    for (const a of links) expect(decodeURIComponent(a.getAttribute('href'))).toContain('https://coach.doaide.com')
  })

  it('hides Google sign-in when not configured and shows it when configured', async () => {
    mockFetch({ '/api/config': { google_client_id: 'cid.apps.googleusercontent.com', ai_enabled: true } })
    renderPage(<Home />)
    await waitFor(() => expect(document.querySelector('script[src*="accounts.google.com/gsi"]')).not.toBeNull())
  })
})

describe('Mock interview', () => {
  it('runs a full interview: start → answer → feedback → finish → saved', async () => {
    const user = userEvent.setup()
    const calls = mockFetch({
      'POST /api/interview/start': {
        session_id: 's1',
        source: 'ai',
        questions: [
          { question: 'Tell me about yourself.', category: 'hr', tip: 'Be concise' },
          { question: 'Explain OOP.', category: 'technical', tip: '' },
        ],
      },
      'POST /api/interview/feedback': {
        rating: 8, verdict: 'Great answer!', strengths: ['Clear'], improvements: ['Add numbers'], model_answer: 'Model text', source: 'ai',
      },
    })
    renderPage(<Interview />, { path: '/interview?company=TCS&industry=it' })
    expect(screen.getByLabelText(/Target company/)).toHaveValue('TCS')
    await user.type(screen.getByLabelText('Role'), 'Software Engineer')
    await user.click(screen.getByRole('button', { name: 'Start interview' }))

    expect(await screen.findByText('Tell me about yourself.')).toBeInTheDocument()
    expect(calls.find((c) => c.path === '/api/interview/start').body).toMatchObject({ company: 'TCS', role: 'Software Engineer', count: 5 })
    await user.click(screen.getByText('Show hint'))
    expect(screen.getByText('Be concise')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Your answer'), 'I am a developer at Infosys with 3 years experience.')
    await user.click(screen.getByRole('button', { name: 'Get feedback' }))
    expect(await screen.findByText('Great answer!')).toBeInTheDocument()
    expect(screen.getByText('Model text')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next question' }))
    expect(screen.getByText('Explain OOP.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Skip' }))

    expect(await screen.findByText('Interview complete!')).toBeInTheDocument()
    expect(screen.getByText('Overall 80/100')).toBeInTheDocument()
    expect(screen.getByText('Skipped')).toBeInTheDocument()
    const wa = screen.getByRole('link', { name: 'Share on WhatsApp' }).getAttribute('href')
    expect(wa).toMatch(/^https:\/\/wa\.me\/\?text=/)
    expect(decodeURIComponent(wa)).toContain('I scored 80/100')
    expect(decodeURIComponent(wa)).not.toContain('?company=')
    const saved = loadSessions()
    expect(saved).toHaveLength(1)
    expect(saved[0]).toMatchObject({ kind: 'interview', score: 80, title: 'Software Engineer @ TCS' })
    expect(saved[0].details).toMatchObject({ answered: 1, total: 2, categoryScores: { hr: 80 } })
  })

  it('shows server errors', async () => {
    mockFetch({ 'POST /api/interview/start': new Response(JSON.stringify({ detail: 'Slow down' }), { status: 429 }) })
    renderPage(<Interview />)
    fireEvent.click(screen.getByRole('button', { name: 'Start interview' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Slow down')
  })

  it('does not show or share a 0/100 score when every question is skipped', async () => {
    const user = userEvent.setup()
    mockFetch({
      'POST /api/interview/start': { session_id: 's1', source: 'ai', questions: [{ question: 'Q1?', category: 'hr', tip: '' }] },
    })
    renderPage(<Interview />)
    await user.click(screen.getByRole('button', { name: 'Start interview' }))
    await user.click(await screen.findByRole('button', { name: 'Skip' }))
    expect(await screen.findByText(/skipped every question/)).toBeInTheDocument()
    expect(screen.queryByText(/Overall/)).toBeNull()
    expect(decodeURIComponent(screen.getByRole('link', { name: 'Share on WhatsApp' }).getAttribute('href'))).not.toContain('scored')
    expect(loadSessions()).toHaveLength(0)
  })

  it('scoreSession averages answered questions only', () => {
    const r = scoreSession([
      { question: { category: 'hr' }, feedback: { rating: 6 } },
      { question: { category: 'hr' }, feedback: { rating: 8 } },
      { question: { category: 'technical' }, feedback: null },
    ])
    expect(r).toEqual({ score: 70, answered: 2, categoryScores: { hr: 70 } })
    expect(scoreSession([{ question: { category: 'hr' }, feedback: null }]).score).toBeNull()
  })
})

describe('Resume scorer', () => {
  it('validates input, then shows score, keywords and suggestions', async () => {
    const user = userEvent.setup()
    mockFetch({
      'POST /api/resume/score': {
        score: 72, keyword_score: 70, structure_score: 78, matched_keywords: ['python'], missing_keywords: ['kafka'],
        checks: { contact_email: true, section_skills: false }, summary: 'Decent match.', strengths: ['Payments'],
        suggestions: ['Add Kafka'], rewritten_summary: 'Backend engineer…', source: 'ai',
      },
    })
    renderPage(<Resume />)
    await user.click(screen.getByRole('button', { name: 'Score my resume' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/full resume/)

    fireEvent.change(screen.getByLabelText(/Your resume/), { target: { value: 'x'.repeat(60) } })
    fireEvent.change(screen.getByLabelText(/Job description/), { target: { value: 'y'.repeat(40) } })
    await user.click(screen.getByRole('button', { name: 'Score my resume' }))

    expect(await screen.findByText('Decent match.')).toBeInTheDocument()
    expect(screen.getByLabelText('Score 72 out of 100')).toBeInTheDocument()
    expect(screen.getByText('kafka')).toBeInTheDocument()
    expect(screen.getByText('Add Kafka')).toBeInTheDocument()
    expect(screen.getByText('Suggested profile summary')).toBeInTheDocument()
    expect(screen.getByLabelText('Missing')).toBeInTheDocument()
    expect(loadSessions()[0]).toMatchObject({ kind: 'resume', score: 72 })
  })
})

describe('Question bank', () => {
  it('loads questions and refetches when a filter changes', async () => {
    const user = userEvent.setup()
    const calls = mockFetch({
      '/api/questions': (_b, url) => ({
        total: 1,
        questions: [{
          id: 1, question: url.includes('category=hr') ? 'Why should we hire you?' : 'Reverse a linked list.',
          category: 'technical', industry: 'it', roles: ['software engineer'], companies: ['Amazon'], difficulty: 'medium', tip: 'Pointers!',
        }],
      }),
    })
    renderPage(<Questions />)
    expect(await screen.findByText('Reverse a linked list.')).toBeInTheDocument()
    await user.click(screen.getByText('How to answer'))
    expect(screen.getByText('Pointers!')).toBeInTheDocument()
    expect(screen.getByText('Practise similar →').getAttribute('href')).toBe('/interview?industry=it&company=Amazon&role=software+engineer')

    await user.click(screen.getByRole('tab', { name: 'HR' }))
    expect(await screen.findByText('Why should we hire you?')).toBeInTheDocument()
    expect(calls.some((c) => c.url === '/api/questions?category=hr')).toBe(true)
  })

  it('applies a category from the URL and offers WhatsApp share per question', async () => {
    const calls = mockFetch({
      '/api/questions': {
        total: 1,
        questions: [{ id: 2, question: 'Why us?', category: 'hr', industry: 'all', roles: [], companies: [], difficulty: 'easy', tip: '' }],
      },
    })
    renderPage(<Questions />, { path: '/questions?category=hr' })
    expect(await screen.findByText('Why us?')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'HR' })).toHaveAttribute('aria-selected', 'true')
    expect(calls.some((c) => c.url === '/api/questions?category=hr')).toBe(true)
    expect(decodeURIComponent(screen.getByLabelText('Share this question on WhatsApp').getAttribute('href'))).toContain('Why us?')
  })
})

describe('Salary negotiator', () => {
  it('submits numbers and renders the script', async () => {
    const user = userEvent.setup()
    const calls = mockFetch({
      'POST /api/salary/negotiate': {
        offered_hike_pct: 10, typical_hike_pct: 35, counter_offer: 13.5, walk_away: 11.5, offer_strength: 'below_market', city_tier: 1,
        source: 'ai',
        script: {
          opening: 'Thank you!', justification: ['Point A'], counter_ask: 'Could we do ₹13.5 LPA?',
          pushback_responses: [{ if_they_say: 'Max band', you_say: 'Joining bonus?' }], email_template: 'Subject: Offer', tips: ['Ask for break-up'],
        },
      },
    })
    renderPage(<Salary />)
    await user.type(screen.getByLabelText('Current CTC (LPA)'), '10')
    await user.type(screen.getByLabelText('Offered CTC (LPA)'), '11')
    await user.type(screen.getByLabelText('Years of experience'), '4')
    await user.click(screen.getByRole('button', { name: /negotiation script/ }))

    expect(await screen.findByText('Room to negotiate')).toBeInTheDocument()
    expect(screen.getByText('₹13.5 LPA')).toBeInTheDocument()
    expect(screen.getByText('Could we do ₹13.5 LPA?')).toBeInTheDocument()
    expect(screen.getByText(/Joining bonus\?/)).toBeInTheDocument()
    expect(calls.find((c) => c.path === '/api/salary/negotiate').body).toMatchObject({
      current_ctc: 10, offered_ctc: 11, experience_years: 4, location: 'Bengaluru', competing_offer: null,
    })
    expect(loadSessions()[0]).toMatchObject({ kind: 'salary', details: { counter: 13.5 } })
  })
})

describe('Dashboard', () => {
  it('shows an empty state', () => {
    mockFetch()
    renderPage(<Dashboard />)
    expect(screen.getByText('No practice sessions yet')).toBeInTheDocument()
  })

  it('shows stats, chart, session list and clears history', async () => {
    mockFetch()
    saveSessions([
      { id: 'a', kind: 'interview', score: 50, title: 'SDE @ TCS', created_at: 1_700_000_000, details: { categoryScores: { hr: 70, technical: 30 } } },
      { id: 'b', kind: 'interview', score: 70, title: 'SDE @ Infosys', created_at: 1_700_090_000, details: {} },
      { id: 'c', kind: 'salary', score: null, title: 'Offer', created_at: 1_700_100_000, details: { counter: 14 } },
    ])
    renderPage(<Dashboard />)
    expect(screen.getByText('Interview score over time')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /across 2 sessions/ })).toBeInTheDocument()
    expect(screen.getByText('Ask ₹14 LPA')).toBeInTheDocument()
    expect(screen.getByText(/answers score lowest/)).toHaveTextContent('Technical')
    expect(screen.getByRole('link', { name: 'Review Technical questions' }).getAttribute('href')).toBe('/questions?category=technical')
    const tiles = screen.getByText('Avg interview').parentElement
    expect(within(tiles).getByText('60')).toBeInTheDocument()

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    fireEvent.click(screen.getByRole('button', { name: 'Clear history' }))
    expect(await screen.findByText('No practice sessions yet')).toBeInTheDocument()
  })

  it('chartPoints maps scores to SVG coordinates', () => {
    const pts = chartPoints([{ score: 0 }, { score: 100 }], 100, 100)
    expect(pts[0]).toMatchObject({ x: 36, y: 72 })
    expect(pts[1]).toMatchObject({ x: 84, y: 16 })
    expect(chartPoints([{ score: 50 }], 100, 100)[0].x).toBe(60)
  })
})
