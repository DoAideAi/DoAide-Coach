import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo, { faq, webApp } from '../components/Seo'
import { ROUTE_META } from '../routeMeta'
import { BackLink, Button, Card, FaqSection, PageHeader, inputClass } from '../components/ui'

const SKILL_PATTERNS = [
  { re: /\b(?:java(?:script)?|typescript|python|go(?:lang)?|rust|c\+\+|c#|ruby|swift|kotlin|php|scala|r\b)/gi, label: 'Programming' },
  { re: /\b(?:react|angular|vue|next\.?js|node\.?js|express|django|flask|spring|rails)/gi, label: 'Frameworks' },
  { re: /\b(?:aws|azure|gcp|google cloud|docker|kubernetes|k8s|terraform|ci\/cd|devops)/gi, label: 'Cloud & DevOps' },
  { re: /\b(?:sql|postgres|mysql|mongodb|redis|elasticsearch|dynamodb|cassandra)/gi, label: 'Databases' },
  { re: /\b(?:machine learning|deep learning|nlp|computer vision|data science|ai|ml|tensorflow|pytorch)/gi, label: 'AI/ML' },
  { re: /\b(?:agile|scrum|kanban|jira|project management|product management|stakeholder)/gi, label: 'Management' },
  { re: /\b(?:leadership|team lead|managed a team|mentored|coaching)/gi, label: 'Leadership' },
  { re: /\b(?:sales|revenue|business development|client|account management|crm)/gi, label: 'Sales/BD' },
  { re: /\b(?:marketing|seo|content|social media|brand|campaigns|analytics)/gi, label: 'Marketing' },
  { re: /\b(?:finance|accounting|audit|compliance|risk|banking|investment)/gi, label: 'Finance' },
]

const ROLE_PATTERNS = [
  { re: /\b(?:software engineer|developer|programmer|sde|full.?stack|front.?end|back.?end)/gi, label: 'Software Engineer' },
  { re: /\b(?:data scientist|data analyst|data engineer|ml engineer)/gi, label: 'Data Professional' },
  { re: /\b(?:product manager|program manager|project manager|pm\b)/gi, label: 'Product/Project Manager' },
  { re: /\b(?:designer|ux|ui|graphic design)/gi, label: 'Designer' },
  { re: /\b(?:devops|sre|site reliability|platform engineer|infra)/gi, label: 'DevOps/SRE' },
  { re: /\b(?:manager|director|vp|head of|chief|cto|ceo|cfo)/gi, label: 'Leadership' },
  { re: /\b(?:analyst|business analyst|consultant)/gi, label: 'Analyst/Consultant' },
]

const EXPERIENCE_RE = /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)?/gi

function parseResume(text) {
  const skills = []
  const skillNames = new Set()
  for (const { re, label } of SKILL_PATTERNS) {
    const matches = [...text.matchAll(re)].map((m) => m[0])
    for (const m of matches) {
      const key = m.toLowerCase()
      if (!skillNames.has(key)) {
        skillNames.add(key)
        skills.push({ name: m, category: label })
      }
    }
  }

  const roles = []
  for (const { re, label } of ROLE_PATTERNS) {
    if (re.test(text)) roles.push(label)
  }

  let experience = null
  const expMatch = [...text.matchAll(EXPERIENCE_RE)]
  if (expMatch.length) {
    experience = Math.max(...expMatch.map((m) => Number(m[1])))
  }

  return { skills, roles: [...new Set(roles)], experience }
}

function generateQuestions(parsed) {
  const questions = []
  const { skills, roles, experience } = parsed

  if (roles.includes('Software Engineer')) {
    questions.push(
      'Walk me through a complex system you designed from scratch.',
      'How do you approach debugging production issues?',
      'Describe your experience with code reviews and what you look for.',
    )
  }
  if (roles.includes('Data Professional')) {
    questions.push(
      'How do you handle missing data in a large dataset?',
      'Describe a model you built and its business impact.',
    )
  }
  if (roles.includes('Product/Project Manager')) {
    questions.push(
      'How do you prioritise features when stakeholders disagree?',
      'Tell me about a product launch you managed end-to-end.',
    )
  }
  if (roles.includes('Leadership')) {
    questions.push(
      'How do you build and retain a high-performing team?',
      'Describe a time you had to make a difficult strategic decision.',
    )
  }

  for (const s of skills.slice(0, 6)) {
    questions.push(`Tell me about your experience with ${s.name} and how you have used it in a project.`)
  }

  if (experience && experience >= 5) {
    questions.push(
      'How have you mentored junior team members?',
      'Tell me about a time you led a cross-functional initiative.',
    )
  }

  questions.push(
    'What is your biggest professional achievement?',
    'Why are you looking for a change right now?',
    'Where do you see yourself in 3-5 years?',
    'Tell me about a time you failed and what you learned from it.',
    'How do you handle tight deadlines and pressure?',
  )

  return [...new Set(questions)]
}

const FAQ_ITEMS = [
  ['How does resume parsing work?', 'We scan your resume text for skills, technologies, job titles and experience keywords to generate relevant questions. No data is sent to any server — everything runs in your browser.'],
  ['Is my resume data stored?', 'No. The parsing happens entirely in your browser. We do not store, upload or transmit your resume text.'],
  ['Can I practise these questions?', 'Yes. Click "Practise in mock interview" to start an AI-powered mock interview with similar questions.'],
]

export default function ResumeQuestions() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)

  function analyze() {
    const parsed = parseResume(text)
    const questions = generateQuestions(parsed)
    setResult({ ...parsed, questions })
  }

  return (
    <>
      <Seo
        {...ROUTE_META['/resume-questions']}
        jsonLd={[webApp('Resume to Questions', '/resume-questions', 'Generate interview questions from your resume.'), faq(FAQ_ITEMS)]}
      />
      <BackLink />
      <PageHeader title="Resume → Interview Questions" subtitle="Paste your resume text and get likely interview questions based on your profile." />

      <Card>
        <label htmlFor="resume-text" className="mb-1 block text-sm font-semibold text-ink">
          Paste your resume text
        </label>
        <textarea
          id="resume-text"
          rows={10}
          className={inputClass}
          placeholder="Copy-paste your entire resume here. We detect skills, roles and experience to generate relevant questions. Nothing leaves your browser."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={20000}
        />
        <p className="mt-1 text-xs text-ink-muted">🔒 100% private — processed in your browser, nothing uploaded</p>
        <Button
          className="mt-3 w-full py-3"
          onClick={analyze}
          disabled={text.trim().length < 50}
        >
          Generate questions
        </Button>
      </Card>

      {result && (
        <div className="mt-6 space-y-4">
          <Card>
            <h2 className="mb-3 text-lg font-bold">Your profile</h2>
            {result.experience && (
              <p className="mb-2 text-sm text-ink-soft">
                Detected experience: <strong className="text-ink">{result.experience}+ years</strong>
              </p>
            )}
            {result.roles.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 text-sm font-semibold text-ink">Likely roles</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.roles.map((r) => (
                    <span key={r} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800">{r}</span>
                  ))}
                </div>
              </div>
            )}
            {result.skills.length > 0 && (
              <div>
                <p className="mb-1 text-sm font-semibold text-ink">Detected skills ({result.skills.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.skills.map((s) => (
                    <span key={s.name} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-ink-soft" title={s.category}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 text-lg font-bold">Likely interview questions ({result.questions.length})</h2>
            <ol className="space-y-3">
              {result.questions.map((q, i) => (
                <li key={i} className="flex gap-3 rounded-xl bg-slate-50 p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-sm font-medium leading-relaxed text-ink">{q}</p>
                </li>
              ))}
            </ol>
            <Link
              to={`/interview${result.roles.includes('Software Engineer') ? '?industry=it' : ''}`}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Practise in mock interview →
            </Link>
          </Card>
        </div>
      )}

      <FaqSection items={FAQ_ITEMS} />
    </>
  )
}
