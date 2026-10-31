import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { gsap, useGSAP, SplitText, revealLines, EASE, prefersReducedMotion } from '../lib/motion'
import { useSite } from '../lib/site'
import { usePageMeta } from '../lib/seo'
import { PROJECTS, waLink } from '../data'
import { Arrow, ArrowUpRight } from '../components/Brand'
import { Magnetic } from '../components/Magnetic'
import { TLink } from '../components/TLink'
import NotFound from './NotFound'

export default function CaseStudy() {
  const { slug } = useParams()
  const i = PROJECTS.findIndex((p) => p.slug === slug)
  const p = PROJECTS[i]
  const next = PROJECTS[(i + 1) % PROJECTS.length]
  const root = useRef<HTMLElement>(null)
  const { ready } = useSite()

  usePageMeta({
    title: p ? `${p.title}: ${p.subtitle} | DepoX Studio` : 'Page not found | DepoX Studio',
    description: p?.description,
    path: p ? `/work/${p.slug}` : '/404',
    noindex: !p,
  })

  useGSAP(
    () => {
      if (!p || !ready || prefersReducedMotion()) return
      SplitText.create('.case-title', {
        type: 'chars',
        mask: 'chars',
        autoSplit: true,
        onSplit: (self) => gsap.from(self.chars, { yPercent: 110, duration: 1.3, stagger: 0.035, ease: EASE, delay: 0.5 }),
      })
      gsap
        .timeline({ defaults: { ease: EASE }, delay: 0.8 })
        .from('.case-hero .case-back, .case-hero .eyebrow, .case-meta > div', { y: 20, opacity: 0, duration: 1, stagger: 0.06 })
        .fromTo('.case-shot', { clipPath: 'inset(30% 12% 0% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6 }, 0.1)
      gsap.fromTo(
        '.case-shot img',
        { yPercent: -5 },
        { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.case-shot', start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      revealLines(root.current!.querySelector('.case-body h2')!)
      revealLines(root.current!.querySelector('.case-body p')!, { stagger: 0.04, duration: 1 })
    },
    { scope: root, dependencies: [slug, ready] },
  )

  if (!p) return <NotFound />

  return (
    <main id="main" ref={root} key={p.slug}>
      <header className="case-hero">
        <TLink to="/#work" className="case-back">
          <Arrow /> All work
        </TLink>
        <span className="eyebrow">
          Case study {p.index} / {String(PROJECTS.length).padStart(2, '0')}
        </span>
        <h1 className="display case-title">{p.title}</h1>
        <dl className="case-meta">
          <div>
            <dt>Sector</dt>
            <dd>{p.sector}</dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>{p.subtitle}</dd>
          </div>
          <div>
            <dt>Live site</dt>
            <dd>
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                {p.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </a>
            </dd>
          </div>
        </dl>
      </header>

      <figure className="case-shot" style={{ marginBottom: 0 }}>
        <img src={p.image} alt={`${p.title} website homepage`} width={1600} height={900} />
      </figure>

      <section className="section case-body">
        <h2 className="display">
          The <em>brief.</em>
        </h2>
        <div>
          <p>{p.description}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Magnetic>
              <a className="btn btn-primary" href={p.url} target="_blank" rel="noopener noreferrer">
                <span>Visit the live site</span>
                <ArrowUpRight />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                className="btn btn-ghost"
                href={waLink(`Hi DepoX Studio! I saw the ${p.title} project and I'd like something similar.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Start a similar project</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </section>

      <TLink to={`/work/${next.slug}`} className="case-next" data-cursor="view">
        <span className="eyebrow">Next project</span>
        <span className="display" style={{ display: 'block' }}>
          {next.title}
        </span>
      </TLink>
    </main>
  )
}
