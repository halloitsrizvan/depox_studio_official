import { useRef } from 'react'
import { gsap, useGSAP, revealLines, prefersReducedMotion } from '../lib/motion'
import { PROJECTS, waLink } from '../data'
import { Arrow } from '../components/Brand'
import { Magnetic } from '../components/Magnetic'
import { TLink } from '../components/TLink'

export function Work() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const section = root.current!
      const pinEl = section.querySelector<HTMLElement>('.work-pin')!
      const track = section.querySelector<HTMLElement>('.work-track')!
      revealLines(section.querySelector('.work-intro h2')!)

      const mm = gsap.matchMedia()

      mm.add('(min-width: 901px)', () => {
        const distance = () => track.scrollWidth - window.innerWidth
        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pinEl,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        gsap.to('.work-progress span', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: pinEl, start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })
        // Each image pans inside its frame while the track moves.
        gsap.utils.toArray<HTMLElement>('.work-media img').forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: 5 },
            {
              xPercent: -5,
              ease: 'none',
              scrollTrigger: { trigger: img.parentElement, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true },
            },
          )
        })
        gsap.utils.toArray<HTMLElement>('.work-card, .work-end').forEach((card) => {
          gsap.from(card.querySelectorAll('.work-meta > *, .work-end > *'), {
            y: 30,
            opacity: 0,
            stagger: 0.06,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, containerAnimation: scroll, start: 'left 85%' },
          })
        })
      })

      mm.add('(max-width: 900px)', () => {
        gsap.utils.toArray<HTMLElement>('.work-media').forEach((m) => {
          gsap.fromTo(
            m,
            { clipPath: 'inset(18% 8% 18% 8%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: m, start: 'top 95%', end: 'top 45%', scrub: true } },
          )
          gsap.fromTo(
            m.querySelector('img'),
            { yPercent: -4 },
            { yPercent: 4, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="work" className="work section" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }} aria-labelledby="work-title">
      <div className="work-intro section-head">
        <span className="eyebrow">Selected work · {String(PROJECTS.length).padStart(2, '0')}</span>
        <h2 id="work-title" className="display">
          Work that gets <em>remembered.</em>
        </h2>
      </div>

      <div className="work-pin">
      <div className="work-track">
        {PROJECTS.map((p) => (
          <article className="work-card" key={p.slug}>
            <TLink to={`/work/${p.slug}`} data-cursor="view" aria-label={`${p.title}: view case study`}>
              <div className="work-media">
                <img src={p.image} alt={`${p.title} website homepage`} loading="lazy" width={1600} height={900} />
              </div>
            </TLink>
            <div className="work-meta">
              <span className="idx">{p.index}</span>
              <h3>
                <TLink to={`/work/${p.slug}`}>{p.title}</TLink>
              </h3>
              <p>
                {p.sector}
                <br />
                {p.subtitle}
              </p>
            </div>
          </article>
        ))}
        <div className="work-end">
          <h3>
            Your brand
            <br />
            could be <em style={{ color: 'var(--signal)' }}>next.</em>
          </h3>
          <Magnetic>
            <a className="btn btn-primary" href={waLink("Hi DepoX Studio! I'd like to start a project.")} target="_blank" rel="noopener noreferrer">
              <span>Start a project</span>
              <Arrow />
            </a>
          </Magnetic>
        </div>
      </div>
      <div className="work-progress" aria-hidden="true">
        <span />
      </div>
      </div>
    </section>
  )
}
