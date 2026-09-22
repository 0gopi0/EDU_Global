import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/ui/EmptyState'

export function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <EmptyState
        icon={<Compass className="h-5 w-5" />}
        title="Page not found"
        description="The page you were looking for does not exist or may have moved."
        action={
          <Link
            to="/"
            className="mt-1 inline-flex h-10 items-center rounded-lg bg-brand-600 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Back home
          </Link>
        }
      />
    </div>
  )
}
