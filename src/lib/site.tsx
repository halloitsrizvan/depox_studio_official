import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, EASE_IN_OUT, prefersReducedMotion } from './motion'

type SiteContext = {
  /** true once the preloader (or its skip) has finished and page intros may play */
  ready: boolean
  setReady: (v: boolean) => void
  lenis: React.RefObject<Lenis | null>
  /** navigate to a route (optionally with #hash) behind the curtain */
  go: (to: string) => void
  scrollToHash: (hash: string, immediate?: boolean) => void
  curtain: React.RefObject<HTMLDivElement | null>
}

const Ctx = createContext<SiteContext | null>(null)

export const useSite = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useSite outside SiteProvider')
  return c
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const lenis = useRef<Lenis | null>(null)
  const curtain = useRef<HTMLDivElement | null>(null)
  const busy = useRef(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Web fonts change line wrapping (and so page height); re-measure triggers once they land.
  useEffect(() => {
    if (!document.fonts) return
    const refresh = () => ScrollTrigger.refresh()
    document.fonts.ready.then(refresh)
    document.fonts.addEventListener('loadingdone', refresh)
    return () => document.fonts.removeEventListener('loadingdone', refresh)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const l = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
    lenis.current = l
    l.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => l.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      l.destroy()
      lenis.current = null
    }
  }, [])

  const scrollToHash = useCallback((hash: string, immediate = false) => {
    const el = hash ? document.querySelector<HTMLElement>(hash) : null
    const l = lenis.current
    if (l) {
      // Lenis caches the page height; re-measure first so targets on a freshly mounted page aren't clamped.
      l.resize()
      // The menu pauses Lenis; resume it before scrolling, since a later start() would cancel the scroll.
      if (l.isStopped) l.start()
      l.scrollTo(el ?? 0, { immediate, duration: 1.4, force: true })
    } else if (el) el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
    else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  }, [])

  const go = useCallback(
    (to: string) => {
      const [path, rawHash] = to.split('#')
      const hash = rawHash ? `#${rawHash}` : ''
      const samePage = (path || location.pathname) === location.pathname
      if (samePage) {
        scrollToHash(hash)
        if (hash) history.replaceState(null, '', hash)
        return
      }
      if (busy.current) return
      const el = curtain.current
      if (!el || prefersReducedMotion()) {
        navigate(to)
        return
      }
      busy.current = true
      lenis.current?.stop()
      gsap
        .timeline()
        .set(el, { yPercent: 101, autoAlpha: 1 })
        .to(el, { yPercent: 0, duration: 0.7, ease: EASE_IN_OUT })
        .add(() => {
          void navigate(to)
        })
    },
    [location.pathname, navigate, scrollToHash],
  )

  // After each route change: jump to top or hash, then lift the curtain.
  useEffect(() => {
    const el = curtain.current
    requestAnimationFrame(() => {
      lenis.current?.start()
      ScrollTrigger.refresh()
      scrollToHash(location.hash, true)
      if (el && busy.current) {
        gsap.to(el, {
          yPercent: -101,
          duration: 0.8,
          ease: EASE_IN_OUT,
          delay: 0.1,
          onComplete: () => {
            gsap.set(el, { autoAlpha: 0 })
            busy.current = false
          },
        })
      }
    })
  }, [location.pathname, location.hash, scrollToHash])

  const value = useMemo(() => ({ ready, setReady, lenis, go, scrollToHash, curtain }), [ready, go, scrollToHash])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
