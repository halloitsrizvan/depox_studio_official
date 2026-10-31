import { useRef, useState } from 'react'
import { gsap, useGSAP, SplitText, revealLines, prefersReducedMotion } from '../lib/motion'
import { TESTIMONIALS } from '../data'
import { Arrow } from '../components/Brand'

export function Testimonials() {
  const root = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const animating = useRef(false)
  const touchX = useRef<number | null>(null)

  const { contextSafe } = useGSAP(
    () => {
      if (prefersReducedMotion()) return
      revealLines(root.current!.querySelector('h2')!)
    },
    { scope: root },
  )

  const show = contextSafe((next: number) => {
    const n = (next + TESTIMONIALS.length) % TESTIMONIALS.length
    if (n === index || animating.current) return
    const quotes = gsap.utils.toArray<HTMLElement>('.quote')
    const from = quotes[index]
    const to = quotes[n]
    if (prefersReducedMotion()) {
      setIndex(n)
      return
    }
    animating.current = true
    const dir = next > index ? 1 : -1
    const outLines = SplitText.create(from.querySelector('blockquote'), { type: 'lines', mask: 'lines' })
    gsap
      .timeline({
        onComplete: () => {
          outLines.revert()
          animating.current = false
        },
      })
      .to(outLines.lines, { yPercent: -110 * dir, duration: 0.45, stagger: 0.04, ease: 'power3.in' })
      .to(from.querySelector('figcaption'), { opacity: 0, duration: 0.3 }, 0)
      .add(() => {
        setIndex(n)
        const inLines = SplitText.create(to.querySelector('blockquote'), { type: 'lines', mask: 'lines' })
        gsap
          .timeline({ onComplete: () => inLines.revert() })
          .from(inLines.lines, { yPercent: 110 * dir, duration: 0.9, stagger: 0.06, ease: 'expo.out' })
          .fromTo(to.querySelector('figcaption'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0.2)
      })
  })

  return (
    <section ref={root} className="section" aria-labelledby="quotes-title">
      <div className="section-head">
        <span className="eyebrow">What they say</span>
        <h2 id="quotes-title" className="display">
          Don't take <em>our word</em> for it.
        </h2>
      </div>
      <div className="quotes">
        <div
          className="quote-stage"
          aria-live="polite"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            touchX.current = null
            if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1))
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <figure key={t.name} className={`quote${i === index ? ' is-active' : ''}`} aria-hidden={i !== index}>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="quote-controls">
          <button className="quote-btn" onClick={() => show(index - 1)} aria-label="Previous testimonial">
            <Arrow style={{ transform: 'rotate(180deg)' }} />
          </button>
          <button className="quote-btn" onClick={() => show(index + 1)} aria-label="Next testimonial">
            <Arrow />
          </button>
          <span className="quote-count">
            {String(index + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  )
}
