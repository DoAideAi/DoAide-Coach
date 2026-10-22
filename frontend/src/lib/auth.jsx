import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { api, getToken, setToken } from './api'
import { loadSessions, mergeSessions, saveSessions } from './storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [config, setConfig] = useState({ google_client_id: '', ai_enabled: false })
  const [syncing, setSyncing] = useState(false)

  const sync = useCallback(async () => {
    if (!getToken()) return
    setSyncing(true)
    try {
      const { sessions } = await api('/api/sessions/sync', {
        method: 'POST',
        auth: true,
        body: { sessions: loadSessions() },
      })
      saveSessions(mergeSessions(loadSessions(), sessions))
    } catch (e) {
      if (e.status === 401) {
        setToken('')
        setUser(null)
      }
    } finally {
      setSyncing(false)
    }
  }, [])

  useEffect(() => {
    api('/api/config').then(setConfig).catch(() => {})
    if (getToken()) {
      api('/api/auth/me', { auth: true })
        .then(({ user }) => {
          setUser(user)
          sync()
        })
        .catch(() => setToken(''))
    }
  }, [sync])

  const signInWithCredential = useCallback(
    async (credential) => {
      const { token, user } = await api('/api/auth/google', {
        method: 'POST',
        body: { credential },
      })
      setToken(token)
      setUser(user)
      await sync()
    },
    [sync],
  )

  const signOut = useCallback(() => {
    setToken('')
    setUser(null)
    window.google?.accounts?.id?.disableAutoSelect?.()
  }, [])

  return (
    <AuthContext.Provider value={{ user, config, syncing, sync, signInWithCredential, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

const GSI_SRC = 'https://accounts.google.com/gsi/client'

function loadGsi() {
  if (window.google?.accounts?.id) return Promise.resolve()
  return new Promise((resolve, reject) => {
    let script = document.querySelector(`script[src="${GSI_SRC}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = GSI_SRC
      script.async = true
      document.head.appendChild(script)
    }
    script.addEventListener('load', () => resolve())
    script.addEventListener('error', () => reject(new Error('Google sign-in failed to load')))
  })
}

// Renders Google's own button. Shows nothing when SSO isn't configured.
export function GoogleSignInButton() {
  const { config, signInWithCredential } = useAuth()
  const ref = useRef(null)
  const [error, setError] = useState('')
  const clientId = config.google_client_id

  useEffect(() => {
    if (!clientId) return
    let cancelled = false
    loadGsi()
      .then(() => {
        if (cancelled || !ref.current) return
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (resp) => signInWithCredential(resp.credential).catch((e) => setError(e.message)),
        })
        window.google.accounts.id.renderButton(ref.current, {
          theme: 'outline',
          size: 'medium',
          shape: 'pill',
          text: 'signin',
        })
      })
      .catch((e) => setError(e.message))
    return () => {
      cancelled = true
    }
  }, [clientId, signInWithCredential])

  if (!clientId) return null
  return (
    <div>
      <div ref={ref} />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
