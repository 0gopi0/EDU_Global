import { cn } from '../../lib/cn'

/**
 * The brand emblem: the EG monogram around a globe, with a graduation cap and
 * a rising arrow. It is cut from the full logo with a transparent ground; on
 * dark surfaces it sits on a white tile, because a few enclosed parts of the
 * artwork are white.
 */
export function LogoMark({
  inverse = false,
  className,
}: {
  inverse?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center',
        inverse && 'rounded-xl bg-white p-1',
        className,
      )}
    >
      <img src="/brand/logo-mark.png" alt="" className="h-full w-full object-contain" />
    </span>
  )
}

/**
 * The emblem beside the name. The mark can be left off where the name
 * should stand alone.
 */
export function Logo({
  inverse = false,
  mark = true,
  className,
}: {
  inverse?: boolean
  mark?: boolean
  className?: string
}) {
  return (
    <span className={cn('flex items-center', mark && 'gap-3', className)}>
      {mark ? <LogoMark inverse={inverse} className="size-11" /> : null}
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'text-[1.1875rem] font-extrabold tracking-[0.01em]',
            inverse ? 'text-white' : 'text-ink',
          )}
        >
          EDUGLOBAL
        </span>
        <span
          className={cn(
            'mt-1 text-[0.6875rem] font-medium tracking-[0.02em]',
            inverse ? 'text-white/60' : 'text-muted',
          )}
        >
          Innovation Pvt. Ltd.
        </span>
      </span>
    </span>
  )
}
