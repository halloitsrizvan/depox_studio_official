import { useRef, useState, type FormEvent } from 'react'
import { gsap, useGSAP, revealLines, prefersReducedMotion } from '../lib/motion'
import { CONTACT, SERVICE_OPTIONS, waLink } from '../data'
import { Arrow } from '../components/Brand'
import { Magnetic } from '../components/Magnetic'

type Errors = Partial<Record<'name' | 'message', string>>

export function Contact() {
  const root = useRef<HTMLElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState(SERVICE_OPTIONS[0])
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      revealLines(root.current!.querySelector('.contact-title')!, { duration: 1.4 })
      gsap.from('.contact-grid > *', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.contact-grid', start: 'top 85%', once: true },
      })
    },
    { scope: root },
  )

  const compose = () =>
    [
      `Hi DepoX Studio! I'm ${name.trim()}.`,
      `Service: ${service}`,
      email.trim() ? `Email: ${email.trim()}` : '',
      '',
      message.trim(),
    ]
      .filter((l, i) => l || i === 3)
      .join('\n')

  const validate = () => {
    const e: Errors = {}
    if (!name.trim()) e.name = 'Please tell us your name.'
    if (!message.trim()) e.message = 'A line or two about the project helps us reply properly.'
    setErrors(e)
    if (e.name) document.getElementById('f-name')?.focus()
    else if (e.message) document.getElementById('f-msg')?.focus()
    return Object.keys(e).length === 0
  }

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    window.open(waLink(compose()), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Project inquiry: ${service}`)}&body=${encodeURIComponent(compose())}`

  return (
    <section ref={root} id="contact" className="contact" aria-labelledby="contact-title">
      <span className="eyebrow">Start a conversation</span>
      <h2 id="contact-title" className="display contact-title">
        Let's build something <em>remembered.</em>
      </h2>

      <div className="contact-grid">
        <div className="contact-direct">
          <p>Have an idea or a brand that needs a home online? Send us a message and we'll reply within 24 hours.</p>
          <Magnetic strength={0.3}>
            <a className="big-cta" href={waLink("Hi DepoX Studio! I'd like to start a project.")} target="_blank" rel="noopener noreferrer">
              <span>
                Chat on
                <br />
                WhatsApp
              </span>
            </a>
          </Magnetic>
          <div className="contact-lines">
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={`tel:+${CONTACT.whatsapp}`}>{CONTACT.phoneDisplay}</a>
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">
              Instagram {CONTACT.instagramHandle}
            </a>
          </div>
        </div>

        <form className="form" onSubmit={onSubmit} noValidate aria-describedby="form-note">
          <div className="form-row">
            <div className="field" data-invalid={!!errors.name}>
              <label htmlFor="f-name">Your name *</label>
              <input
                id="f-name"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'e-name' : undefined}
              />
              {errors.name && (
                <span id="e-name" className="field-error">
                  {errors.name}
                </span>
              )}
            </div>
            <div className="field">
              <label htmlFor="f-email">Email (optional)</label>
              <input
                id="f-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <fieldset className="field">
            <legend>What do you need?</legend>
            <div className="chips">
              {SERVICE_OPTIONS.map((s) => (
                <button type="button" key={s} className="chip" aria-pressed={service === s} onClick={() => setService(s)}>
                  {s}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="field" data-invalid={!!errors.message}>
            <label htmlFor="f-msg">Project details *</label>
            <textarea
              id="f-msg"
              name="message"
              rows={4}
              placeholder="Tell us about your brand, your goals and your timeline."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'e-msg' : undefined}
            />
            {errors.message && (
              <span id="e-msg" className="field-error">
                {errors.message}
              </span>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-dark">
              <span>Send on WhatsApp</span>
              <Arrow />
            </button>
            <a className="form-link" href={mailto} onClick={(e) => !validate() && e.preventDefault()}>
              or send by email
            </a>
          </div>
          <p id="form-note" className="form-note" role="status">
            {sent
              ? `Thanks, ${name.trim()}. WhatsApp opened with your message ready. Just press send.`
              : 'Your message opens in WhatsApp, ready to send.'}
          </p>
        </form>
      </div>
    </section>
  )
}
