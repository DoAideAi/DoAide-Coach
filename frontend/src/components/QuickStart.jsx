import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'

const KEY = 'coach.quickstart.dismissed'

const STEPS = [
  { title: 'Pick a tool', body: 'No sign-up. Start with a mock interview, or paste your resume and a Naukri/LinkedIn job post.', to: '/interview', cta: 'Open mock interview' },
  { title: 'Type your answers', body: 'Answer like you would speak in the interview. Aim for 100-200 words. Tap "Show hint" if stuck.', to: '/questions', cta: 'Browse questions first' },
  { title: 'Read the feedback', body: 'Every answer gets a score out of 10, what worked, what to fix and a model answer.', to: '/resume', cta: 'Or score your resume' },
  { title: 'Track and share', body: 'Scores are saved in this browser on the Progress tab. Share your result with friends on WhatsApp.', to: '/dashboard', cta: 'See progress' },
]

function isDismissed() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

// First-visit guide on the home page. Dismissal is remembered per browser; "How it works" re-opens it.
export default function QuickStart() {
  const [open, setOpen] = useState(() => !isDismissed())

  const toggle = (next) => {
    setOpen(next)
    try {
      if (next) localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, '1')
    } catch {
      /* private mode: guide just reappears next visit */
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => toggle(true)}
        className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
      >
        <Icon name="spark" className="h-4 w-4" /> How it works
      </button>
    )
  }

  return (
    <section aria-labelledby="quickstart-title" className="mt-6 rounded-2xl border border-brand-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="quickstart-title" className="text-lg font-bold text-ink">New here? Get started in 2 minutes</h2>
          <p className="mt-0.5 text-sm text-ink-soft">Free for everyone. Works on any phone. No account needed.</p>
        </div>
        <button
          type="button"
          onClick={() => toggle(false)}
          aria-label="Close quick-start guide"
          className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink-muted hover:bg-slate-100"
        >
          <Icon name="close" />
        </button>
      </div>
      <ol className="mt-4 grid gap-3 sm:grid-cols-2">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-3 rounded-xl bg-slate-50 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold text-ink">{s.title}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{s.body}</p>
              <Link to={s.to} className="mt-1 inline-flex min-h-10 items-center text-sm font-semibold text-brand-700">
                {s.cta} →
              </Link>
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => toggle(false)}
        className="mt-4 min-h-11 w-full rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800 sm:w-auto"
      >
        Got it
      </button>
    </section>
  )
}
