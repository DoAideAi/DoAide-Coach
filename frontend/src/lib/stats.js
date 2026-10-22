// Summary numbers for the progress dashboard.
export function summarize(sessions) {
  const scored = sessions.filter((s) => typeof s.score === 'number')
  const interviews = sessions.filter((s) => s.kind === 'interview')
  const avg = (list) =>
    list.length ? Math.round(list.reduce((t, s) => t + s.score, 0) / list.length) : null
  const scoredInterviews = interviews.filter((s) => typeof s.score === 'number')
  const recent = scoredInterviews.slice(-3)
  const earlier = scoredInterviews.slice(-6, -3)
  const trend = recent.length && earlier.length ? avg(recent) - avg(earlier) : null
  const best = scored.length ? Math.max(...scored.map((s) => s.score)) : null
  const days = new Set(sessions.map((s) => new Date(s.created_at * 1000).toDateString()))
  return {
    total: sessions.length,
    interviews: interviews.length,
    questionsAnswered: interviews.reduce((t, s) => t + (s.details?.answered || 0), 0),
    averageInterview: avg(scoredInterviews),
    best,
    trend,
    activeDays: days.size,
  }
}

export function weakestCategory(sessions) {
  const totals = {}
  for (const s of sessions) {
    for (const [cat, v] of Object.entries(s.details?.categoryScores || {})) {
      totals[cat] = totals[cat] || { sum: 0, n: 0 }
      totals[cat].sum += v
      totals[cat].n += 1
    }
  }
  const ranked = Object.entries(totals)
    .map(([cat, { sum, n }]) => [cat, sum / n])
    .sort((a, b) => a[1] - b[1])
  return ranked.length > 1 ? ranked[0][0] : null
}
