import { useState } from 'react'
import { Link } from 'react-router-dom'
import CopyButton from '../components/Copy'
import Seo, { faq, webApp } from '../components/Seo'
import { ROUTE_META } from '../routeMeta'
import {
  BackLink, BulletList, Button, Card, ErrorBox, FaqSection, Field, PageHeader, Spinner, WhatsAppButton, inputClass,
} from '../components/ui'
import { api } from '../lib/api'

const FAQ = [
  ['How long should "Tell me about yourself" be?', 'About 60 to 90 seconds when spoken, which is roughly 130 to 190 words. Long enough to show who you are, short enough that the interviewer asks a follow-up.'],
  ['What should a fresher say in "Tell me about yourself"?', 'Your degree and college, two or three skills, one project or internship you are proud of, and why you want this role. Skip family details and hobbies unless they relate to the job.'],
  ['What should an experienced candidate say?', 'Start with your current role and years of experience, give one measurable achievement, and end with why this role is the right next step.'],
  ['Is my information stored?', 'No. The details you type are only used to write the answer and are not saved on our servers.'],
]

const BLANK = {
  name: '', level: 'fresher', target_role: '', target_company: '', current_role: '', current_company: '',
  experience_years: '', education: '', skills: '', achievement: '', why: '', length: 'standard',
}

export default function Intro() {
  const [form, setForm] = useState(BLANK)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const fresher = form.level === 'fresher'

  const submit = async (e) => {
    e.preventDefault()
    if (form.target_role.trim().length < 2) return setError('Enter the role you are applying for.')
    setLoading(true)
    setError('')
    try {
      const body = { ...form, experience_years: Number(form.experience_years) || 0 }
      if (fresher) Object.assign(body, { current_role: '', current_company: '', experience_years: 0 })
      setResult(await api('/api/intro/generate', { method: 'POST', body }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const practiseHref = `/interview?${new URLSearchParams(
    Object.entries({ role: form.target_role, company: form.target_company }).filter(([, v]) => v.trim()),
  )}`

  return (
    <>
      <Seo
        {...ROUTE_META['/tell-me-about-yourself']}
        jsonLd={[
          webApp('Tell Me About Yourself Generator', '/tell-me-about-yourself', 'Free AI tool that writes a 60-90 second interview self-introduction from your details.'),
          faq(FAQ),
        ]}
      />
      <BackLink />
      <PageHeader
        title='"Tell me about yourself" generator'
        subtitle="The first question in almost every interview. Fill in a few details and get a 60-90 second answer you can practise."
      />
      <ErrorBox message={error} />

      <Card className="mt-2">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit} noValidate>
          <Field label="Your name" id="in-name">
            <input id="in-name" className={inputClass} value={form.name} onChange={set('name')} maxLength={60} placeholder="e.g. Priya" />
          </Field>
          <Field label="Experience" id="in-level">
            <select id="in-level" className={inputClass} value={form.level} onChange={set('level')}>
              <option value="fresher">Fresher / final year</option>
              <option value="junior">1-3 years</option>
              <option value="mid">3-8 years</option>
              <option value="senior">8+ years</option>
            </select>
          </Field>
          <Field label="Role you are applying for" id="in-role">
            <input id="in-role" className={inputClass} value={form.target_role} onChange={set('target_role')} maxLength={80} placeholder="e.g. Software Engineer" required />
          </Field>
          <Field label="Company (optional)" id="in-company">
            <input id="in-company" className={inputClass} value={form.target_company} onChange={set('target_company')} maxLength={80} placeholder="e.g. Infosys" />
          </Field>
          {!fresher && (
            <>
              <Field label="Current job title" id="in-current">
                <input id="in-current" className={inputClass} value={form.current_role} onChange={set('current_role')} maxLength={80} placeholder="e.g. Associate Consultant" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Current company" id="in-ccompany">
                  <input id="in-ccompany" className={inputClass} value={form.current_company} onChange={set('current_company')} maxLength={80} />
                </Field>
                <Field label="Years" id="in-years">
                  <input id="in-years" type="number" inputMode="decimal" min="0" max="50" className={inputClass} value={form.experience_years} onChange={set('experience_years')} />
                </Field>
              </div>
            </>
          )}
          <Field label="Education" id="in-edu" hint={fresher ? 'Degree, branch and college' : 'Optional'}>
            <input id="in-edu" className={inputClass} value={form.education} onChange={set('education')} maxLength={160} placeholder="e.g. B.Tech CSE from VIT, 2026" />
          </Field>
          <Field label="Key skills" id="in-skills" hint="Comma separated, 2-5 is ideal">
            <input id="in-skills" className={inputClass} value={form.skills} onChange={set('skills')} maxLength={300} placeholder="e.g. Java, SQL, React" />
          </Field>
          <Field label={fresher ? 'A project or internship you are proud of' : 'One achievement (with a number if you can)'} id="in-ach">
            <textarea id="in-ach" rows={2} className={inputClass} value={form.achievement} onChange={set('achievement')} maxLength={400} placeholder={fresher ? 'e.g. built a library app used by 300 students' : 'e.g. cut report preparation time by 40% with Power BI'} />
          </Field>
          <Field label="Why this role or company? (optional)" id="in-why">
            <textarea id="in-why" rows={2} className={inputClass} value={form.why} onChange={set('why')} maxLength={300} placeholder="e.g. I want to work on large client projects" />
          </Field>
          <Field label="Length" id="in-length">
            <select id="in-length" className={inputClass} value={form.length} onChange={set('length')}>
              <option value="short">Short (about 45 seconds)</option>
              <option value="standard">Standard (60-90 seconds)</option>
            </select>
          </Field>
          <div className="flex items-end">
            <Button type="submit" disabled={loading} className="w-full py-3">
              {loading ? <Spinner label="Writing your answer…" /> : result ? 'Write it again' : 'Write my answer'}
            </Button>
          </div>
        </form>
      </Card>

      {result && (
        <Card className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Your answer</h2>
            <span className="text-xs text-ink-muted" data-testid="intro-stats">
              {result.word_count} words · about {result.speaking_seconds} seconds
            </span>
          </div>
          <p className="mt-3 whitespace-pre-line rounded-xl bg-brand-50/60 p-4 leading-relaxed text-ink" data-testid="intro-text">
            {result.intro}
          </p>
          <div className="mt-2 flex justify-end"><CopyButton text={result.intro} label="Copy answer" /></div>
          <h3 className="mb-2 mt-4 text-sm font-bold text-orange-800">Make it stronger</h3>
          <BulletList items={result.tips} tone="orange" />
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link to={practiseHref} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
              Practise the rest of the interview →
            </Link>
            <WhatsAppButton text="Wrote my 'Tell me about yourself' answer in 1 minute with this free tool:" />
          </div>
        </Card>
      )}

      <FaqSection items={FAQ} />
    </>
  )
}
