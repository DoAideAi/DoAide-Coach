import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo, { faq, webApp } from '../components/Seo'
import { BackLink, Card, FaqSection, PageHeader } from '../components/ui'

const BANKS = {
  it: {
    label: 'IT & Software',
    icon: '💻',
    questions: [
      { q: 'Explain the difference between REST and GraphQL APIs.', cat: 'Technical', diff: 'medium' },
      { q: 'How would you design a URL shortener service?', cat: 'Technical', diff: 'hard' },
      { q: 'What is the CAP theorem and why does it matter?', cat: 'Technical', diff: 'hard' },
      { q: 'Describe the SOLID principles with examples.', cat: 'Technical', diff: 'medium' },
      { q: 'What is the difference between SQL and NoSQL databases?', cat: 'Technical', diff: 'easy' },
      { q: 'How do you handle a production outage at 2 AM?', cat: 'Situational', diff: 'medium' },
      { q: 'Tell me about a time you had to debug a difficult issue.', cat: 'Behavioral', diff: 'medium' },
      { q: 'How do you prioritise between tech debt and feature work?', cat: 'Behavioral', diff: 'medium' },
      { q: 'Explain microservices vs monolith architecture.', cat: 'Technical', diff: 'medium' },
      { q: 'What is CI/CD and how have you implemented it?', cat: 'Technical', diff: 'easy' },
      { q: 'How do you ensure code quality in a team?', cat: 'Behavioral', diff: 'easy' },
      { q: 'Describe your experience with cloud services (AWS/GCP/Azure).', cat: 'Technical', diff: 'medium' },
      { q: 'How would you scale a system handling 1 million requests per second?', cat: 'Technical', diff: 'hard' },
      { q: 'What is your approach to writing unit tests?', cat: 'Technical', diff: 'easy' },
      { q: 'Tell me about a project you are most proud of.', cat: 'Behavioral', diff: 'easy' },
    ],
  },
  finance: {
    label: 'Finance & Banking',
    icon: '🏦',
    questions: [
      { q: 'Walk me through a DCF valuation model.', cat: 'Technical', diff: 'hard' },
      { q: 'What is the difference between NPV and IRR?', cat: 'Technical', diff: 'medium' },
      { q: 'How do you assess credit risk for a corporate borrower?', cat: 'Technical', diff: 'hard' },
      { q: 'Explain the Basel III capital requirements.', cat: 'Technical', diff: 'hard' },
      { q: 'What is the difference between hedging and speculation?', cat: 'Technical', diff: 'medium' },
      { q: 'How would you value a company with negative earnings?', cat: 'Technical', diff: 'hard' },
      { q: 'Tell me about a time you identified a financial risk others missed.', cat: 'Behavioral', diff: 'medium' },
      { q: 'How do you stay updated with financial regulations?', cat: 'Behavioral', diff: 'easy' },
      { q: 'Explain the difference between equity and debt financing.', cat: 'Technical', diff: 'easy' },
      { q: 'What is EBITDA and why is it important?', cat: 'Technical', diff: 'easy' },
      { q: 'How would you handle a client requesting an unethical transaction?', cat: 'Situational', diff: 'medium' },
      { q: 'Describe the impact of RBI monetary policy on banking.', cat: 'Technical', diff: 'medium' },
      { q: 'What is AML and KYC? Why are they important?', cat: 'Technical', diff: 'easy' },
      { q: 'How do you prioritise when multiple deadlines overlap?', cat: 'Behavioral', diff: 'easy' },
      { q: 'Walk me through a recent market event and its implications.', cat: 'Behavioral', diff: 'medium' },
    ],
  },
  healthcare: {
    label: 'Healthcare',
    icon: '🏥',
    questions: [
      { q: 'How do you handle a situation where a patient disagrees with the treatment plan?', cat: 'Situational', diff: 'medium' },
      { q: 'Describe your experience with electronic health records (EHR).', cat: 'Technical', diff: 'easy' },
      { q: 'How do you ensure patient data privacy and HIPAA compliance?', cat: 'Technical', diff: 'medium' },
      { q: 'Tell me about a time you had to make a quick decision in a clinical setting.', cat: 'Behavioral', diff: 'medium' },
      { q: 'How do you stay current with medical research and guidelines?', cat: 'Behavioral', diff: 'easy' },
      { q: 'Describe your approach to multidisciplinary team collaboration.', cat: 'Behavioral', diff: 'easy' },
      { q: 'How would you handle a medication error?', cat: 'Situational', diff: 'hard' },
      { q: 'What is evidence-based medicine and how do you apply it?', cat: 'Technical', diff: 'medium' },
      { q: 'How do you manage burnout in a high-pressure healthcare environment?', cat: 'Behavioral', diff: 'medium' },
      { q: 'Describe a time you had to deliver bad news to a patient or family.', cat: 'Behavioral', diff: 'hard' },
      { q: 'What quality improvement initiatives have you been involved in?', cat: 'Behavioral', diff: 'medium' },
      { q: 'How do you handle conflicts with colleagues in a clinical setting?', cat: 'Situational', diff: 'medium' },
      { q: 'What is your understanding of value-based care?', cat: 'Technical', diff: 'medium' },
      { q: 'How do you prioritise patient safety in your daily work?', cat: 'Behavioral', diff: 'easy' },
      { q: 'Describe a challenging case and how you managed it.', cat: 'Behavioral', diff: 'hard' },
    ],
  },
}

const DIFF_STYLE = {
  easy: 'bg-green-50 text-green-800',
  medium: 'bg-amber-50 text-amber-800',
  hard: 'bg-red-50 text-red-800',
}

const FAQ_ITEMS = [
  ['How were these questions selected?', 'They are curated from commonly reported interview questions in each industry, covering technical, behavioral and situational categories.'],
  ['Can I practise these with AI feedback?', 'Yes. Click "Practise this" on any question to start an AI mock interview focused on that topic.'],
  ['Are there more industries?', 'We are adding more industries regularly. Use the general mock interview for industries not listed here.'],
]

export default function IndustryQuestions() {
  const [industry, setIndustry] = useState('it')
  const [filter, setFilter] = useState('')
  const bank = BANKS[industry]

  const filtered = bank.questions.filter((q) => !filter || q.cat.toLowerCase() === filter)

  return (
    <>
      <Seo
        title="Industry-Specific Interview Questions — IT, Finance, Healthcare | DoAide Coach"
        description="Practise interview questions tailored to your industry: IT & software engineering, finance & banking, and healthcare. With difficulty levels and AI mock interview links."
        path="/industry-questions"
        jsonLd={[webApp('Industry Interview Questions', '/industry-questions', 'Interview questions by industry.'), faq(FAQ_ITEMS)]}
      />
      <BackLink />
      <PageHeader title="Industry Question Banks" subtitle="Focused questions for IT, Finance and Healthcare interviews." />

      <div className="mb-6 flex gap-3 overflow-x-auto pb-1">
        {Object.entries(BANKS).map(([key, { label, icon }]) => (
          <button
            key={key}
            type="button"
            onClick={() => { setIndustry(key); setFilter('') }}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              industry === key ? 'bg-brand-700 text-white shadow' : 'border border-slate-200 bg-white text-ink hover:border-brand-300'
            }`}
          >
            <span className="text-lg">{icon}</span> {label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {['', 'technical', 'behavioral', 'situational'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`min-h-9 shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold ${
              filter === f ? 'bg-brand-100 text-brand-800' : 'bg-slate-100 text-ink-soft'
            }`}
          >
            {f || 'All'}{f ? '' : ` (${bank.questions.length})`}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((q, i) => (
          <Card key={i} className="!p-4">
            <div className="mb-2 flex flex-wrap gap-1.5 text-xs">
              <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-brand-800">{q.cat}</span>
              <span className={`rounded-full px-2 py-0.5 font-semibold capitalize ${DIFF_STYLE[q.diff]}`}>{q.diff}</span>
            </div>
            <p className="font-semibold leading-snug text-ink">{q.q}</p>
            <Link
              to={`/interview?industry=${industry}`}
              className="mt-2 inline-flex min-h-9 items-center text-sm font-medium text-brand-700 hover:underline"
            >
              Practise this →
            </Link>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && <p className="py-6 text-center text-ink-soft">No questions in this category.</p>}
      <FaqSection items={FAQ_ITEMS} />
    </>
  )
}
