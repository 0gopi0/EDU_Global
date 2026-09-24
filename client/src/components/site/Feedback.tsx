import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { buttonClass } from './ui'

/** Loading state for public pages. The admin panel has its own in `ui/`. */
export function SiteSpinner({ label }: { label: string }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-24 text-muted">
      <Loader2 aria-hidden="true" className="h-7 w-7 animate-spin text-leaf" />
      <p className="text-[0.9375rem]">{label}</p>
    </div>
  )
}

/** Empty and error states: what happened, and what to do next. */
export function SiteNotice({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf-soft text-leaf">
        {icon}
      </span>
      <h2 className="type-subheading mt-6">{title}</h2>
      <p className="mt-2 max-w-[40ch]">{description}</p>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  )
}

export function SitePagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-4 border-t border-line pt-8"
    >
      <p className="text-[0.9375rem] text-muted">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={buttonClass('secondary', undefined, 'sm')}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={buttonClass('secondary', undefined, 'sm')}
        >
          Next
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </nav>
  )
}
