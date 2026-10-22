import { Link, NavLink, Outlet } from 'react-router-dom'
import { GoogleSignInButton, useAuth } from '../lib/auth'
import Icon from './Icon'
import { SHARE_APP_TEXT, SITE_URL, WhatsAppButton } from './ui'

export const NAV = [
  { to: '/interview', label: 'Interview', icon: 'mic' },
  { to: '/resume', label: 'Resume', icon: 'doc' },
  { to: '/questions', label: 'Questions', icon: 'book' },
  { to: '/salary', label: 'Salary', icon: 'rupee' },
  { to: '/dashboard', label: 'Progress', icon: 'chart' },
]

function AccountArea() {
  const { user, signOut } = useAuth()
  if (user) {
    return (
      <div className="flex items-center gap-2">
        {user.picture && (
          <img src={user.picture} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
        )}
        <button onClick={signOut} className="min-h-11 px-2 text-sm font-medium text-ink-soft hover:text-brand-700">
          Sign out
        </button>
      </div>
    )
  }
  return <GoogleSignInButton />
}

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white pb-28 pt-8 md:pb-8 print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 text-center text-sm text-ink-muted">
        <a
          href="https://doaide.com"
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800 hover:bg-brand-100"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
          A DoAide Product
        </a>
        <p>Free AI interview prep and career coaching for Indian job seekers.</p>
        <WhatsAppButton text={SHARE_APP_TEXT} url={SITE_URL} label="Share DoAide Coach on WhatsApp" />
        {/* Plain link: /guides is static HTML outside the SPA. */}
        <a href="/guides" className="inline-flex min-h-11 items-center font-semibold text-brand-700 hover:underline">
          Interview &amp; salary guides
        </a>
        <p>&copy; {new Date().getFullYear()} DoAide. AI feedback is guidance, not a guarantee.</p>
      </div>
    </footer>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-ink">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur print:hidden">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-brand-800">
            <img src="/favicon.svg" alt="" className="h-7 w-7" />
            <span>
              DoAide <span className="text-brand-600">Coach</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:text-brand-700'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          {/* Sign-in is optional (sync only), so keep it out of the way on phones; Progress page offers it there. */}
          <div className="hidden sm:block">
            <AccountArea />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <Footer />

      <nav
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden print:hidden"
        aria-label="Mobile"
      >
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `flex min-h-14 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium ${
                isActive ? 'text-brand-700' : 'text-ink-muted'
              }`
            }
          >
            <Icon name={n.icon} className="h-5 w-5" />
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
