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
      className="rounded-lg px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50 print:hidden"
    >
      {copied ? 'Copied!' : label}
    </button>
  )
}
