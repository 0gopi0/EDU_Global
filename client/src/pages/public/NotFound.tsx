import { Link } from 'react-router-dom'
import { usePageTitle } from '../../components/site/hooks'
import { buttonClass } from '../../components/site/ui'
import { cn } from '../../lib/cn'

/** A small classroom with every desk taken but one: the page that isn't here. */
function EmptySeat() {
  return (
    <div aria-hidden="true" className="mx-auto w-44">
      <div className="mx-auto h-1.5 w-3/5 rounded-full bg-board" />
      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {Array.from({ length: 15 }, (_, index) => (
          <span
            key={index}
            className={cn(
              'aspect-[5/2] rounded-[3px]',
              index === 12 ? 'bg-paper ring-2 ring-pencil ring-inset' : 'bg-leaf',
            )}
          />
        ))}
      </div>
    </div>
  )
}

export function NotFound() {
  usePageTitle('Page not found')

  return (
    <section className="bg-paper">
      <div className="container-site flex min-h-[62vh] flex-col items-center justify-center py-24 text-center">
        <EmptySeat />
        <p className="type-label mt-10 text-leaf">Error 404</p>
        <h1 className="type-title mt-4">Page not found</h1>
        <p className="type-lede mt-5 max-w-[34rem]">
          The page you were looking for does not exist or may have moved.
        </p>
        <Link to="/" className={buttonClass('accent', 'mt-10')}>
          Back home
        </Link>
      </div>
    </section>
  )
}
