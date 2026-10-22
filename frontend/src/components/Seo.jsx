import { useEffect } from 'react'

const SITE = 'https://coach.doaide.com'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// Per-page title, description, canonical, Open Graph, Twitter and JSON-LD.
export default function Seo({ title, description, path = '/', jsonLd = [] }) {
  const ld = JSON.stringify(jsonLd)
  useEffect(() => {
    const url = `${SITE}${path}`
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', 'website')
    setMeta('name', 'twitter:card', 'summary')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

    document.head.querySelectorAll('script[data-seo-ld]').forEach((s) => s.remove())
    for (const item of JSON.parse(ld)) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.dataset.seoLd = ''
      s.textContent = JSON.stringify({ '@context': 'https://schema.org', ...item })
      document.head.appendChild(s)
    }
  }, [title, description, path, ld])
  return null
}

export function webApp(name, path, description) {
  return {
    '@type': 'WebApplication',
    name,
    url: `${SITE}${path}`,
    description,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    publisher: { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' },
  }
}

export function faq(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}
