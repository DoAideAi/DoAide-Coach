import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ScoreChart from '../components/ScoreChart'
import Seo, { webApp } from '../components/Seo'
import { ROUTE_META } from '../routeMeta'
import { BackLink, Button, CATEGORY_LABEL, Card, PageHeader, SavedNote } from '../components/ui'
import { api } from '../lib/api'
import { GoogleSignInButton, useAuth } from '../lib/auth'
import { clearSessions, loadSessions } from '../lib/storage'
import { summarize, weakestCategory } from '../lib/stats'

const KIND = { interview: 'Mock interview', resume: 'Resume score', salary: 'Salary script' }

function Tile({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-ink">{value ?? '—'}</p>
      {sub && <p className="text-xs text-ink-muted">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const { user, syncing, signOut, config } = useAuth()
  const [sessions, setSessions] = useState(loadSessions)

  useEffect(() => {
    const refresh = () => setSessions(loadSessions())
    window.addEventListener('coach:sessions', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('coach:sessions', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const stats = summarize(sessions)
  const weak = weakestCategory(sessions)
  const interviewScores = sessions.filter((s) => s.kind === 'interview' && typeof s.score === 'number')

  const clear = async () => {
    if (!window.confirm('Delete all practice history from this browser' + (user ? ' and your account' : '') + '?')) return
    clearSessions()
    if (user) await api('/api/sessions', { method: 'DELETE', auth: true }).catch(() => {})
  }

  return (
    <>
      <Seo {...ROUTE_META['/dashboard']} jsonLd={[webApp('Interview Progress Dashboard', '/dashboard', 'Track mock interview scores and practice streaks.')]} />
      <BackLink />
      <PageHeader title="Your Progress" subtitle={user ? `Signed in as ${user.email}${syncing ? ' · syncing…' : ''}` : 'Every session counts. Here is how far you have come.'} />

      {sessions.length === 0 ? (
        <Card className="text-center">
          <p className="text-lg font-bold">No practice sessions yet</p>
          <p className="mt-1 text-ink-soft">Complete a mock interview or score your resume to start tracking progress.</p>
          <Link to="/interview" className="mt-4 inline-flex rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-800">
            Start your first mock interview
          </Link>
          <div className="mt-3"><SavedNote /></div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Tile label="Sessions" value={stats.total} sub={`${stats.activeDays} active day${stats.activeDays === 1 ? '' : 's'}`} />
            <Tile label="Avg interview" value={stats.averageInterview} sub="out of 100" />
            <Tile label="Best score" value={stats.best} sub="any session" />
            <Tile
              label="Recent trend"
              value={stats.trend === null ? '—' : `${stats.trend > 0 ? '+' : ''}${stats.trend}`}
              sub={stats.trend === null ? 'needs 4+ interviews' : 'last 3 vs previous 3'}
            />
          </div>

          {weak && (
            <Card className="!bg-brand-50 border-brand-100">
              <p className="text-sm text-brand-900">
                <strong>Focus area:</strong> your {CATEGORY_LABEL[weak] || weak} answers score lowest.{' '}
                <Link to={`/questions?category=${encodeURIComponent(weak)}`} className="font-semibold underline">Review {CATEGORY_LABEL[weak] || weak} questions</Link>.
              </p>
            </Card>
          )}

          {interviewScores.length > 0 && (
            <Card>
              <h2 className="mb-2 font-bold">Interview score over time</h2>
              <ScoreChart sessions={interviewScores} />
            </Card>
          )}

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold">All sessions</h2>
              <Button variant="ghost" onClick={clear} className="!px-2 !py-1 text-xs">Clear history</Button>
            </div>
            <ul className="divide-y divide-slate-100">
              {[...sessions].reverse().map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{s.title || KIND[s.kind]}</p>
                    <p className="text-xs text-ink-muted">
                      {KIND[s.kind]} · {new Date(s.created_at * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-ink">
                    {typeof s.score === 'number' ? `${s.score}/100` : s.details?.counter ? `Ask ₹${s.details.counter} LPA` : ''}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3"><SavedNote /></div>
          </Card>
        </div>
      )}

      {(user || config.google_client_id) && (
        <Card className="mt-4">
          <h2 className="font-bold">Sync across devices (optional)</h2>
          {user ? (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-ink-soft">
              <span>Your history is synced to {user.email}.</span>
              <Button variant="secondary" onClick={signOut}>Sign out</Button>
            </div>
          ) : (
            <>
              <p className="mt-1 text-sm text-ink-soft">Everything works without an account. Sign in with Google only if you want this history on your phone and laptop.</p>
              <div className="mt-3"><GoogleSignInButton /></div>
            </>
          )}
        </Card>
      )}
    </>
  )
}
