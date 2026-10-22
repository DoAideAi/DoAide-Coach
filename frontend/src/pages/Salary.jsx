import { useState } from 'react'
import CopyButton from '../components/Copy'
import Seo, { faq, webApp } from '../components/Seo'
import {
  BackLink, BulletList, Button, Card, ErrorBox, FaqSection, Field, INDUSTRIES, PageHeader,
  SavedNote, ShareBar, Spinner, inputClass,
} from '../components/ui'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { addSession } from '../lib/storage'

const CITIES = ['Bengaluru', 'Mumbai', 'Delhi', 'Gurugram', 'Noida', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Kochi', 'Chandigarh', 'Indore', 'Coimbatore', 'Remote']

const STRENGTH = {
  strong: ['Strong offer', 'bg-green-50 text-green-800 border-green-200'],
  fair: ['Fair offer', 'bg-brand-50 text-brand-800 border-brand-200'],
  below_market: ['Room to negotiate', 'bg-orange-50 text-orange-800 border-orange-200'],
}

const FAQ = [
  ['How much hike should I ask for when switching jobs in India?', 'Typical switch hikes range from 20% to 40%, depending on experience, skills in demand and city. Freshers and early-career professionals often see higher percentage jumps.'],
  ['Should I negotiate fixed pay or CTC?', 'Focus on fixed pay. CTC often includes variable pay, PF, gratuity and insurance, and variable payouts are frequently below 100%.'],
  ['Is the counter-offer number guaranteed?', 'No. It is an indicative rule-of-thumb based on your inputs. Use it as an anchor alongside your own market research.'],
]

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 1 })} LPA`

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className="mt-0.5 text-lg font-extrabold text-ink">{value}</p>
      {sub && <p className="text-xs text-ink-muted">{sub}</p>}
    </div>
  )
}

function ScriptBlock({ title, text }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-800">{title}</h3>
        <CopyButton text={text} />
      </div>
      <p className="whitespace-pre-line rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-ink">{text}</p>
    </div>
  )
}

export default function Salary() {
  const { user, sync } = useAuth()
  const [form, setForm] = useState({
    current_ctc: '', offered_ctc: '', experience_years: '', location: 'Bengaluru',
    role: '', company: '', industry: 'it', competing_offer: '',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const body = {
      ...form,
      current_ctc: Number(form.current_ctc),
      offered_ctc: Number(form.offered_ctc),
      experience_years: Number(form.experience_years),
      competing_offer: form.competing_offer ? Number(form.competing_offer) : null,
    }
    if (!(body.current_ctc > 0) || !(body.offered_ctc > 0)) return setError('Enter your current CTC and the offered CTC in LPA.')
    setLoading(true)
    try {
      const data = await api('/api/salary/negotiate', { method: 'POST', body })
      setResult(data)
      addSession({
        kind: 'salary',
        score: null,
        title: [form.role || 'Salary negotiation', form.company].filter(Boolean).join(' @ '),
        details: { offered: body.offered_ctc, counter: data.counter_offer, current: body.current_ctc },
      })
      if (user) sync()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const s = result?.script

  return (
    <>
      <Seo
        title="Salary Negotiation Script Generator for India | DoAide Coach"
        description="Enter your current CTC, offer, city and experience to get a counter-offer number, a word-for-word negotiation script and an email template."
        path="/salary"
        jsonLd={[webApp('Salary Negotiator', '/salary', 'Salary negotiation scripts for Indian job offers.'), faq(FAQ)]}
      />
      <BackLink />
      <PageHeader title="Salary Negotiator" subtitle="Know your number, and exactly what to say to get it." />
      <Card>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Current CTC (LPA)" id="current">
            <input id="current" type="number" inputMode="decimal" step="0.1" min="0.1" className={inputClass} placeholder="e.g. 8" value={form.current_ctc} onChange={set('current_ctc')} required />
          </Field>
          <Field label="Offered CTC (LPA)" id="offered">
            <input id="offered" type="number" inputMode="decimal" step="0.1" min="0.1" className={inputClass} placeholder="e.g. 10" value={form.offered_ctc} onChange={set('offered_ctc')} required />
          </Field>
          <Field label="Years of experience" id="exp">
            <input id="exp" type="number" inputMode="decimal" step="0.5" min="0" max="50" className={inputClass} placeholder="e.g. 3" value={form.experience_years} onChange={set('experience_years')} required />
          </Field>
          <Field label="Job location" id="location">
            <input id="location" list="cities" className={inputClass} value={form.location} onChange={set('location')} required maxLength={60} />
            <datalist id="cities">{CITIES.map((c) => <option key={c} value={c} />)}</datalist>
          </Field>
          <Field label="Role (optional)" id="srole">
            <input id="srole" className={inputClass} placeholder="e.g. Product Analyst" value={form.role} onChange={set('role')} maxLength={80} />
          </Field>
          <Field label="Company (optional)" id="scompany">
            <input id="scompany" className={inputClass} placeholder="e.g. Swiggy" value={form.company} onChange={set('company')} maxLength={80} />
          </Field>
          <Field label="Industry" id="sindustry">
            <select id="sindustry" className={inputClass} value={form.industry} onChange={set('industry')}>
              {INDUSTRIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>
          <Field label="Competing offer (LPA, optional)" id="competing">
            <input id="competing" type="number" inputMode="decimal" step="0.1" min="0.1" className={inputClass} value={form.competing_offer} onChange={set('competing_offer')} />
          </Field>
          <div className="sm:col-span-2 space-y-3">
            <ErrorBox message={error} />
            <Button type="submit" disabled={loading} className="w-full py-3 sm:w-auto">
              {loading ? <Spinner label="Writing your script…" /> : 'Get my negotiation script'}
            </Button>
          </div>
        </form>
      </Card>

      {result && (
        <div className="mt-6 space-y-4" aria-live="polite">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold">Your numbers</h2>
              <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${STRENGTH[result.offer_strength][1]}`}>
                {STRENGTH[result.offer_strength][0]}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Offered hike" value={`${result.offered_hike_pct}%`} />
              <Stat label="Typical hike" value={`~${result.typical_hike_pct}%`} sub="for your profile" />
              <Stat label="Ask for" value={fmt(result.counter_offer)} sub="counter-offer" />
              <Stat label="Walk-away" value={fmt(result.walk_away)} sub="minimum to accept" />
            </div>
            <p className="mt-3 text-xs text-ink-muted">Indicative rule of thumb based on your inputs, not guaranteed market data.</p>
          </Card>
          <Card>
            <h2 className="mb-3 font-bold">Your script</h2>
            <div className="space-y-4">
              <ScriptBlock title="1. Open warmly" text={s.opening} />
              <div>
                <h3 className="mb-1 text-sm font-bold text-brand-800">2. Make your case</h3>
                <BulletList items={s.justification} />
              </div>
              <ScriptBlock title="3. Make the ask" text={s.counter_ask} />
            </div>
          </Card>
          <Card>
            <h2 className="mb-3 font-bold">If they push back…</h2>
            <div className="space-y-3">
              {s.pushback_responses.map((p, i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-3 text-sm">
                  <p className="text-ink-muted">They say: <span className="font-medium text-ink">“{p.if_they_say}”</span></p>
                  <p className="mt-1 text-ink-muted">You say: <span className="font-medium text-brand-900">“{p.you_say}”</span></p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <ScriptBlock title="Follow-up email" text={s.email_template} />
          </Card>
          <Card>
            <h2 className="mb-3 font-bold">Pro tips</h2>
            <BulletList items={s.tips} tone="green" />
          </Card>
          <div className="flex flex-col gap-2">
            <ShareBar text="I prepared my salary negotiation with DoAide Coach. Free scripts for Indian job offers." />
            <SavedNote />
          </div>
        </div>
      )}
      <FaqSection items={FAQ} />
    </>
  )
}
