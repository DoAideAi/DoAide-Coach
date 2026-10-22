import { useState } from 'react'

const W = 640
const H = 220
const PAD = { top: 16, right: 16, bottom: 28, left: 36 }

export function chartPoints(sessions, width = W, height = H) {
  const n = sessions.length
  const iw = width - PAD.left - PAD.right
  const ih = height - PAD.top - PAD.bottom
  return sessions.map((s, i) => ({
    x: PAD.left + (n === 1 ? iw / 2 : (i / (n - 1)) * iw),
    y: PAD.top + ih - (s.score / 100) * ih,
    session: s,
  }))
}

// Single-series line of scores (0-100) over practice sessions, with a hover tooltip.
export default function ScoreChart({ sessions, label = 'Interview score' }) {
  const [hover, setHover] = useState(null)
  if (sessions.length === 0) return null
  const pts = chartPoints(sessions)
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const ih = H - PAD.top - PAD.bottom

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    let best = 0
    pts.forEach((p, i) => {
      if (Math.abs(p.x - x) < Math.abs(pts[best].x - x)) best = i
    })
    setHover(best)
  }

  const hp = hover !== null ? pts[hover] : null
  return (
    <figure className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${label} across ${sessions.length} sessions`}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {[0, 50, 100].map((v) => {
          const y = PAD.top + ih - (v / 100) * ih
          return (
            <g key={v}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
              <text x={PAD.left - 8} y={y} textAnchor="end" dominantBaseline="central" fontSize="11" fill="#64748b">
                {v}
              </text>
            </g>
          )
        })}
        <text x={PAD.left} y={H - 6} fontSize="11" fill="#64748b">Oldest</text>
        <text x={W - PAD.right} y={H - 6} fontSize="11" fill="#64748b" textAnchor="end">Latest</text>
        {hp && <line x1={hp.x} x2={hp.x} y1={PAD.top} y2={PAD.top + ih} stroke="#94a3b8" strokeDasharray="3 3" />}
        <path d={path} fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <circle key={p.session.id} cx={p.x} cy={p.y} r={hover === i ? 6 : 4} fill="#1d4ed8" stroke="#fff" strokeWidth="2" />
        ))}
        <rect x="0" y="0" width={W} height={H} fill="transparent" />
      </svg>
      {hp && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-md"
          style={{ left: `${(hp.x / W) * 100}%`, top: `${(hp.y / H) * 100}%`, marginTop: -10 }}
          role="tooltip"
        >
          <p className="font-bold text-ink">{hp.session.score}/100</p>
          <p className="text-ink-soft">{hp.session.title}</p>
          <p className="text-ink-muted">{new Date(hp.session.created_at * 1000).toLocaleDateString('en-IN')}</p>
        </div>
      )}
      <figcaption className="sr-only">{label} chart. The session list below shows the same data.</figcaption>
    </figure>
  )
}
