import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap, useGSAP, isFinePointer } from '../lib/motion'

/** A trailing ring that becomes a "View" disc over [data-cursor="view"] and grows over links. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  // The page under a still pointer changes on navigation, so drop the hover state.
  useEffect(() => {
    ref.current?.classList.remove('is-view', 'is-link')
  }, [pathname])

  useGSAP(() => {
    const el = ref.current
    if (!el || !isFinePointer()) return
    gsap.set(el, { x: -100, y: -100 })
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' })

    const move = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      const t = e.target as Element | null
      const view = t?.closest?.('[data-cursor="view"]')
      const link = !view && t?.closest?.('a, button, [role="button"], input, textarea, label')
      el.classList.toggle('is-view', !!view)
      el.classList.toggle('is-link', !!link)
    }
    const leave = () => el.classList.add('is-hidden')
    const enter = () => el.classList.remove('is-hidden')

    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    document.documentElement.addEventListener('pointerenter', enter)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.documentElement.removeEventListener('pointerenter', enter)
    }
  })

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <div className="cursor-ring">
        <span className="cursor-label">View</span>
      </div>
    </div>
  )
}
