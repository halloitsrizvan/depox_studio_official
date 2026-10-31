export const CONTACT = {
  email: 'clgrizvan@gmail.com',
  phoneDisplay: '+91 85938 26375',
  whatsapp: '918593826375',
  instagram: 'https://www.instagram.com/depox_studio/',
  instagramHandle: '@depox_studio',
}

export const waLink = (text: string) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`

export type Project = {
  slug: string
  index: string
  title: string
  subtitle: string
  sector: string
  description: string
  url: string
  image: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'brightpath',
    index: '01',
    title: 'BrightPath',
    subtitle: 'Intelligence for Education.',
    sector: 'Education',
    description:
      "A premium, high-fidelity management portal designed for modern tuition centers and educational institutions. It provides a comprehensive 'Executive Command Center' for administrators, streamlined tools for teachers, and performance-centric dashboards for students.",
    url: 'https://www.brightpatheduvora.com/',
    image: '/images/project-1.webp',
  },
  {
    slug: 'sales-edappal',
    index: '02',
    title: 'Sales Edappal',
    subtitle: 'Modern Real Estate.',
    sector: 'Real Estate',
    description:
      'A comprehensive real estate platform designed for Sameer Edappal, a trusted consultant in Kerala. The platform enables users to browse, list, and inquire about properties with powerful management tools for admins.',
    url: 'https://www.salesedappal.com/',
    image: '/images/project-2.webp',
  },
  {
    slug: 'flight99',
    index: '03',
    title: 'FLIGHT99',
    subtitle: 'Travel Management.',
    sector: 'Travel',
    description:
      'FLIGHT99 Travel Enterprises has grown from a small ticketing agency to a comprehensive travel management company, providing seamless solutions for the modern traveler.',
    url: 'https://www.flight99.co.in/',
    image: '/images/project-3.webp',
  },
]

export const SERVICES = [
  { title: 'Web Design', text: 'Creating stunning, user-centric interfaces that are both visually beautiful and intuitively easy to navigate.' },
  { title: 'Web Development', text: 'High-performance websites built with the latest technologies for speed, security, and scalability.' },
  { title: 'Branding & Graphics', text: "Distinct visual identities that communicate your brand's story across every platform." },
  { title: 'Social Media Posters', text: 'Eye-catching, scroll-stopping visual creatives designed to captivate your audience and boost engagement across platforms.' },
  { title: 'E-Commerce', text: 'Conversion-optimized online stores designed to turn visitors into loyal customers.' },
  { title: 'Portfolio', text: 'Captivating digital showcases that highlight your professional journey and achievements.' },
]

export const STATS = [
  { value: 20, suffix: '+', label: 'Sites launched' },
  { value: 98, suffix: '%', label: 'Client satisfaction' },
  { value: 3.2, suffix: 'x', label: 'More conversions', decimals: 1 },
  { value: 5, suffix: ' days', label: 'Average delivery' },
]

export const PROCESS = [
  { title: 'Share your vision', text: 'Tell us about your brand, your audience and where you want to go. One conversation is enough to start.' },
  { title: 'Wireframes', text: 'We map the structure and the story first, so every page has a job before it has a look.' },
  { title: 'Design', text: 'Identity, type, colour and motion come together into a site that feels unmistakably yours.' },
  { title: 'Code & launch', text: 'We build it fast, responsive and search-ready, then ship it. All in days, not quarters.' },
]

export const TEAM = [
  { name: 'Muhammed Sabith', role: 'Founder & Tech', image: '/images/member2.webp' },
  { name: 'Muhammed Rizwan', role: 'Co-Founder & Design', image: '/images/member1.webp' },
  { name: 'Badrul Husain', role: 'Creative Director', image: '/images/member3.webp' },
]

export const TESTIMONIALS = [
  {
    quote: "A complete rebuild in five days. The result outperformed everything we'd spent months building before.",
    name: 'Sameer',
    role: 'CEO, Sales Edappal',
  },
  {
    quote: "Conversions up 4x. That's not a typo. The design just works differently when it's built on real data.",
    name: 'Robinh R',
    role: 'Founder, ROB Architects & Design Studio',
  },
  {
    quote: "They didn't just design our site. They defined our brand. World-class doesn't begin to cover it.",
    name: 'Hibathulla',
    role: 'Founder, BrightPath Eduvora',
  },
]

export const SERVICE_OPTIONS = ['Web Design', 'Web Development', 'Branding', 'Social Media', 'E-Commerce', 'Other']
