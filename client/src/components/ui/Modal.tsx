import { useEffect, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
}) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative w-full max-w-md rounded-xl bg-white p-5',
          'shadow-xl ring-1 ring-slate-200',
        )}
      >
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>

        {description ? <p className="mt-1.5 text-sm text-slate-500">{description}</p> : null}
        {children}

        {footer ? <div className="mt-5 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-300 ring-inset transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors',
              'disabled:pointer-events-none disabled:opacity-50',
              destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-600 hover:bg-brand-700',
            )}
          >
            {loading ? 'Working…' : confirmLabel}
          </button>
        </>
      }
    />
  )
}
