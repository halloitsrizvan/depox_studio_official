import { TLink } from '../components/TLink'
import { usePageMeta } from '../lib/seo'

export default function NotFound() {
  usePageMeta({ title: 'Page not found | DepoX Studio', path: '/404', noindex: true })
  return (
    <main id="main" className="not-found">
      <h1 className="display">
        Lost the <em>thread.</em>
      </h1>
      <p style={{ color: 'var(--grey-3)', margin: 0 }}>This page doesn't exist, but the rest of the studio does.</p>
      <TLink to="/" className="btn btn-primary">
        <span>Back to home</span>
      </TLink>
    </main>
  )
}
