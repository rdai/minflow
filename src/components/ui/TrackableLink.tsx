"use client"

import { useAnalytics } from "@/lib/useAnalytics"

interface Props {
  href: string
  workflowId?: string
  event?: string
  properties?: Record<string, unknown>
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
  'aria-label'?: string
}

export default function TrackableLink({ href, workflowId, event = 'link_click', properties, children, ...rest }: Props) {
  const { track } = useAnalytics()
  return (
    <a
      href={href}
      onClick={() => track(event, workflowId, { href, ...properties })}
      {...rest}
    >
      {children}
    </a>
  )
}
