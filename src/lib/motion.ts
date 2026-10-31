import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export const EASE = 'expo.out'
export const EASE_IN_OUT = 'expo.inOut'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

/** Split an element into masked lines and slide them up. Returns the timeline. */
export function revealLines(
  el: Element,
  opts: { delay?: number; stagger?: number; duration?: number; trigger?: Element | string | false } = {},
) {
  const trigger = opts.trigger === undefined ? el : opts.trigger
  SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'line',
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 110,
        duration: opts.duration ?? 1.2,
        ease: EASE,
        stagger: opts.stagger ?? 0.08,
        delay: opts.delay ?? 0,
        scrollTrigger: trigger ? { trigger, start: 'top 85%', once: true } : undefined,
      }),
  })
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
