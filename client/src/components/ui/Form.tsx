import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

const CONTROL = [
  'w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-900 shadow-sm',
  'ring-1 ring-slate-300 ring-inset transition',
  'placeholder:text-slate-400',
  'focus:ring-2 focus:ring-brand-600 focus:outline-none',
  'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
].join(' ')

const INVALID = 'ring-red-400 focus:ring-red-500'

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: string
  error?: string | undefined
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-sm text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export function Input({ invalid = false, className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(CONTROL, invalid && INVALID, className)}
    />
  )
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export function Textarea({ invalid = false, className, ...rest }: TextareaProps) {
  return (
    <textarea
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(CONTROL, 'resize-y', invalid && INVALID, className)}
    />
  )
}
