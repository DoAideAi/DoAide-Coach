import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Seo, { faq, webApp } from '../components/Seo'
import { FaqSection } from '../components/ui'

const GROUPS = [
  {
    title: 'Practise',
    tools: [
      { to: '/interview', icon: 'mic', name: 'AI Mock Interview', desc: 'Pick a role and company. Answer one question at a time and get a rating, tips and a model answer.' },
      { to: '/questions', icon: 'book', name: 'Question Bank', desc: 'Behavioral, technical and HR questions asked at TCS, Infosys, Flipkart, HDFC Bank and more.' },
    ],
  },
  {
    title: 'Get hired',
    tools: [
      { to: '/resume', icon: 'doc', name: 'Resume Scorer', desc: 'Paste your resume and a job description to get a match score, missing keywords and fixes.' },
      { to: '/salary', icon: 'rupee', name: 'Salary Negotiator', desc: 'Enter your CTC and offer to get a counter-offer number and a word-for-word script.' },
    ],
  },
  {
    title: 'Track',
    tools: [
      { to: '/dashboard', icon: 'chart', name: 'Progress Dashboard', desc: 'See your interview scores improve across practice sessions, and spot your weak areas.' },
    ],
  },
]

const FAQ = [
  ['Is DoAide Coach free?', 'Yes. All tools are free and work without an account. Sign in with Google only if you want your progress synced across devices.'],
  ['How does the AI mock interview work?', 'Choose your role, target company, industry and experience level. The AI asks questions one at a time. After each typed answer you get a rating out of 10, strengths, improvements and a model answer.'],
  ['Is my resume stored?', 'No. Your resume and job description are only used to compute the score and are not saved on our servers.'],
  ['Which industries are covered?', 'IT and software, finance and banking, marketing, sales, consulting, product management, HR and operations, with company-specific questions for top Indian employers.'],
]

export default function Home() {
  return (
    <>
      <Seo
        title="DoAide Coach: AI Interview Prep & Career Coaching for India"
        description="Practise AI mock interviews, score your resume against Indian job descriptions, browse company-wise interview questions and get salary negotiation scripts. Free, no login."
        path="/"
        jsonLd={[
          webApp('DoAide Coach', '/', 'AI interview prep and career coaching for Indian job seekers.'),
          faq(FAQ),
        ]}
      />
      <section className="rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 px-5 py-8 text-white shadow-lg sm:px-10 sm:py-12">
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
          <Icon name="spark" className="h-3.5 w-3.5" /> Free · No login needed
        </p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          Walk into your next interview prepared.
        </h1>
        <p className="mt-3 max-w-xl text-brand-100">
          AI mock interviews, resume scoring and salary scripts, built for the Indian job market.
          From campus placements to your next lateral move.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/interview"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-brand-800 shadow hover:bg-brand-50"
          >
            Start a mock interview <Icon name="arrow" className="h-4 w-4" />
          </Link>
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 font-semibold text-white hover:bg-white/10"
          >
            Score my resume
          </Link>
        </div>
      </section>

      {GROUPS.map((g) => (
        <section key={g.title} className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">{g.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {g.tools.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 group-hover:bg-brand-100">
                  <Icon name={t.icon} />
                </span>
                <span>
                  <span className="block font-bold text-ink">{t.name}</span>
                  <span className="mt-0.5 block text-sm text-ink-soft">{t.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <FaqSection items={FAQ} />
    </>
  )
}
