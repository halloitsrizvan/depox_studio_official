import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { useSite } from '../lib/site'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; onNavigate?: () => void }

/** Internal link that routes through the curtain transition (or smooth-scrolls on the same page). */
export const TLink = forwardRef<HTMLAnchorElement, Props>(({ to, onNavigate, onClick, ...rest }, ref) => {
  const { go } = useSite()
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    onNavigate?.()
    go(to)
  }
  return <a ref={ref} href={to} onClick={handle} {...rest} />
})
TLink.displayName = 'TLink'
