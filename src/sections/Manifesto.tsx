import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'
import { STATS } from '../data'

const TEXT =
  'We are a small studio that builds brands people *remember.* Identity, websites and content designed as one system, and shipped in *days, not quarters.*'

/** Words light up from dim to blush as the paragraph scrolls through the viewport. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>('.w')
      if (prefersReducedMotion()) {
        gsap.set(words, { color: 'var(--blush)' })
        gsap.set('.w.is-accent', { color: 'var(--signal)' })
        return
      }
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.manifesto p', start: 'top 80%', end: 'bottom 45%', scrub: true },
      })
      words.forEach((w, i) => {
        tl.to(w, { color: w.classList.contains('is-accent') ? 'var(--signal)' : 'var(--blush)', duration: 1, ease: 'none' }, i * 0.4)
      })

      // Count-up numbers
      gsap.utils.toArray<HTMLElement>('.stat strong').forEach((el) => {
        const target = Number(el.dataset.value)
        const decimals = Number(el.dataset.decimals ?? 0)
        const num = el.querySelector('b')!
        const o = { v: 0 }
        gsap.to(o, {
          v: target,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            num.textContent = o.v.toFixed(decimals)
          },
        })
      })
    },
    { scope: root },
  )

  // "*word*" segments render italic + accent
  const parts = TEXT.split(/(\*[^*]+\*)/).filter(Boolean)
  const words: { t: string; accent: boolean }[] = []
  parts.forEach((p) => {
    const accent = p.startsWith('*')
    p.replace(/\*/g, '')
      .split(' ')
      .filter(Boolean)
      .forEach((t) => words.push({ t, accent }))
  })

  return (
    <section ref={root} className="manifesto" aria-label="About DepoX Studio">
      <span className="eyebrow">The studio</span>
      <p style={{ marginTop: 32 }}>
        {words.map((w, i) => (
          <span key={i}>
            <span className={`w${w.accent ? ' is-accent' : ''}`}>{w.accent ? <em>{w.t}</em> : w.t}</span>{' '}
          </span>
        ))}
      </p>

      <div className="stats" style={{ marginTop: 'clamp(80px, 10vw, 160px)' }}>
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <strong data-value={s.value} data-decimals={s.decimals ?? 0}>
              <b style={{ fontWeight: 400 }}>{s.value.toFixed(s.decimals ?? 0)}</b>
              <span>{s.suffix}</span>
            </strong>
            <small>{s.label}</small>
          </div>
        ))}
      </div>
    </section>
  )
}
