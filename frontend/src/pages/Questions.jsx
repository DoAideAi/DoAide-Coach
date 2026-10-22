import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo, { faq, webApp } from '../components/Seo'
import { BackLink, Card, ErrorBox, FaqSection, INDUSTRIES, PageHeader, Spinner, inputClass } from '../components/ui'
import { api } from '../lib/api'

const CATEGORIES = [
  ['', 'All'],
  ['behavioral', 'Behavioral'],
  ['technical', 'Technical'],
  ['hr', 'HR'],
]

const DIFF = {
  easy: 'bg-green-50 text-green-800 border-green-200',
  medium: 'bg-amber-50 text-amber-800 border-amber-200',
  hard: 'bg-red-50 text-red-800 border-red-200',
}

const FAQ = [
  ['Are these real interview questions?', 'They are curated from questions commonly reported in Indian interviews at service companies, product companies, banks and consulting firms.'],
  ['How should I use the question bank?', 'Filter by your industry and target company, read the hint for each question, then practise answering it in the AI mock interview.'],
]

function QuestionCard({ q }) {
  const [open, setOpen] = useState(false)
  const practise = new URLSearchParams({
    industry: q.industry === 'all' ? 'it' : q.industry,
    ...(q.companies[0] ? { company: q.companies[0] } : {}),
    ...(q.roles[0] ? { role: q.roles[0] } : {}),
  })
  return (
    <Card className="!p-4">
      <div className="mb-2 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold capitalize text-brand-800">{q.category}</span>
        <span className={`rounded-full border px-2 py-0.5 font-semibold capitalize ${DIFF[q.difficulty]}`}>{q.difficulty}</span>
        {q.companies.slice(0, 4).map((c) => (
          <span key={c} className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-ink-soft">{c}</span>
        ))}
      </div>
      <h3 className="font-semibold leading-snug text-ink">{q.question}</h3>
      <div className="mt-2 flex flex-wrap gap-3 text-sm">
        <button type="button" className="font-medium text-brand-700" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? 'Hide hint' : 'How to answer'}
        </button>
        <Link to={`/interview?${practise}`} className="font-medium text-ink-soft hover:text-brand-700">
          Practise similar →
        </Link>
      </div>
      {open && <p className="mt-2 rounded-lg bg-brand-50 p-3 text-sm text-brand-900">{q.tip}</p>}
    </Card>
  )
}

export default function Questions() {
  const [filters, setFilters] = useState({ category: '', industry: '', company: '', role: '', q: '' })
  const [meta, setMeta] = useState({ companies: [], roles: [] })
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/api/questions/meta').then(setMeta).catch(() => {})
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v))
    const t = setTimeout(() => {
      api(`/api/questions?${params}`)
        .then((d) => {
          setData(d)
          setError('')
        })
        .catch((e) => setError(e.message))
    }, 200)
    return () => clearTimeout(t)
  }, [filters])

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value })

  return (
    <>
      <Seo
        title="Interview Question Bank by Company & Role (India) | DoAide Coach"
        description="Browse behavioral, technical and HR interview questions for TCS, Infosys, Wipro, Amazon, Flipkart, HDFC Bank and more, with tips on how to answer."
        path="/questions"
        jsonLd={[webApp('Interview Question Bank', '/questions', 'Interview questions by company, role and category.'), faq(FAQ)]}
      />
      <BackLink />
      <PageHeader title="Question Bank" subtitle="Real questions from Indian interviews, with tips on how to answer." />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Category">
        {CATEGORIES.map(([v, l]) => (
          <button
            key={l}
            role="tab"
            aria-selected={filters.category === v}
            onClick={() => setFilters({ ...filters, category: v })}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold ${
              filters.category === v ? 'bg-brand-700 text-white' : 'border border-slate-300 bg-white text-ink-soft'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="mb-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <input aria-label="Search questions" className={inputClass} placeholder="Search…" value={filters.q} onChange={set('q')} maxLength={100} />
        <select aria-label="Industry" className={inputClass} value={filters.industry} onChange={set('industry')}>
          <option value="">All industries</option>
          {INDUSTRIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select aria-label="Company" className={inputClass} value={filters.company} onChange={set('company')}>
          <option value="">All companies</option>
          {meta.companies.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select aria-label="Role" className={inputClass} value={filters.role} onChange={set('role')}>
          <option value="">All roles</option>
          {meta.roles.map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
        </select>
      </div>

      <ErrorBox message={error} />
      {!data && !error && <Spinner label="Loading questions…" />}
      {data && (
        <>
          <p className="mb-3 text-sm text-ink-muted">{data.total} question{data.total === 1 ? '' : 's'}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {data.questions.map((q) => <QuestionCard key={q.id} q={q} />)}
          </div>
          {data.total === 0 && <p className="text-ink-soft">No questions match. Try removing a filter.</p>}
        </>
      )}
      <FaqSection items={FAQ} />
    </>
  )
}
