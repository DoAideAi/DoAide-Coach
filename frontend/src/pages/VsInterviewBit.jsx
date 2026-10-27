import { Link } from 'react-router-dom'
import Seo, { faq, webApp } from '../components/Seo'
import { ROUTE_META } from '../routeMeta'
import { BackLink, Card, FaqSection, PageHeader, WhatsAppButton } from '../components/ui'

const FAQ = [
  [
    'Is DoAide Coach a replacement for InterviewBit?',
    'They solve different problems. InterviewBit is built around structured coding and DSA preparation with learning tracks. DoAide Coach is built around the interview conversation itself: AI mock interviews with instant feedback, STAR answers, self-introductions and salary negotiation. Many candidates use both.',
  ],
  [
    'Which one should I use for HR and behavioral rounds?',
    'DoAide Coach. It generates role-specific behavioral, HR, situational and managerial questions, times your answers, and gives instant AI feedback on each one — all free and without login.',
  ],
  [
    'Which one should I use for coding rounds?',
    'A dedicated coding platform like InterviewBit, LeetCode or similar is the right tool for DSA practice. Use DoAide Coach alongside it for the non-coding rounds that actually decide offers: behavioral, HR and salary discussion.',
  ],
  [
    'Is DoAide Coach really free?',
    'Yes. Every tool — mock interviews, resume scoring, the question bank, salary negotiation and the STAR generator — is free and works without creating an account.',
  ],
]

const ROWS = [
  ['Best for', 'Mock interview practice with AI feedback (behavioral, technical, HR, situational, managerial)', 'Structured coding / DSA learning tracks'],
  ['AI mock interviews with instant feedback', '✅ Yes, unlimited and free', '— Not the core focus'],
  ['Behavioral & HR round preparation', '✅ Dedicated tools: question bank, STAR generator, self-intro writer', 'Limited — focus is technical'],
  ['Coding / DSA problem practice', '— Not offered; pair Coach with a coding platform', '✅ Extensive problem sets and tracks'],
  ['Salary negotiation help', '✅ AI negotiator with scripts for Indian salary talks', '— Not offered'],
  ['Login required', '✅ No login needed for any tool', 'Account required'],
  ['Answer timer & practice history', '✅ Built in, saved on your device', 'Progress tied to your account'],
  ['Price', '✅ 100% free', 'Free tracks; some programs have eligibility steps'],
]

export default function VsInterviewBit() {
  return (
    <>
      <Seo
        {...ROUTE_META['/coach-vs-interviewbit']}
        jsonLd={[
          webApp('DoAide Coach vs InterviewBit comparison', '/coach-vs-interviewbit', 'Comparison of DoAide Coach and InterviewBit for interview preparation.'),
          faq(FAQ),
        ]}
      />
      <BackLink />
      <PageHeader
        title="DoAide Coach vs InterviewBit"
        subtitle="Two different jobs: InterviewBit teaches you to crack coding rounds; DoAide Coach makes you better at the interview conversation itself. Here is an honest side-by-side."
      />

      <Card className="mt-2 overflow-x-auto p-0">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="bg-brand-700 text-left text-white">
              <th className="px-4 py-3 font-semibold" scope="col">What you need</th>
              <th className="px-4 py-3 font-semibold" scope="col">DoAide Coach</th>
              <th className="px-4 py-3 font-semibold" scope="col">InterviewBit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ROWS.map(([label, coach, ib]) => (
              <tr key={label} className="odd:bg-white even:bg-brand-50/40 align-top">
                <th scope="row" className="px-4 py-3 text-left font-semibold text-ink">{label}</th>
                <td className="px-4 py-3 text-ink-soft">{coach}</td>
                <td className="px-4 py-3 text-ink-soft">{ib}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="mt-2 text-xs text-ink-muted">
        InterviewBit details reflect its public positioning as a coding-interview learning platform and may change; check their site for current offerings.
      </p>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="font-bold text-ink">Choose DoAide Coach when…</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-soft">
            <li>Your interview is days away and you need realistic mock practice now, without signing up.</li>
            <li>You freeze on &quot;Tell me about a time…&quot; questions and need STAR-structured answers.</li>
            <li>You want feedback on your spoken answers, an answer timer and a record of your practice.</li>
            <li>You have an offer coming and need a salary negotiation script for the HR call.</li>
          </ul>
        </Card>
        <Card>
          <h2 className="font-bold text-ink">Choose InterviewBit when…</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-soft">
            <li>Your weak spot is data structures and algorithms, not the conversation.</li>
            <li>You have weeks or months and want a structured, gamified learning track.</li>
            <li>You are targeting companies whose screening rounds are heavy on coding tests.</li>
          </ul>
        </Card>
      </section>

      <Card className="mt-6 bg-brand-50/60 text-center">
        <h2 className="text-lg font-bold text-ink">Try a free AI mock interview now</h2>
        <p className="mx-auto mt-1 max-w-xl text-sm text-ink-soft">
          Pick your role and round — behavioral, technical, HR, situational or managerial — answer against the timer and get instant feedback. No login, no payment.
        </p>
        <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Link
            to="/interview"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
          >
            Start a mock interview →
          </Link>
          <WhatsAppButton text="Comparing interview prep tools? Honest DoAide Coach vs InterviewBit breakdown:" />
        </div>
      </Card>

      <FaqSection items={FAQ} />
    </>
  )
}
