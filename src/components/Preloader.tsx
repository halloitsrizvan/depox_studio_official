import { useRef, useState } from 'react'
import { gsap, useGSAP, EASE_IN_OUT, prefersReducedMotion } from '../lib/motion'
import { useSite } from '../lib/site'
import { Mark } from './Brand'

const SEEN_KEY = 'depox:intro-seen'

function seenBefore() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

/** First-visit intro: the X mark fills bottom-to-top while a counter runs, then the panel lifts. */
export function Preloader() {
  const { setReady, lenis } = useSite()
  const [done, setDone] = useState(() => prefersReducedMotion() || seenBefore())
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (done) {
        setReady(true)
        return
      }
      lenis.current?.stop()
      const counter = { v: 0 }
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem(SEEN_KEY, '1')
          } catch {
            /* storage unavailable: intro will simply replay */
          }
          lenis.current?.start()
          setDone(true)
        },
      })
      tl.fromTo('.preloader-fill', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power2.inOut' }, 0)
        .to(counter, {
          v: 100,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
          },
        }, 0)
        .from('.preloader-tag', { opacity: 0, y: 12, duration: 0.6, ease: 'power3.out' }, 0.2)
        .to('.preloader-mark', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'power3.in' }, 1.6)
        .to(['.preloader-count', '.preloader-tag'], { opacity: 0, duration: 0.3 }, 1.6)
        .add(() => setReady(true), 1.85)
        .to(root.current, { yPercent: -100, duration: 0.9, ease: EASE_IN_OUT }, 1.8)
    },
    { scope: root },
  )

  if (done) return null

  return (
    <div ref={root} className="preloader" aria-hidden="true">
      <div className="preloader-mark" style={{ position: 'relative' }}>
        <Mark color="var(--grey-1)" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <Mark className="preloader-fill" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      </div>
      <p className="preloader-tag eyebrow">Building brands that get remembered</p>
      <span ref={count} className="preloader-count">
        000
      </span>
    </div>
  )
}
