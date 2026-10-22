import { Component } from 'react'

// A render crash shows a way out instead of a blank page. Practice history is in
// localStorage, so a reload is safe.
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Coach crashed', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    // A stale tab after a deploy can't fetch old page chunks; a reload picks up the new ones.
    const chunk = /dynamically imported module|Loading chunk|Importing a module script failed/i.test(String(this.state.error?.message))
    return (
      <div role="alert" className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-ink">{chunk ? 'A new version is available' : 'Something went wrong'}</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {chunk ? 'Reload to get the latest DoAide Coach.' : 'Your practice history is safe in this browser. Reload the page to continue.'}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button type="button" onClick={() => window.location.reload()} className="min-h-11 rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800">
            Reload
          </button>
          <a href="/" className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-ink">
            Home
          </a>
        </div>
      </div>
    )
  }
}
