import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { cn } from '../../lib/cn'

export interface Faq {
  question: string
  answer: string
}

/** One answer open at a time; the first starts open. */
export function FaqAccordion({ items, compact = false }: { items: readonly Faq[]; compact?: boolean }) {
  const [open, setOpen] = useState(0)
  const id = useId()

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, index) => {
        const isOpen = open === index
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={`${id}-question-${index}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-answer-${index}`}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className={cn(
                  'group flex w-full items-center justify-between gap-6 text-left',
                  compact ? 'py-4' : 'py-6',
                )}
              >
                <span
                  className={cn(
                    'leading-snug font-semibold transition-colors',
                    compact
                      ? 'text-[1rem] sm:text-[1.0625rem]'
                      : 'text-[1.1875rem] sm:text-[1.3125rem]',
                    isOpen ? 'text-leaf' : 'text-ink group-hover:text-leaf',
                  )}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex shrink-0 items-center justify-center rounded-full ring-1 transition-[background-color,color,transform] duration-300 ring-inset',
                    compact ? 'h-8 w-8' : 'h-9 w-9',
                    isOpen ? 'rotate-45 bg-leaf text-white ring-leaf' : 'text-ink ring-line',
                  )}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </h3>
            {/* Animating grid rows from 0fr to 1fr opens the answer at its natural height. */}
            <div
              id={`${id}-answer-${index}`}
              role="region"
              aria-labelledby={`${id}-question-${index}`}
              className={cn(
                'grid transition-[grid-template-rows] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p
                  className={cn(
                    'max-w-[64ch] pr-14',
                    compact ? 'pb-5 text-[0.9375rem] leading-relaxed' : 'pb-7',
                  )}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
