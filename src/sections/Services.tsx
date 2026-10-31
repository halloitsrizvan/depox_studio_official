import { useRef } from 'react'
import { gsap, useGSAP, revealLines, prefersReducedMotion } from '../lib/motion'
import { SERVICES } from '../data'

export function Services() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      revealLines(root.current!.querySelector('h2')!)
      gsap.utils.toArray<HTMLElement>('.service').forEach((row) => {
        gsap.from(row.querySelectorAll('.service-num, h3, p'), {
          y: 40,
          opacity: 0,
          duration: 1.1,
          stagger: 0.07,
          ease: 'expo.out',
          // hand transform back to CSS so the hover nudge on titles works
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: row, start: 'top 88%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="services" className="section" aria-labelledby="services-title">
      <div className="section-head">
        <span className="eyebrow">What we do</span>
        <h2 id="services-title" className="display">
          Branding, web design <em>&amp;</em> creative content.
        </h2>
      </div>
      <ul className="services-list">
        {SERVICES.map((s, i) => (
          <li className="service" key={s.title}>
            <div className="service-row">
              <span className="service-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
