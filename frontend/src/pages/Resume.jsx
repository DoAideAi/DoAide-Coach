import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CopyButton from '../components/Copy'
import Seo, { faq, webApp } from '../components/Seo'
import { ROUTE_META } from '../routeMeta'
import {
  BackLink, BulletList, Button, Card, ErrorBox, FaqSection, Field, PageHeader, SavedNote,
  ScoreRing, ShareBar, Spinner, inputClass,
} from '../components/ui'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { addSession } from '../lib/storage'

const FAQ = [
  ['How is the resume match score calculated?', '70% comes from how many of the job description’s key skills and terms appear in your resume, and 30% from ATS-friendly structure (contact details, sections, action verbs, quantified results). When AI is available, its holistic read of fit is blended in.'],
  ['Is my resume saved?', 'No. Your resume text is processed to compute the score and is not stored on our servers. Only the score is saved in your browser history.'],
  ['Should I add every missing keyword?', 'Only where it is truthful. Add keywords to bullets that describe real work you have done, because interviewers will ask about them.'],
]

const CHECK_LABELS = {
  contact_email: 'Email address',
  contact_phone: 'Phone number',
  quantified_achievements: 'Quantified achievements',
  action_verbs: 'Strong action verbs',
  good_length: 'Right length (1-2 pages)',
  section_experience: 'Experience section',
  section_education: 'Education section',
  section_skills: 'Skills section',
  section_projects: 'Projects / achievements',
}

function Bar({ label, value }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-ink-soft">{label}</span>
        <span className="font-semibold text-ink">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-600" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function Chips({ items, tone }) {
  const cls = tone === 'green' ? 'border-green-200 bg-green-50 text-green-800' : 'border-orange-200 bg-orange-50 text-orange-800'
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((k) => (
        <span key={k} className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{k}</span>
      ))}
    </div>
  )
}

export default function Resume() {
  const { user, sync } = useAuth()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ resume: '', job_description: '', target_role: params.get('role') || '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.resume.trim().length < 50) return setError('Please paste your full resume (at least 50 characters).')
    if (form.job_description.trim().length < 30) return setError('Please paste the job description (at least 30 characters).')
    setLoading(true)
    try {
      const data = await api('/api/resume/score', { method: 'POST', body: form })
      setResult(data)
      addSession({
        kind: 'resume',
        score: data.score,
        title: form.target_role || 'Resume match',
        details: { missing: data.missing_keywords.slice(0, 10) },
      })
      if (user) sync()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo
        {...ROUTE_META['/resume']}
        jsonLd={[webApp('Resume Scorer', '/resume', 'Score your resume against a job description.'), faq(FAQ)]}
      />
      <BackLink />
      <PageHeader title="Resume Scorer" subtitle="See how well your resume matches a job, and exactly what to fix." />
      <Card>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Target role (optional)" id="target_role">
            <input id="target_role" className={inputClass} placeholder="e.g. Data Analyst" value={form.target_role} onChange={set('target_role')} maxLength={80} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Your resume" id="resume" hint="Paste the plain text of your resume.">
              <textarea id="resume" rows={10} className={inputClass} value={form.resume} onChange={set('resume')} maxLength={20000} placeholder="Name, contact, summary, experience, education, skills…" />
            </Field>
            <Field label="Job description" id="jd" hint="Copy it from Naukri, LinkedIn or the company careers page.">
              <textarea id="jd" rows={10} className={inputClass} value={form.job_description} onChange={set('job_description')} maxLength={15000} placeholder="Paste the full job description…" />
            </Field>
          </div>
          <ErrorBox message={error} />
          <Button type="submit" disabled={loading} className="w-full py-3 sm:w-auto">
            {loading ? <Spinner label="Scoring your resume…" /> : 'Score my resume'}
          </Button>
        </form>
      </Card>

      {result && (
        <div className="mt-6 space-y-4" aria-live="polite">
          <Card>
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <ScoreRing score={result.score} caption="Match score" size={128} />
              <div className="w-full flex-1 space-y-3">
                <p className="font-semibold text-ink">{result.summary}</p>
                <Bar label="Keyword match" value={result.keyword_score} />
                <Bar label="ATS structure" value={result.structure_score} />
              </div>
            </div>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <h2 className="mb-2 font-bold">Missing keywords</h2>
              {result.missing_keywords.length ? <Chips items={result.missing_keywords} tone="orange" /> : <p className="text-sm text-ink-soft">None. Great coverage!</p>}
            </Card>
            <Card>
              <h2 className="mb-2 font-bold">Matched keywords</h2>
              {result.matched_keywords.length ? <Chips items={result.matched_keywords} tone="green" /> : <p className="text-sm text-ink-soft">No matches yet.</p>}
            </Card>
          </div>
          <Card>
            <h2 className="mb-3 font-bold">How to improve</h2>
            <BulletList items={result.suggestions} />
            {result.strengths?.length > 0 && (
              <>
                <h3 className="mb-2 mt-5 font-bold text-green-800">Strengths</h3>
                <BulletList items={result.strengths} tone="green" />
              </>
            )}
          </Card>
          {result.rewritten_summary && (
            <Card>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-bold">Suggested profile summary</h2>
                <CopyButton text={result.rewritten_summary} />
              </div>
              <p className="text-sm leading-relaxed text-ink">{result.rewritten_summary}</p>
            </Card>
          )}
          <Card>
            <h2 className="mb-3 font-bold">ATS checklist</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {Object.entries(result.checks).map(([k, ok]) => (
                <li key={k} className="flex items-center gap-2 text-sm">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${ok ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`} aria-label={ok ? 'Pass' : 'Missing'}>
                    {ok ? '✓' : '!'}
                  </span>
                  {CHECK_LABELS[k] || k}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="flex flex-col gap-3 border-brand-200 bg-brand-50/50 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-ink">Resume sorted? Now practise the interview</h3>
              <p className="mt-0.5 text-sm text-ink-soft">
                Run a {form.target_role ? `${form.target_role} ` : ''}mock interview and get rated answers question by question.
              </p>
            </div>
            <Link
              to={`/interview${form.target_role ? `?role=${encodeURIComponent(form.target_role)}` : ''}`}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Start a mock interview →
            </Link>
          </Card>
          <div className="flex flex-col gap-2">
            <ShareBar text={`My resume scored ${result.score}/100 on DoAide Coach's resume matcher.`} />
            <SavedNote />
          </div>
        </div>
      )}
      <FaqSection items={FAQ} />
    </>
  )
}
