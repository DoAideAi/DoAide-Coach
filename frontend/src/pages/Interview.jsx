import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Seo, { faq, webApp } from '../components/Seo'
import {
  BackLink, BulletList, Button, Card, ErrorBox, FaqSection, Field, INDUSTRIES, PageHeader,
  SavedNote, ScoreRing, ShareBar, Spinner, inputClass,
} from '../components/ui'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { addSession, clearDraft, loadDraft, saveDraft } from '../lib/storage'

const LEVELS = [
  ['fresher', 'Fresher / campus'],
  ['junior', '1-3 years'],
  ['mid', '3-8 years'],
  ['senior', '8+ years'],
]

// Real interviews expect about 2 minutes per answer; past that the chip turns amber.
export const TARGET_SECONDS = 120

export function formatClock(total) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function AnswerTimer({ seconds }) {
  const over = seconds > TARGET_SECONDS
  return (
    <span
      data-testid="answer-timer"
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ${
        over ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-ink-soft'
      }`}
      title={over ? 'Real interviews expect about 2 minutes per answer' : 'Time on this question'}
    >
      ⏱ {formatClock(seconds)}{over ? ' · wrap up' : ''}
    </span>
  )
}

const FAQ = [
  ['How is my answer rated?', 'Each answer gets a score out of 10 based on relevance, structure (STAR for behavioral questions), specifics and measurable impact, along with improvements and a model answer.'],
  ['Can I practise for a specific company?', 'Yes. Enter a company like TCS, Infosys, Amazon or HDFC Bank and the questions reflect its known interview style.'],
  ['Do I need to speak?', 'No. You type your answers, which makes it easy to practise anywhere, even on a phone.'],
]

function Setup({ onStart, loading, initial }) {
  const [form, setForm] = useState({
    role: '', company: '', industry: 'it', level: 'junior', count: 5, ...initial,
  })
  const [meta, setMeta] = useState({ companies: [], roles: [] })
  useEffect(() => {
    api('/api/questions/meta').then(setMeta).catch(() => {})
  }, [])
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <Card>
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          onStart({ ...form, count: Number(form.count) })
        }}
      >
        <Field label="Role" id="role">
          <input id="role" list="roles" className={inputClass} placeholder="e.g. Software Engineer" value={form.role} onChange={set('role')} maxLength={80} />
          <datalist id="roles">{meta.roles.map((r) => <option key={r} value={r} />)}</datalist>
        </Field>
        <Field label="Target company (optional)" id="company">
          <input id="company" list="companies" className={inputClass} placeholder="e.g. Infosys" value={form.company} onChange={set('company')} maxLength={80} />
          <datalist id="companies">{meta.companies.map((c) => <option key={c} value={c} />)}</datalist>
        </Field>
        <Field label="Industry" id="industry">
          <select id="industry" className={inputClass} value={form.industry} onChange={set('industry')}>
            {INDUSTRIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Field>
        <Field label="Experience" id="level">
          <select id="level" className={inputClass} value={form.level} onChange={set('level')}>
            {LEVELS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Field>
        <Field label="Number of questions" id="count">
          <select id="count" className={inputClass} value={form.count} onChange={set('count')}>
            {[3, 5, 8, 10].map((n) => <option key={n} value={n}>{n} questions</option>)}
          </select>
        </Field>
        <div className="flex items-end">
          <Button type="submit" disabled={loading} className="w-full py-3">
            {loading ? <Spinner label="Preparing your interview…" /> : 'Start interview'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

function Feedback({ fb }) {
  return (
    <div className="mt-4 space-y-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
      <div className="flex items-center gap-4">
        <ScoreRing score={fb.rating} max={10} size={80} caption={`${fb.rating}/10`} />
        <p className="font-semibold text-ink">{fb.verdict}</p>
      </div>
      {fb.strengths.length > 0 && (
        <div>
          <h3 className="mb-1 text-sm font-bold text-green-800">What worked</h3>
          <BulletList items={fb.strengths} tone="green" />
        </div>
      )}
      {fb.improvements.length > 0 && (
        <div>
          <h3 className="mb-1 text-sm font-bold text-orange-800">How to improve</h3>
          <BulletList items={fb.improvements} tone="orange" />
        </div>
      )}
      <details open>
        <summary className="cursor-pointer text-sm font-bold text-brand-800">Model answer</summary>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink">{fb.model_answer}</p>
      </details>
    </div>
  )
}

function Summary({ setup, results, onRestart }) {
  const { score, answered } = scoreSession(results)
  const title = [setup.role || 'Mock interview', setup.company].filter(Boolean).join(' @ ')
  return (
    <div className="space-y-4">
      <Card className="text-center">
        <h2 className="text-xl font-bold">Interview complete!</h2>
        <p className="mt-1 text-ink-soft">{title}</p>
        {score === null ? (
          <p className="my-4 text-sm text-ink-soft">
            You skipped every question, so there is no score yet. Answer at least one question to get feedback.
          </p>
        ) : (
          <>
            <div className="my-4 flex justify-center">
              <ScoreRing score={score} caption={`Overall ${score}/100`} size={128} />
            </div>
            <p className="text-sm text-ink-soft">
              You answered {answered} of {results.length} questions.
              {score >= 75 ? ' Excellent work. You are interview-ready!' : ' Every session makes you sharper. Keep practising!'}
            </p>
          </>
        )}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button onClick={onRestart}>Practise again</Button>
          <Link to="/dashboard" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:border-brand-400">
            View progress
          </Link>
        </div>
        <div className="mt-4 flex justify-center">
          <ShareBar
            text={
              score === null
                ? 'Practising mock interviews for free on DoAide Coach. Try it:'
                : `I scored ${score}/100 in a ${title} mock interview on DoAide Coach! Can you beat it?`
            }
          />
        </div>
        {score !== null && <div className="mt-3"><SavedNote /></div>}
      </Card>
      <Card className="flex flex-col gap-3 border-brand-200 bg-brand-50/50 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-ink">Next step: get your resume past the ATS</h3>
          <p className="mt-0.5 text-sm text-ink-soft">
            Score your resume against a {setup.role ? `${setup.role} ` : ''}job description — match score, missing keywords and fixes.
          </p>
        </div>
        <Link
          to={`/resume${setup.role ? `?role=${encodeURIComponent(setup.role)}` : ''}`}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Score my resume →
        </Link>
      </Card>
      {results.map((r, i) => (
        <Card key={i}>
          <p className="text-xs font-semibold uppercase text-ink-muted">Q{i + 1} · {r.question.category}</p>
          <p className="mt-1 font-semibold">{r.question.question}</p>
          {r.feedback ? (
            <p className="mt-2 text-sm text-ink-soft">
              Rating: <strong className="text-ink">{r.feedback.rating}/10</strong>
              {r.seconds ? <span className="text-ink-muted"> · answered in {formatClock(r.seconds)}</span> : null}. {r.feedback.verdict}
            </p>
          ) : (
            <p className="mt-2 text-sm text-ink-muted">Skipped</p>
          )}
        </Card>
      ))}
    </div>
  )
}

export function scoreSession(results) {
  const answered = results.filter((r) => r.feedback)
  const byCat = {}
  for (const r of answered) {
    const c = r.question.category
    byCat[c] = byCat[c] || []
    byCat[c].push(r.feedback.rating * 10)
  }
  const categoryScores = Object.fromEntries(
    Object.entries(byCat).map(([c, v]) => [c, Math.round(v.reduce((a, b) => a + b, 0) / v.length)]),
  )
  const score = answered.length
    ? Math.round((answered.reduce((t, r) => t + r.feedback.rating, 0) / answered.length) * 10)
    : null
  return { score, answered: answered.length, categoryScores }
}

export default function Interview() {
  const [params] = useSearchParams()
  const { user, sync } = useAuth()
  const [setup, setSetup] = useState(null)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const [draft, setDraft] = useState(() => loadDraft())
  const [seconds, setSeconds] = useState(0)
  const topRef = useRef(null)

  const currentForTimer = results[index]
  const timerRunning = Boolean(setup && !done && currentForTimer && !currentForTimer.feedback)

  // Per-question clock: starts when a question appears, stops at feedback.
  useEffect(() => {
    if (!timerRunning) return undefined
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [timerRunning, index])

  useEffect(() => {
    setSeconds(0)
  }, [index, setup])

  // Keep the interview in progress (including a half-typed answer) in this browser.
  useEffect(() => {
    if (setup && !done) saveDraft({ setup, results, index, answer, savedAt: Date.now() })
  }, [setup, results, index, answer, done])

  const resume = () => {
    setSetup(draft.setup)
    setQuestions(draft.results.map((r) => r.question))
    setResults(draft.results)
    setIndex(Math.min(draft.index || 0, draft.results.length - 1))
    setAnswer(draft.answer || '')
    setDone(false)
    setDraft(null)
  }

  const discard = () => {
    clearDraft()
    setDraft(null)
  }

  // On phones the next question/summary would otherwise appear above the fold after a long feedback card.
  useEffect(() => {
    if (setup) topRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }, [index, done, setup])

  const initial = Object.fromEntries(
    ['role', 'company', 'industry'].filter((k) => params.get(k)).map((k) => [k, params.get(k)]),
  )

  const start = async (form) => {
    setLoading(true)
    setError('')
    try {
      const data = await api('/api/interview/start', { method: 'POST', body: form })
      setSetup(form)
      setQuestions(data.questions)
      setResults(data.questions.map((q) => ({ question: q, answer: '', feedback: null })))
      setIndex(0)
      setDone(false)
      setDraft(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const current = results[index]

  const submit = async (e) => {
    e.preventDefault()
    if (!answer.trim()) return
    setLoading(true)
    setError('')
    try {
      const fb = await api('/api/interview/feedback', {
        method: 'POST',
        body: {
          question: current.question.question,
          answer,
          role: setup.role,
          company: setup.company,
          category: current.question.category,
          level: setup.level,
        },
      })
      setResults(results.map((r, i) => (i === index ? { ...r, answer, feedback: fb, seconds } : r)))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const finish = (final) => {
    const { score, answered, categoryScores } = scoreSession(final)
    if (answered > 0) {
      addSession({
        kind: 'interview',
        score,
        title: [setup.role || 'Mock interview', setup.company].filter(Boolean).join(' @ '),
        details: { answered, total: final.length, categoryScores, industry: setup.industry, level: setup.level },
      })
      if (user) sync()
    }
    clearDraft()
    setDone(true)
  }

  const next = () => {
    setAnswer('')
    setShowTip(false)
    if (index + 1 >= questions.length) finish(results)
    else setIndex(index + 1)
  }

  const reset = () => {
    clearDraft()
    setSetup(null)
    setQuestions([])
    setResults([])
    setDone(false)
    setAnswer('')
  }

  return (
    <>
      <Seo
        title="AI Mock Interview Practice for Indian Jobs | DoAide Coach"
        description="Practise role and company-specific mock interviews with AI. Get instant ratings, improvement tips and model answers for TCS, Infosys, Amazon, HDFC and more."
        path="/interview"
        jsonLd={[webApp('AI Mock Interview', '/interview', 'AI mock interviews with real-time feedback.'), faq(FAQ)]}
      />
      <BackLink />
      <PageHeader title="AI Mock Interview" subtitle="Answer one question at a time. Get honest feedback after each answer." />
      <div ref={topRef} className="scroll-mt-20" />
      <ErrorBox message={error} />

      {!setup && draft && (
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink">
            <strong>Unfinished interview:</strong>{' '}
            {[draft.setup.role || 'Mock interview', draft.setup.company].filter(Boolean).join(' @ ')} ·{' '}
            {draft.results.filter((r) => r.feedback).length} of {draft.results.length} answered
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={discard}>Discard</Button>
            <Button onClick={resume}>Resume</Button>
          </div>
        </div>
      )}
      {!setup && <div className="mt-2"><Setup onStart={start} loading={loading} initial={initial} /></div>}

      {setup && !done && current && (
        <Card>
          <div className="mb-3 flex items-center justify-between gap-2 text-sm">
            <span className="font-semibold text-brand-700">Question {index + 1} of {questions.length}</span>
            <span className="flex items-center gap-1.5">
              {!current.feedback && <AnswerTimer seconds={seconds} />}
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-ink-soft">
                {current.question.category}
              </span>
            </span>
          </div>
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${((index + (current.feedback ? 1 : 0)) / questions.length) * 100}%` }} />
          </div>
          <h2 className="text-lg font-bold leading-snug">{current.question.question}</h2>
          {current.question.tip && (
            <button type="button" className="-mx-2 mt-1 min-h-11 rounded-lg px-2 text-sm font-medium text-brand-700" aria-expanded={showTip} onClick={() => setShowTip(!showTip)}>
              {showTip ? 'Hide hint' : 'Show hint'}
            </button>
          )}
          {showTip && <p className="mt-1 rounded-lg bg-brand-50 p-2 text-sm text-brand-900">{current.question.tip}</p>}

          {!current.feedback ? (
            <form onSubmit={submit} className="mt-4 space-y-3">
              <label htmlFor="answer" className="sr-only">Your answer</label>
              <textarea
                id="answer"
                rows={7}
                className={inputClass}
                placeholder="Type your answer as you would say it in the interview…"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                maxLength={6000}
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-ink-muted">{answer.trim().split(/\s+/).filter(Boolean).length} words · aim for 100-200</span>
                <div className="flex w-full gap-2 sm:w-auto">
                  <Button type="button" variant="ghost" onClick={next} disabled={loading}>Skip</Button>
                  <Button type="submit" disabled={loading || !answer.trim()} className="flex-1 sm:flex-none">
                    {loading ? <Spinner label="Reviewing…" /> : 'Get feedback'}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <>
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-ink-soft">
                <span className="font-semibold text-ink">Your answer: </span>{current.answer}
              </div>
              <Feedback fb={current.feedback} />
              <div className="mt-4 flex justify-end">
                <Button onClick={next} className="w-full sm:w-auto">{index + 1 >= questions.length ? 'Finish interview' : 'Next question'}</Button>
              </div>
            </>
          )}
        </Card>
      )}

      {done && <Summary setup={setup} results={results} onRestart={reset} />}

      {!setup && <FaqSection items={FAQ} />}
    </>
  )
}
