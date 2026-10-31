import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, revealLines, isFinePointer, prefersReducedMotion } from '../lib/motion'
import { TEAM } from '../data'

export function Studio() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const members = gsap.utils.toArray<HTMLElement>('.member')
      // On touch screens there is no hover, so portraits light up as they reach the middle of the screen.
      if (!isFinePointer()) {
        members.forEach((m) =>
          ScrollTrigger.create({ trigger: m, start: 'top 60%', end: 'bottom 40%', toggleClass: 'is-lit' }),
        )
      }
      if (prefersReducedMotion()) return
      revealLines(root.current!.querySelector('h2')!)
      gsap.fromTo(
        '.studio-hero',
        { clipPath: 'inset(12% 10% 12% 10%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '.studio-hero', start: 'top 90%', end: 'top 30%', scrub: true } },
      )
      gsap.fromTo(
        '.studio-hero img',
        { yPercent: -8, scale: 1.15 },
        { yPercent: 8, scale: 1, ease: 'none', scrollTrigger: { trigger: '.studio-hero', start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      revealLines(root.current!.querySelector('.studio-hero figcaption')!, { trigger: '.studio-hero' })
      members.forEach((m, i) => {
        gsap.from(m, {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: 'expo.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: '.team', start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="studio" className="section" aria-labelledby="studio-title">
      <div className="section-head">
        <span className="eyebrow">The team behind it</span>
        <h2 id="studio-title" className="display">
          Small team. <em>Full attention.</em>
        </h2>
      </div>

      <figure className="studio-hero" style={{ margin: 0 }}>
        <img src="/images/team_discuss.webp" alt="The DepoX team reviewing a website design together" loading="lazy" width={1376} height={768} />
        <figcaption>Three people. One studio.</figcaption>
      </figure>

      <div className="team">
        {TEAM.map((m) => (
          <article className="member" key={m.name} tabIndex={0}>
            <figure>
              <div className="member-photo">
                <img src={m.image} alt={`Portrait of ${m.name}`} loading="lazy" width={800} height={1000} />
              </div>
              <figcaption>
                <h3>{m.name}</h3>
                <span>{m.role}</span>
              </figcaption>
            </figure>
          </article>
        ))}
      </div>
    </section>
  )
}
