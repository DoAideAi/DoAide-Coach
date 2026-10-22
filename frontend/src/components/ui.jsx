import { Link } from 'react-router-dom'
import Icon from './Icon'

export function BackLink({ to = '/', label = 'Home' }) {
  return (
    <Link
      to={to}
      className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-brand-700 print:hidden"
    >
      <Icon name="back" className="h-4 w-4" /> {label}
    </Link>
  )
}

export function PageHeader({ title, subtitle }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-ink-soft">{subtitle}</p>}
    </header>
  )
}

export function Card({ children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 ${className}`}>
      {children}
    </section>
  )
}

export function Field({ label, hint, children, id }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
    </label>
  )
}

export const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200'

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-brand-700 text-white hover:bg-brand-800 disabled:bg-brand-300',
    secondary: 'border border-slate-300 bg-white text-ink hover:border-brand-400 hover:text-brand-700',
    ghost: 'text-brand-700 hover:bg-brand-50',
  }
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Spinner({ label = 'Thinking…' }) {
  return (
    <span className="inline-flex items-center gap-2" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      {label}
    </span>
  )
}

export function ErrorBox({ message }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </p>
  )
}

export function scoreTone(score, max = 100) {
  const pct = (score / max) * 100
  if (pct >= 75) return { ring: '#15803d', text: 'text-green-700', label: 'Excellent' }
  if (pct >= 50) return { ring: '#1d4ed8', text: 'text-brand-700', label: 'Good' }
  return { ring: '#c2410c', text: 'text-orange-700', label: 'Keep going' }
}

export function ScoreRing({ score, max = 100, size = 112, caption }) {
  const tone = scoreTone(score, max)
  const r = 44
  const c = 2 * Math.PI * r
  const frac = Math.max(0, Math.min(1, score / max))
  return (
    <figure className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`Score ${score} out of ${max}`}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={tone.ring}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${c * frac} ${c}`}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="fill-ink text-2xl font-extrabold">
          {score}
        </text>
      </svg>
      <figcaption className={`mt-1 text-sm font-semibold ${tone.text}`}>{caption || tone.label}</figcaption>
    </figure>
  )
}

export const SITE_URL = 'https://coach.doaide.com'

export function whatsappHref(text, url = SITE_URL) {
  return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`
}

// Big green WhatsApp button. Shares a clean link (no query string) so friends land on the tool itself.
export function WhatsAppButton({ text, url, label = 'Share on WhatsApp', className = '' }) {
  const href = url ?? (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : SITE_URL)
  return (
    <a
      href={whatsappHref(text, href)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#128C7E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f63] print:hidden ${className}`}
    >
      <Icon name="whatsapp" className="h-5 w-5" /> {label}
    </a>
  )
}

export const SHARE_APP_TEXT =
  'Preparing for interviews? DoAide Coach gives free AI mock interviews, resume scoring and company-wise questions for Indian jobs. No login needed:'

export function ShareBar({ text }) {
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <WhatsAppButton text={text} />
      <WhatsAppButton text={SHARE_APP_TEXT} url={SITE_URL} label="Tell a friend" className="!bg-white !text-[#0e6f63] border border-[#128C7E] hover:!bg-green-50" />
      <Button variant="secondary" onClick={() => window.print()}>
        <Icon name="print" className="h-4 w-4" /> Print
      </Button>
    </div>
  )
}

export function BulletList({ items, tone = 'brand' }) {
  const dot = { brand: 'bg-brand-600', green: 'bg-green-600', orange: 'bg-orange-500' }[tone]
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink">
          <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

export function FaqSection({ items }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-bold">Frequently asked questions</h2>
      <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {items.map(([q, a]) => (
          <details key={q} className="group">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 p-4 font-semibold text-ink marker:hidden">
              {q}
              <Icon name="chevron" className="h-5 w-5 shrink-0 text-ink-muted transition group-open:rotate-180" />
            </summary>
            <p className="px-4 pb-4 text-sm text-ink-soft">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function SavedNote() {
  return (
    <p className="text-xs text-ink-muted">Saved in this browser, no account needed. Sign in (optional) to sync across devices.</p>
  )
}

export const INDUSTRIES = [
  ['it', 'IT & Software'],
  ['finance', 'Finance & Banking'],
  ['marketing', 'Marketing'],
  ['sales', 'Sales'],
  ['consulting', 'Consulting'],
  ['product', 'Product'],
  ['hr', 'Human Resources'],
  ['operations', 'Operations & Supply Chain'],
]

export const CATEGORY_LABEL = { behavioral: 'Behavioral', technical: 'Technical', hr: 'HR' }
