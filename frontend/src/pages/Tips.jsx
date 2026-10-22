import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo, { faq, webApp } from '../components/Seo'
import { BackLink, Card, FaqSection, PageHeader } from '../components/ui'

const STORAGE_KEY = 'coach:tips-checked'

function loadChecked() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

const SECTIONS = [
  {
    id: 'before',
    title: 'Before the Interview',
    icon: '📋',
    items: [
      { id: 'b1', text: 'Research the company — products, recent news, culture, competitors' },
      { id: 'b2', text: 'Study the job description and match your skills to each requirement' },
      { id: 'b3', text: 'Prepare 5-6 STAR stories covering leadership, teamwork, conflict, failure' },
      { id: 'b4', text: 'Practise "Tell me about yourself" — keep it under 2 minutes' },
      { id: 'b5', text: 'Research salary range for the role on Glassdoor / AmbitionBox' },
      { id: 'b6', text: 'Prepare 3-4 thoughtful questions to ask the interviewer' },
      { id: 'b7', text: 'Print 3 copies of your resume on clean paper' },
      { id: 'b8', text: 'Plan your outfit — formal unless the company culture says otherwise' },
      { id: 'b9', text: 'Confirm interview time, location / video link, and interviewer name' },
      { id: 'b10', text: 'Get 7-8 hours of sleep the night before' },
    ],
  },
  {
    id: 'during',
    title: 'During the Interview',
    icon: '🎤',
    items: [
      { id: 'd1', text: 'Arrive 10-15 minutes early (or log in 5 minutes early for virtual)' },
      { id: 'd2', text: 'Start with a firm handshake, smile, and eye contact' },
      { id: 'd3', text: 'Listen fully before answering — it is okay to pause and think' },
      { id: 'd4', text: 'Use the STAR method for behavioral questions' },
      { id: 'd5', text: 'Keep answers under 2 minutes — be specific, not vague' },
      { id: 'd6', text: 'Quantify achievements: "increased revenue by 30%" beats "improved sales"' },
      { id: 'd7', text: 'If you don\'t know something, say so honestly and explain how you\'d find out' },
      { id: 'd8', text: 'Show enthusiasm for the role and company' },
      { id: 'd9', text: 'Take notes if the interviewer shares information about the role' },
      { id: 'd10', text: 'Ask your prepared questions when prompted' },
    ],
  },
  {
    id: 'after',
    title: 'After the Interview',
    icon: '✅',
    items: [
      { id: 'a1', text: 'Send a thank-you email within 24 hours' },
      { id: 'a2', text: 'Reference something specific from the conversation' },
      { id: 'a3', text: 'Note down questions you were asked for future prep' },
      { id: 'a4', text: 'Reflect on what went well and what to improve' },
      { id: 'a5', text: 'Follow up politely after one week if no response' },
      { id: 'a6', text: 'Continue applying elsewhere — don\'t pause your search' },
    ],
  },
  {
    id: 'virtual',
    title: 'Virtual Interview Setup',
    icon: '💻',
    items: [
      { id: 'v1', text: 'Test your camera, microphone and internet connection beforehand' },
      { id: 'v2', text: 'Choose a quiet, well-lit room with a plain background' },
      { id: 'v3', text: 'Close unnecessary tabs and applications' },
      { id: 'v4', text: 'Keep a glass of water nearby' },
      { id: 'v5', text: 'Look at the camera (not the screen) when speaking' },
      { id: 'v6', text: 'Have a backup plan: phone number to call if video fails' },
      { id: 'v7', text: 'Dress professionally from head to toe (you might need to stand)' },
    ],
  },
  {
    id: 'body',
    title: 'Body Language Tips',
    icon: '🤝',
    items: [
      { id: 'bl1', text: 'Sit up straight with shoulders relaxed' },
      { id: 'bl2', text: 'Maintain natural eye contact (look at forehead area if nervous)' },
      { id: 'bl3', text: 'Avoid crossing arms — keep hands visible and relaxed' },
      { id: 'bl4', text: 'Nod occasionally to show you are listening' },
      { id: 'bl5', text: 'Smile genuinely — it puts both you and the interviewer at ease' },
      { id: 'bl6', text: 'Avoid fidgeting with pen, hair, or phone' },
      { id: 'bl7', text: 'Mirror the interviewer\'s energy level' },
    ],
  },
  {
    id: 'mistakes',
    title: 'Common Mistakes to Avoid',
    icon: '⚠️',
    items: [
      { id: 'm1', text: 'Badmouthing previous employer or colleagues' },
      { id: 'm2', text: 'Giving vague, generic answers without examples' },
      { id: 'm3', text: 'Not asking any questions at the end' },
      { id: 'm4', text: 'Talking too much or too little' },
      { id: 'm5', text: 'Lying or exaggerating experience' },
      { id: 'm6', text: 'Discussing salary too early in the process' },
      { id: 'm7', text: 'Checking your phone during the interview' },
      { id: 'm8', text: 'Not following up after the interview' },
    ],
  },
]

const FAQ_ITEMS = [
  ['What is the STAR method?', 'STAR stands for Situation, Task, Action, Result. It is a structured way to answer behavioral questions with a concrete example from your experience.'],
  ['How should I prepare for a virtual interview?', 'Test your setup beforehand, choose a quiet well-lit room, look at the camera, and have a backup plan in case of technical issues.'],
  ['How many hours should I prepare?', 'Plan for 10-15 hours spread over a week: research (2-3h), STAR stories (3-4h), mock interviews (3-4h), and company-specific prep (2-3h).'],
]

export default function Tips() {
  const [checked, setChecked] = useState(loadChecked)

  const toggle = useCallback((id) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const totalItems = SECTIONS.reduce((s, sec) => s + sec.items.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length
  const pct = Math.round((checkedCount / totalItems) * 100)

  return (
    <>
      <Seo
        title="Interview Tips & Checklist — Complete Preparation Guide | DoAide Coach"
        description="Everything you need before, during and after an interview: checklists, body language tips, virtual setup, common mistakes, and more. Track your progress."
        path="/tips"
        jsonLd={[webApp('Interview Tips & Checklist', '/tips', 'Complete interview checklist and tips.'), faq(FAQ_ITEMS)]}
      />
      <BackLink />
      <PageHeader title="Interview Tips & Checklist" subtitle="Track your preparation with interactive checklists. Your progress is saved in this browser." />

      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">Preparation progress</p>
            <p className="text-xs text-ink-muted">{checkedCount} of {totalItems} items completed</p>
          </div>
          <span className={`text-2xl font-extrabold ${pct >= 75 ? 'text-green-700' : pct >= 40 ? 'text-brand-700' : 'text-ink-soft'}`}>
            {pct}%
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </Card>

      <div className="space-y-4">
        {SECTIONS.map((sec) => (
          <Card key={sec.id}>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-ink">
              <span>{sec.icon}</span> {sec.title}
            </h2>
            <ul className="space-y-2">
              {sec.items.map((item) => (
                <li key={item.id}>
                  <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className={`text-sm leading-relaxed ${checked[item.id] ? 'text-ink-muted line-through' : 'text-ink'}`}>
                      {item.text}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="mt-6 flex flex-col gap-3 border-brand-200 bg-brand-50/50 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-ink">Ready to practise?</h3>
          <p className="mt-0.5 text-sm text-ink-soft">Start an AI mock interview to put your preparation to the test.</p>
        </div>
        <Link
          to="/interview"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Start mock interview →
        </Link>
      </Card>

      <FaqSection items={FAQ_ITEMS} />
    </>
  )
}
