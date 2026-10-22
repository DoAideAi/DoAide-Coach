import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <Seo title="Page not found | DoAide Coach" description="This page does not exist." path="/404" />
      <h1 className="text-3xl font-extrabold">Page not found</h1>
      <p className="mt-2 text-ink-soft">Let's get you back to practising.</p>
      <Link to="/" className="mt-6 inline-flex rounded-xl bg-brand-700 px-5 py-3 font-semibold text-white">Go home</Link>
    </div>
  )
}
