import { usePageMeta } from '../lib/seo'
import { Hero } from '../sections/Hero'
import { Manifesto } from '../sections/Manifesto'
import { Work } from '../sections/Work'
import { Services } from '../sections/Services'
import { Process } from '../sections/Process'
import { Studio } from '../sections/Studio'
import { Testimonials } from '../sections/Testimonials'
import { Contact } from '../sections/Contact'

export default function Home() {
  usePageMeta({ title: 'DepoX Studio | Branding & Web Design', path: '/' })

  return (
    <main id="main">
      <Hero />
      <Manifesto />
      <Work />
      <Services />
      <Process />
      <Studio />
      <Testimonials />
      <Contact />
    </main>
  )
}
