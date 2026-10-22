import { useState } from 'react'
import { Link } from 'react-router-dom'
import CopyButton from '../components/Copy'
import Seo, { faq, webApp } from '../components/Seo'
import {
  BackLink, BulletList, Button, Card, ErrorBox, FaqSection, Field, PageHeader, Spinner, WhatsAppButton, inputClass,
} from '../components/ui'
import { api } from '../lib/api'

const FAQ = [
  ['What is the STAR method?', 'STAR stands for Situation, Task, Action, Result. It is the structure interviewers expect for behavioral questions: one line of context, your responsibility, the specific steps YOU took, and a measurable outcome.'],
  ['Which questions should I answer with STAR?', 'Any question that starts with "Tell me about a time…", "Describe a situation…" or "Give an example of…". That covers most behavioral and many managerial questions at companies like Amazon, TCS and Deloitte.'],
  ['How long should a STAR answer be?', 'About 1.5 to 2 minutes spoken — roughly 150 to 250 words. Spend the most time on Action and Result, not the setup.'],
  ['Is my story stored?', 'No. What you type is only used to write the answer and is not saved on our servers.'],
]

const BLANK = { question: '', situation: '', task: '', action: '', result: '', learning: '' }

const FIELDS = [
  ['situation', 'Situation', 'One or two lines of context. Where were you, what was happening?', 'e.g. Our client release was due in two weeks and a teammate fell sick', 2],
  ['task', 'Task', 'What were YOU responsible for?', 'e.g. deliver the reporting module on time with half the team', 2],
  ['action', 'Action', 'The specific steps you took. This is the heart of the answer.', 'e.g. I cut scope to the three must-have reports, automated test data setup and paired daily with the junior dev', 3],
  ['result', 'Result', 'The outcome, with a number if you can.', 'e.g. shipped 1 day early, client signed off with zero defects', 2],
]

export default function Star() {
  const [form, setForm] = useState(BLANK)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (form.situation.trim().length < 10) return setError('Describe the situation in at least one line.')
    if (form.action.trim().length < 10) return setError('The action is the heart of the story — add the steps you took.')
    if (form.task.trim().length < 5 || form.result.trim().length < 5) return setError('Fill in the task and the result.')
    setLoading(true)
    setError('')
    try {
      setResult(await api('/api/star/generate', { method: 'POST', body: form }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo
        title="STAR Method Answer Generator for Interviews | DoAide Coach"
        description="Turn your rough story into a polished STAR interview answer (Situation, Task, Action, Result) in one minute. Free AI tool for behavioral interviews. No login."
        path="/star-method"
        jsonLd={[
          webApp('STAR Method Answer Generator', '/star-method', 'Free AI tool that turns your story into a structured STAR interview answer.'),
          faq(FAQ),
        ]}
      />
      <BackLink />
      <PageHeader
        title="STAR method answer generator"
        subtitle={'For every "Tell me about a time…" question. Type your story in rough notes and get a structured, spoken answer.'}
      />
      <ErrorBox message={error} />

      <Card className="mt-2">
        <form className="grid gap-4" onSubmit={submit} noValidate>
          <Field label="The interview question (optional)" id="st-question">
            <input
              id="st-question" className={inputClass} value={form.question} onChange={set('question')}
              maxLength={300} placeholder="e.g. Tell me about a time you missed a deadline"
            />
          </Field>
          {FIELDS.map(([key, label, hint, placeholder, rows]) => (
            <Field key={key} label={label} id={`st-${key}`} hint={hint}>
              <textarea
                id={`st-${key}`} rows={rows} className={inputClass} value={form[key]} onChange={set(key)}
                maxLength={key === 'action' ? 1200 : 800} placeholder={placeholder}
              />
            </Field>
          ))}
          <Field label="What you learned (optional)" id="st-learning">
            <input
              id="st-learning" className={inputClass} value={form.learning} onChange={set('learning')}
              maxLength={400} placeholder="e.g. scope is the first lever, not working nights"
            />
          </Field>
          <div>
            <Button type="submit" disabled={loading} className="w-full py-3 sm:w-auto">
              {loading ? <Spinner label="Structuring your story…" /> : result ? 'Write it again' : 'Write my STAR answer'}
            </Button>
          </div>
        </form>
      </Card>

      {result && (
        <Card className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Your STAR answer</h2>
            <span className="text-xs text-ink-muted" data-testid="star-stats">
              {result.word_count} words · about {result.speaking_seconds} seconds
            </span>
          </div>
          <p className="mt-3 whitespace-pre-line rounded-xl bg-brand-50/60 p-4 leading-relaxed text-ink" data-testid="star-text">
            {result.answer}
          </p>
          <div className="mt-2 flex justify-end"><CopyButton text={result.answer} label="Copy answer" /></div>
          {result.tips?.length > 0 && (
            <>
              <h3 className="mb-2 mt-4 text-sm font-bold text-orange-800">Make it stronger</h3>
              <BulletList items={result.tips} tone="orange" />
            </>
          )}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link to="/interview" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
              Practise it in a mock interview →
            </Link>
            <WhatsAppButton text="Structured my interview story with the STAR method in 1 minute, free:" />
          </div>
        </Card>
      )}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-bold text-ink">The STAR structure in 30 seconds</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
          <li><strong className="text-ink">S — Situation:</strong> one line of context. Where, when, what was at stake.</li>
          <li><strong className="text-ink">T — Task:</strong> your specific responsibility, not the team&apos;s.</li>
          <li><strong className="text-ink">A — Action:</strong> the 2-4 concrete steps <em>you</em> took. Longest part.</li>
          <li><strong className="text-ink">R — Result:</strong> a measurable outcome, plus what you learned.</li>
        </ul>
      </section>

      <FaqSection items={FAQ} />
    </>
  )
}
