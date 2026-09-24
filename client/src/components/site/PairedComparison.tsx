import { ArrowRight, CircleCheck, CircleX, type LucideIcon } from 'lucide-react'

/**
 * Before-and-after lists whose items answer each other one to one, so each
 * row pairs a problem with its fix, joined by an arrow. The old way sits
 * muted on the left, marked with a light red cross; the EduGlobal answer
 * sits on a light blue panel on the right. Hovering a row strikes through
 * the old way.
 */
export function PairedComparison({
  before,
  after,
  rows,
  beforeIcon: BeforeIcon = CircleX,
  afterIcon: AfterIcon = CircleCheck,
}: {
  before: string
  after: string
  rows: readonly (readonly [string, string])[]
  beforeIcon?: LucideIcon
  afterIcon?: LucideIcon
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-paper shadow-[0_1px_2px_rgb(0_16_48/0.05),0_24px_48px_-32px_rgb(0_16_48/0.35)] ring-1 ring-line">
      <div aria-hidden="true" className="hidden md:grid md:grid-cols-[1fr_3.5rem_1fr]">
        <p className="border-b border-line px-7 py-4 text-[0.9375rem] font-semibold text-muted">
          {before}
        </p>
        <span className="border-b border-line" />
        <p className="border-b border-line bg-board px-7 py-4 text-[0.9375rem] font-semibold text-white">
          {after}
        </p>
      </div>
      <ol>
        {rows.map(([was, now]) => (
          <li
            key={was}
            className="group grid border-b border-line last:border-b-0 md:grid-cols-[1fr_3.5rem_1fr]"
          >
            <div className="flex gap-3.5 px-5 pt-5 pb-3 sm:px-7 md:py-6">
              <BeforeIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#e57373]" />
              <p className="text-muted">
                <span className="mb-1 block text-[0.8125rem] font-semibold md:sr-only">
                  {before}
                </span>
                <span className="decoration-muted/60 decoration-2 transition-colors group-hover:line-through">
                  {was}
                </span>
              </p>
            </div>
            {/* The join: the problem leads to its answer. */}
            <div aria-hidden="true" className="hidden place-items-center md:grid">
              <span className="grid size-9 place-items-center rounded-full bg-paper text-leaf ring-1 ring-line transition-[background-color,color,transform] duration-300 group-hover:translate-x-0.5 group-hover:bg-leaf group-hover:text-white group-hover:ring-leaf">
                <ArrowRight className="size-4" />
              </span>
            </div>
            <div className="flex gap-3.5 bg-sky px-5 pt-3 pb-5 transition-colors duration-300 group-hover:bg-leaf-soft sm:px-7 md:py-6">
              <AfterIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-leaf" />
              <p className="font-medium text-ink">
                <span className="mb-1 block text-[0.8125rem] font-semibold text-leaf md:sr-only">
                  {after}
                </span>
                {now}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
