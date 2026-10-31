import { useEffect } from 'react'

export const SITE_URL = 'https://depoxstudio.com'

const DEFAULT_DESCRIPTION =
  'DepoX Studio builds brands that get remembered. Branding, web design and creative content: identity, websites and social media built as one system.'

function setTag(selector: string, attr: 'content' | 'href', value: string) {
  document.head.querySelector(selector)?.setAttribute(attr, value)
}

/** Keeps title, description, canonical and social tags in step with the current route. */
export function usePageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  noindex = false,
}: {
  title: string
  description?: string
  path: string
  noindex?: boolean
}) {
  useEffect(() => {
    const url = SITE_URL + path
    document.title = title
    setTag('meta[name="description"]', 'content', description)
    setTag('meta[name="robots"]', 'content', noindex ? 'noindex' : 'index, follow, max-image-preview:large')
    setTag('link[rel="canonical"]', 'href', url)
    setTag('meta[property="og:url"]', 'content', url)
    setTag('meta[property="og:title"]', 'content', title)
    setTag('meta[property="og:description"]', 'content', description)
    setTag('meta[name="twitter:title"]', 'content', title)
    setTag('meta[name="twitter:description"]', 'content', description)
  }, [title, description, path, noindex])
}
