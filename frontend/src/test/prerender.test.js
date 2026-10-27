import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { withRoute } from '../../scripts/prerender-routes.mjs'
import { ROUTE_META } from '../routeMeta'

const SHELL = readFileSync(resolve(__dirname, '../../index.html'), 'utf-8')
const SERVE = JSON.parse(readFileSync(resolve(__dirname, '../../public/serve.json'), 'utf-8'))

describe('withRoute against the real index.html', () => {
  const meta = ROUTE_META['/star-method']
  const html = withRoute(SHELL, meta)
  const url = 'https://coach.doaide.com/star-method'

  it('points the title, canonical and og:url at the route', () => {
    expect(html).toContain(`<title>${meta.title}</title>`)
    expect(html).toContain(`<link rel="canonical" href="${url}"`)
    expect(html).toContain(`<meta property="og:url" content="${url}"`)
    expect(html).not.toContain('href="https://coach.doaide.com/"')
  })

  it('writes the description into the three meta tags, the JSON-LD and the body', () => {
    expect(html.split(meta.description).length - 1).toBe(5)
  })

  it('adds JSON-LD that <Seo> will replace, and an h1 without the site suffix', () => {
    expect(html).toContain('<script type="application/ld+json" data-seo-ld>')
    expect(html).toContain('<h1>STAR Method Answer Generator for Interviews</h1>')
  })

  it('escapes markup in the description', () => {
    const out = withRoute(SHELL, { title: 'A <b> | DoAide Coach', description: 'x "y" & z', path: '/x' })
    expect(out).toContain('<h1>A &lt;b&gt;</h1>')
    expect(out).toContain('content="x &quot;y&quot; &amp; z"')
  })
})

describe('ROUTE_META and serve.json', () => {
  it('routes every app path to its own prerendered file', () => {
    const rule = SERVE.rewrites.find((r) => r.destination === '/:page/index.html')
    const routed = rule.source.match(/\(([^)]+)\)/)[1].split('|')
    const paths = Object.keys(ROUTE_META).filter((p) => p !== '/').map((p) => p.slice(1))
    expect(routed.sort()).toEqual(paths.sort())
  })
})
