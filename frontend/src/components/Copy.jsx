import { useState } from 'react'

export default function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked; user can select manually */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="min-h-10 rounded-lg px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50 print:hidden"
    >
      {copied ? 'Copied!' : label}
    </button>
  )
}
