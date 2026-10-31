import { forwardRef, type SVGProps } from 'react'
import { MARK, WORD_DEPOX, WORD_STUDIO, WORD_VIEWBOX } from '../brand/paths'

export const Mark = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement> & { color?: string }>(
  ({ color = 'var(--signal)', ...props }, ref) => (
    <svg ref={ref} viewBox={MARK.viewBox} aria-hidden="true" focusable="false" {...props}>
      <path d={MARK.d} fill={color} fillRule="evenodd" />
    </svg>
  ),
)
Mark.displayName = 'Mark'

type WordProps = SVGProps<SVGSVGElement> & { depox?: string; studio?: string; title?: string }

export const Wordmark = forwardRef<SVGSVGElement, WordProps>(
  ({ depox = 'var(--signal)', studio = 'var(--blush)', title = 'DepoX Studio', ...props }, ref) => (
    <svg ref={ref} viewBox={WORD_VIEWBOX} role="img" aria-label={title} {...props}>
      <path className="wm-depox" d={WORD_DEPOX} fill={depox} fillRule="evenodd" />
      <path className="wm-studio" d={WORD_STUDIO} fill={studio} fillRule="evenodd" />
    </svg>
  ),
)
Wordmark.displayName = 'Wordmark'

export const Arrow = (props: SVGProps<SVGSVGElement>) => (
  <svg className="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path d="M2 8h11.5M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

export const ArrowUpRight = (props: SVGProps<SVGSVGElement>) => (
  <svg className="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)
