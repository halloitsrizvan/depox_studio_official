import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, EASE, EASE_IN_OUT } from '../lib/motion'
import { useSite } from '../lib/site'
import { CONTACT, waLink } from '../data'
import { Wordmark, Arrow } from './Brand'
import { TLink } from './TLink'

const LINKS = [
  { to: '/#work', label: 'Work' },
  { to: '/#services', label: 'Services' },
  { to: '/#process', label: 'Process' },
  { to: '/#studio', label: 'Studio' },
  { to: '/#contact', label: 'Contact' },
]

export function Nav() {
  const { lenis, ready } = useSite()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const nav = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 40)
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 300)
        last = y
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useGSAP(() => {
    if (!ready) return
    // The nav has its own CSS transform transition (hide on scroll); keep it out of the intro tween.
    gsap.fromTo(
      nav.current,
      { yPercent: -100, autoAlpha: 0, transition: 'none' },
      { yPercent: 0, autoAlpha: 1, duration: 1, ease: EASE, delay: 0.3, clearProps: 'transform,opacity,visibility,transition' },
    )
  }, [ready])

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { visibility: 'visible' })
        .fromTo(menu.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: EASE_IN_OUT })
        .from('.menu li a', { yPercent: 100, opacity: 0, stagger: 0.06, duration: 0.8, ease: EASE }, 0.3)
        .from('.menu-foot', { opacity: 0, duration: 0.5 }, 0.5)
    },
    { scope: menu },
  )

  const touched = useRef(false)
  useEffect(() => {
    if (!tl.current) return
    if (!open && !touched.current) return
    touched.current = true
    if (open) {
      lenis.current?.stop()
      tl.current.timeScale(1).play()
    } else {
      lenis.current?.start()
      tl.current.timeScale(1.6).reverse()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lenis])

  return (
    <>
      <header ref={nav} className={`nav${hidden && !open ? ' is-hidden' : ''}${solid && !open ? ' is-solid' : ''}`}>
        <TLink to="/" className="nav-logo" aria-label="DepoX Studio, home" onNavigate={() => setOpen(false)}>
          <Wordmark title="DepoX Studio" />
        </TLink>
        <nav aria-label="Primary">
          <ul className="nav-links">
            {LINKS.map((l) => (
              <li key={l.to}>
                <TLink to={l.to}>{l.label}</TLink>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn-primary" href={waLink("Hi DepoX Studio! I'd like to start a project.")} target="_blank" rel="noopener noreferrer">
          <span>Start a project</span>
          <Arrow />
        </a>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </header>

      <div ref={menu} id="site-menu" className="menu" aria-hidden={!open}>
        <ul>
          {LINKS.map((l, i) => (
            <li key={l.to} className="line-mask">
              <TLink to={l.to} tabIndex={open ? 0 : -1} onNavigate={() => setOpen(false)}>
                <small>0{i + 1}</small>
                {l.label}
              </TLink>
            </li>
          ))}
        </ul>
        <div className="menu-foot">
          <a href={`mailto:${CONTACT.email}`} tabIndex={open ? 0 : -1}>
            {CONTACT.email}
          </a>
          <a href={waLink('Hi DepoX Studio!')} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
            WhatsApp {CONTACT.phoneDisplay}
          </a>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
            Instagram {CONTACT.instagramHandle}
          </a>
        </div>
      </div>
    </>
  )
}
