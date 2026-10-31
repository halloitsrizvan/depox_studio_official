import { useRef } from 'react'
import { gsap, useGSAP, revealLines, ScrollTrigger, prefersReducedMotion } from '../lib/motion'
import { PROCESS } from '../data'

export function Process() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>('.step')
      if (prefersReducedMotion()) {
        steps.forEach((s) => s.classList.add('is-active'))
        gsap.set('.process-line span', { scaleY: 1 })
        return
      }
      revealLines(root.current!.querySelector('h2')!)
      gsap.to('.process-line span', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.process-steps', start: 'top 60%', end: 'bottom 60%', scrub: true },
      })
      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 60%',
          onEnter: () => step.classList.add('is-active'),
          onLeaveBack: () => step.classList.remove('is-active'),
        })
        gsap.from(step.querySelectorAll('small, h3, p'), {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: step, start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="process" className="section process" aria-labelledby="process-title">
      <div className="process-head">
        <span className="eyebrow">How it works</span>
        <h2 id="process-title" className="display">
          You dream it. <em>We ship it.</em>
        </h2>
        <p>Share your vision. Our team handles the rest: wireframes, design, code, launch. All in days, not quarters.</p>
      </div>
      <div className="process-steps">
        <div className="process-line" aria-hidden="true">
          <span />
        </div>
        <ol>
        {PROCESS.map((s, i) => (
          <li className="step" key={s.title}>
            <small>Step {String(i + 1).padStart(2, '0')}</small>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
        </ol>
      </div>
    </section>
  )
}
