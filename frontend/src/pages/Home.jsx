import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Seo, { faq, webApp } from '../components/Seo'
import QuickStart from '../components/QuickStart'
import { FaqSection, SHARE_APP_TEXT, SITE_URL, WhatsAppButton } from '../components/ui'

// The three core tools sit right under the hero so nobody has to scroll or sign in to find them.
const PRIMARY = [
  { to: '/interview', icon: 'mic', name: 'AI Mock Interview', desc: 'Pick a role and company. Answer one question at a time and get a rating, tips and a model answer.', cta: 'Start practising' },
  { to: '/resume', icon: 'doc', name: 'Resume Scorer', desc: 'Paste your resume and a job description to get a match score, missing keywords and fixes.', cta: 'Score my resume' },
  { to: '/questions', icon: 'book', name: 'Question Bank', desc: 'Behavioral, technical and HR questions asked at TCS, Infosys, Flipkart, HDFC Bank and more.', cta: 'Browse questions' },
]

const MORE = [
  { to: '/tell-me-about-yourself', icon: 'spark', name: '"Tell Me About Yourself" Writer', desc: 'Turn your degree, skills and one achievement into a confident 60-second self-introduction.' },
  { to: '/star-method', icon: 'star', name: 'STAR Answer Generator', desc: 'Turn a rough story into a structured Situation-Task-Action-Result answer with a measurable ending.' },
  { to: '/salary', icon: 'rupee', name: 'Salary Negotiator', desc: 'Enter your CTC and offer to get a counter-offer number and a word-for-word script.' },
  { to: '/dashboard', icon: 'chart', name: 'Progress Dashboard', desc: 'See your interview scores improve across practice sessions, and spot your weak areas.' },
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
      <section className="rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 px-5 py-7 text-white shadow-lg sm:px-10 sm:py-10">
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
          <Icon name="spark" className="h-3.5 w-3.5" /> 100% free · No login needed
        </p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          Walk into your next interview prepared.
        </h1>
        <p className="mt-3 max-w-xl text-brand-100">
          AI mock interviews, resume scoring and salary scripts, built for the Indian job market.
          From campus placements to your next lateral move.
        </p>
        <Link
          to="/interview"
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-brand-800 shadow hover:bg-brand-50 sm:w-auto"
        >
          Start a free mock interview <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </section>

      <QuickStart />

      <section className="mt-6" aria-labelledby="tools-title">
        <h2 id="tools-title" className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">Start here</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {PRIMARY.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md active:bg-brand-50 md:flex-col md:gap-3"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 group-hover:bg-brand-100">
                <Icon name={t.icon} className="h-6 w-6" />
              </span>
              <span className="flex flex-1 flex-col">
                <span className="block font-bold text-ink">{t.name}</span>
                <span className="mt-0.5 block flex-1 text-sm text-ink-soft">{t.desc}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                  {t.cta} <Icon name="arrow" className="h-4 w-4" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">More tools</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {MORE.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md active:bg-brand-50"
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

      <section className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="font-bold text-ink">Preparing with friends?</h2>
          <p className="text-sm text-ink-soft">Share DoAide Coach with your placement or job-hunt WhatsApp group.</p>
        </div>
        <WhatsAppButton text={SHARE_APP_TEXT} url={SITE_URL} label="Share on WhatsApp" className="w-full sm:w-auto" />
      </section>

      <FaqSection items={FAQ} />
    </>
  )
}
