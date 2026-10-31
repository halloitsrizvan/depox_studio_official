import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'
import { useSite } from '../lib/site'
import { CONTACT, PROJECTS, waLink } from '../data'
import { Wordmark } from '../components/Brand'
import { TLink } from '../components/TLink'

export function Footer() {
  const root = useRef<HTMLElement>(null)
  const { scrollToHash } = useSite()

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // The wordmark rises out of the floor: "depox" first, then "studio".
      gsap.from('.footer-word path', {
        yPercent: 105,
        duration: 1.4,
        stagger: 0.15,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.footer-word', start: 'top 95%', once: true },
      })
    },
    { scope: root },
  )

  return (
    <footer ref={root} className="footer">
      <div className="footer-top">
        <p>Building brands that get remembered.</p>
        <div className="footer-col">
          <h4>Work</h4>
          {PROJECTS.map((p) => (
            <TLink key={p.slug} to={`/work/${p.slug}`}>
              {p.title}
            </TLink>
          ))}
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href={`mailto:${CONTACT.email}`}>Email</a>
          <a href={waLink('Hi DepoX Studio!')} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </div>
      <div style={{ overflow: 'clip' }}>
        <Wordmark className="footer-word" title="DepoX Studio" />
      </div>
      <div className="footer-bottom">
        <span>© 2026 DepoX Studio. Kerala, India.</span>
        <button onClick={() => scrollToHash('')}>Back to top ↑</button>
      </div>
    </footer>
  )
}
