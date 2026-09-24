import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

/* ---------------------------------------------------------------- buttons */

type ButtonVariant = 'accent' | 'primary' | 'secondary' | 'inverse' | 'ctaOutline'

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  // The inset bottom edge gives the yellow a boundary on white.
  accent: 'bg-pencil-bright text-ink shadow-[inset_0_-2px_0_rgb(0_16_48/0.18)] hover:bg-[#f0c050]',
  primary: 'bg-board text-white hover:bg-board-deep',
  secondary: 'bg-paper text-ink ring-1 ring-line ring-inset hover:ring-ink/45',
  inverse: 'text-white ring-1 ring-white/35 ring-inset hover:bg-white/10 hover:ring-white/70',

  // The hero's secondary action. It lifts and tints on hover rather than
  // filling solid, so it never competes with the primary beside it.
  ctaOutline:
    'bg-paper text-board ring-2 ring-board/30 ring-inset hover:bg-leaf-soft hover:ring-leaf hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-16px_rgb(0_16_48/0.4)]',
}

const BUTTON_SIZES = {
  sm: 'h-11 px-5 text-[0.95rem]',
  md: 'h-12 px-5 text-[0.975rem] sm:px-6',
  lg: 'h-14 px-7 text-[1.0625rem]',
} as const

/**
 * Class names for a button-shaped link or button. "Partner with us" and form
 * submits use `accent`; everything else steps down from there. Height, padding
 * and text size come from `size` only: an extra `h-*`, `px-*` or `text-*` in
 * `className` would compete with them, and `cn` does not dedupe Tailwind
 * classes, so which one wins would come down to stylesheet order.
 */
export function buttonClass(
  variant: ButtonVariant = 'accent',
  className?: string,
  size: keyof typeof BUTTON_SIZES = 'md',
): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap',
    'transition-[background-color,box-shadow,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
    // Press feedback: the button gives under the pointer, then springs back.
    'active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-50',
    BUTTON_SIZES[size],
    BUTTON_VARIANTS[variant],
    className,
  )
}

/** Inline text link in the leaf green, underlined so it reads as a link without
 * relying on colour. */
export function TextLink({
  to,
  children,
  className,
}: {
  to: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        'font-semibold text-leaf underline decoration-leaf/35 decoration-2 underline-offset-[5px] transition-colors hover:decoration-leaf',
        className,
      )}
    >
      {children}
    </Link>
  )
}

/* --------------------------------------------------------------- sections */

type Tone = 'paper' | 'mist' | 'sky' | 'board'

const TONES: Record<Tone, string> = {
  paper: 'bg-paper',
  mist: 'bg-mist',
  sky: 'bg-sky',
  board: 'bg-board text-white/75',
}

export function Section({
  id,
  tone = 'paper',
  className,
  children,
}: {
  id?: string
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={cn('scroll-mt-20 py-12', TONES[tone], className)}>
      <div className="container-site">{children}</div>
    </section>
  )
}

/**
 * Opens a section. The label sits in the left margin on wide screens, the
 * way a question number sits in the margin of an answer sheet, so the
 * headings share one left edge down the page.
 *
 * With no label there is nothing to hold that margin, so the heading takes the
 * full width instead and the lede drops to the right beneath it — the same
 * relationship the page heroes set between their headline and their lede. A
 * heading indented into an empty margin reads as a missing label.
 */
export function SectionHeader({
  label,
  title,
  lede,
  tone = 'paper',
  className,
}: {
  label?: string
  title: ReactNode
  lede?: ReactNode
  tone?: Tone
  className?: string
}) {
  const dark = tone === 'board'

  const heading = (
    <h2
      className={cn(
        'type-heading text-balance',
        label ? 'max-w-[22ch]' : 'lg:col-span-10',
        dark && 'text-white',
      )}
    >
      {title}
    </h2>
  )

  const supporting = lede ? (
    <p
      className={cn(
        'type-lede',
        dark ? 'text-white/75' : 'text-body',
        label ? 'mt-6 max-w-[40rem]' : 'lg:col-span-5 lg:col-start-8',
      )}
    >
      {lede}
    </p>
  ) : null

  if (!label) {
    return (
      <header className={cn('grid gap-x-8 gap-y-6 lg:grid-cols-12', className)}>
        {heading}
        {supporting}
      </header>
    )
  }

  return (
    <header className={cn('grid gap-x-8 gap-y-4 lg:grid-cols-12', className)}>
      <p
        className={cn(
          'type-label lg:col-span-3 lg:pt-[0.55em]',
          dark ? 'text-pencil-bright' : 'text-leaf',
        )}
      >
        {label}
      </p>
      <div className="lg:col-span-9">
        {heading}
        {supporting}
      </div>
    </header>
  )
}

/**
 * The section opening used across the redesigned pages: a small label over
 * the title on the left, the lede on the right and bottom-aligned with it.
 * The lede is left off on phones, where it would push the content a screen
 * further down.
 */
export function SectionHeading({
  label,
  title,
  lede,
  className,
}: {
  label: string
  title: ReactNode
  lede?: ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12',
        className,
      )}
    >
      <div>
        <p className="type-label text-leaf">{label}</p>
        <h2 className="type-heading mt-3 max-w-[22ch] text-balance">{title}</h2>
      </div>
      {lede ? <p className="max-w-[26rem] text-body max-sm:hidden lg:pb-1">{lede}</p> : null}
    </header>
  )
}

/** One line of a hero headline, rising from behind a mask on load. */
export function HeroLine({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <span className="block motion-safe:animate-rise" style={{ animationDelay: `${delay}s` }}>
        {children}
      </span>
    </span>
  )
}
