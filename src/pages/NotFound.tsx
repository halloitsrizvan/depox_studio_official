import { TLink } from '../components/TLink'

export default function NotFound() {
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
