import { Route, Routes } from 'react-router-dom'
import { SiteProvider, useSite } from './lib/site'
import { Preloader } from './components/Preloader'
import { Cursor } from './components/Cursor'
import { Nav } from './components/Nav'
import { Mark } from './components/Brand'
import { Footer } from './sections/Footer'
import Home from './pages/Home'
import CaseStudy from './pages/CaseStudy'
import NotFound from './pages/NotFound'

function Curtain() {
  const { curtain } = useSite()
  return (
    <div ref={curtain} className="curtain" aria-hidden="true">
      <Mark color="var(--on-signal)" />
    </div>
  )
}

export default function App() {
  return (
    <SiteProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Preloader />
      <Curtain />
      <Cursor />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </SiteProvider>
  )
}
