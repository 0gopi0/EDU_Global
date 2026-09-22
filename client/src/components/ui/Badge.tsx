import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { PostStatus } from '../../types'

type Tone = 'brand' | 'slate' | 'green' | 'amber' | 'red'

const TONES: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
}

export function Badge({
  tone = 'slate',
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <Badge tone={status === 'published' ? 'green' : 'amber'}>
      {status === 'published' ? 'Published' : 'Draft'}
    </Badge>
  )
}
