import { useRef } from 'react'
import { gsap, useGSAP, SplitText, EASE, isFinePointer, prefersReducedMotion } from '../lib/motion'
import { useSite } from '../lib/site'
import { SERVICES, waLink } from '../data'
import { Mark, Arrow } from '../components/Brand'
import { Magnetic } from '../components/Magnetic'
import { TLink } from '../components/TLink'

const ECHOES = 3

export function Hero() {
  const { ready } = useSite()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduce = prefersReducedMotion()
      const title = root.current!.querySelector('.hero-title')!
      const echoes = gsap.utils.toArray<HTMLElement>('.echo')

      if (!ready) {
        gsap.set(root.current, { autoAlpha: 0 })
        return
      }
      gsap.set(root.current, { autoAlpha: 1 })
      if (reduce) return

      // Intro
      const split = SplitText.create(title, { type: 'lines', mask: 'lines', autoSplit: true })
      const tl = gsap.timeline({ defaults: { ease: EASE } })
      tl.from(split.lines, { yPercent: 115, duration: 1.4, stagger: 0.1 })
        .fromTo('.hero-mark', { clipPath: 'inset(50% 0 50% 0)', scale: 1.15 }, { clipPath: 'inset(0% 0 0% 0)', scale: 1, duration: 1.6 }, 0.1)
        .from(echoes, { opacity: 0, duration: 1 }, 0.9)
        .from('.hero-sub > *', { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, 0.6)
        .from('.marquee', { yPercent: 100, opacity: 0, duration: 1 }, 0.8)

      // Afterimage: outlined copies of "remembered." trail the pointer at increasing lag.
      const wrap = root.current!.querySelector<HTMLElement>('.word-remembered')!
      const movers = echoes.map((el, i) => ({
        x: gsap.quickTo(el, 'x', { duration: 0.5 + i * 0.35, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 0.5 + i * 0.35, ease: 'power3.out' }),
      }))
      // resting offset so the echoes read even before the pointer moves
      echoes.forEach((el, i) => gsap.set(el, { x: (i + 1) * 10, y: (i + 1) * -6 }))

      // X mark: tilts toward the pointer
      const markX = gsap.quickTo('.hero-mark', 'rotationY', { duration: 1.2, ease: 'power3.out' })
      const markY = gsap.quickTo('.hero-mark', 'rotationX', { duration: 1.2, ease: 'power3.out' })

      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        markX(nx * 28)
        markY(-ny * 18)
        const r = wrap.getBoundingClientRect()
        const dx = gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / 600)
        const dy = gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height / 2)) / 400)
        movers.forEach((m, i) => {
          m.x(-dx * (i + 1) * 18)
          m.y(-dy * (i + 1) * 12)
        })
      }
      if (isFinePointer()) window.addEventListener('pointermove', onMove, { passive: true })

      // Scroll: the X twists like a ribbon (scaleX through zero) and drifts away; copy lifts.
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 } })
        .to('.hero-mark-spin', { scaleX: -1, yPercent: 18, ease: 'none' }, 0)
        .to('.hero-copy', { yPercent: -18, opacity: 0.2, ease: 'none' }, 0)

      // Marquee: constant drift, nudged by scroll velocity.
      const track = root.current!.querySelector<HTMLElement>('.marquee-track')!
      const loop = gsap.to(track, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300)
            gsap.to(loop, { timeScale: 1 + Math.abs(v), duration: 0.3, overwrite: true })
            gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.3 })
          },
        },
      })

      return () => window.removeEventListener('pointermove', onMove)
    },
    { scope: root, dependencies: [ready] },
  )

  const marquee = SERVICES.map((s) => s.title)

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero-mark-wrap" aria-hidden="true">
        <div className="hero-mark-spin" style={{ width: '100%', height: '100%' }}>
          <div className="hero-mark">
            <Mark />
          </div>
        </div>
      </div>

      <div className="hero-copy">
        <h1 id="hero-title" className="display hero-title">
          Building brands that get{' '}
          <span className="word-remembered">
            {Array.from({ length: ECHOES }, (_, i) => (
              <em key={i} className="echo" aria-hidden="true" style={{ opacity: 0.55 - i * 0.16 }}>
                remembered.
              </em>
            ))}
            <em style={{ position: 'relative' }}>remembered.</em>
          </span>
        </h1>
        <div className="hero-sub">
          <p>DepoX Studio is a branding and web design studio from Kerala. Identity, websites and creative content, built to stay in people's heads.</p>
          <div className="hero-actions">
            <Magnetic>
              <a className="btn btn-primary" href={waLink("Hi DepoX Studio! I'd like to start a project.")} target="_blank" rel="noopener noreferrer">
                <span>Start a project</span>
                <Arrow />
              </a>
            </Magnetic>
            <Magnetic>
              <TLink to="/#work" className="btn btn-ghost">
                <span>See the work</span>
              </TLink>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div key={k} style={{ display: 'flex' }}>
              {marquee.map((t) => (
                <span key={t} className="marquee-item">
                  {t}
                  <Mark />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
