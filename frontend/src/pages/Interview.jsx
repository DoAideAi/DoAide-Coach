import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Seo, { faq, webApp } from '../components/Seo'
import {
  BackLink, BulletList, Button, Card, ErrorBox, FaqSection, Field, INDUSTRIES, PageHeader,
  SavedNote, ScoreRing, ShareBar, Spinner, inputClass,
} from '../components/ui'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { addSession } from '../lib/storage'

const LEVELS = [
  ['fresher', 'Fresher / campus'],
  ['junior', '1-3 years'],
  ['mid', '3-8 years'],
  ['senior', '8+ years'],
]

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
  const answered = results.filter((r) => r.feedback)
  const avg = answered.length
    ? Math.round((answered.reduce((t, r) => t + r.feedback.rating, 0) / answered.length) * 10)
    : 0
  const title = [setup.role || 'Mock interview', setup.company].filter(Boolean).join(' @ ')
  return (
    <div className="space-y-4">
      <Card className="text-center">
        <h2 className="text-xl font-bold">Interview complete!</h2>
        <p className="mt-1 text-ink-soft">{title}</p>
        <div className="my-4 flex justify-center">
          <ScoreRing score={avg} caption={`Overall ${avg}/100`} size={128} />
        </div>
        <p className="text-sm text-ink-soft">
          You answered {answered.length} of {results.length} questions.
          {avg >= 75 ? ' Excellent work. You are interview-ready!' : ' Every session makes you sharper. Keep practising!'}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button onClick={onRestart}>Practise again</Button>
          <Link to="/dashboard" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:border-brand-400">
            View progress
          </Link>
        </div>
        <div className="mt-4 flex justify-center">
          <ShareBar text={`I scored ${avg}/100 in a ${title} mock interview on DoAide Coach!`} />
        </div>
        <div className="mt-3"><SavedNote /></div>
      </Card>
      {results.map((r, i) => (
        <Card key={i}>
          <p className="text-xs font-semibold uppercase text-ink-muted">Q{i + 1} · {r.question.category}</p>
          <p className="mt-1 font-semibold">{r.question.question}</p>
          {r.feedback ? (
            <p className="mt-2 text-sm text-ink-soft">Rating: <strong className="text-ink">{r.feedback.rating}/10</strong>. {r.feedback.verdict}</p>
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
      setResults(results.map((r, i) => (i === index ? { ...r, answer, feedback: fb } : r)))
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
    setDone(true)
  }

  const next = () => {
    setAnswer('')
    setShowTip(false)
    if (index + 1 >= questions.length) finish(results)
    else setIndex(index + 1)
  }

  const reset = () => {
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
      <ErrorBox message={error} />

      {!setup && <div className="mt-2"><Setup onStart={start} loading={loading} initial={initial} /></div>}

      {setup && !done && current && (
        <Card>
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-brand-700">Question {index + 1} of {questions.length}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-ink-soft">
              {current.question.category}
            </span>
          </div>
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${((index + (current.feedback ? 1 : 0)) / questions.length) * 100}%` }} />
          </div>
          <h2 className="text-lg font-bold leading-snug">{current.question.question}</h2>
          {current.question.tip && (
            <button type="button" className="mt-2 text-sm font-medium text-brand-700" onClick={() => setShowTip(!showTip)}>
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
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={next} disabled={loading}>Skip</Button>
                  <Button type="submit" disabled={loading || !answer.trim()}>
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
                <Button onClick={next}>{index + 1 >= questions.length ? 'Finish interview' : 'Next question'}</Button>
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
