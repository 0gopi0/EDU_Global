import { useQuery } from '@tanstack/react-query'
import { BookOpen, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PostCard } from '../../components/PostCard'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Form'
import { Pagination } from '../../components/ui/Pagination'
import { PageSpinner } from '../../components/ui/Spinner'
import { api } from '../../lib/api'
import { pluralize } from '../../lib/format'
import type { Paginated, PostSummary } from '../../types'

const PAGE_SIZE = 9

export function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const search = searchParams.get('q') ?? ''

  // The input is local so typing does not fire a request on every keystroke;
  // the URL is only updated on submit, which also keeps the page shareable.
  const [term, setTerm] = useState(search)

  const queryString = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) })
  if (search) queryString.set('search', search)

  const { data, isPending, isError } = useQuery({
    queryKey: ['posts', 'list', page, search],
    queryFn: () => api.get<Paginated<PostSummary>>(`/api/posts?${queryString.toString()}`),
    placeholderData: (previous) => previous,
  })

  function applySearch(event: FormEvent) {
    event.preventDefault()

    const next = new URLSearchParams()
    if (term.trim()) next.set('q', term.trim())
    setSearchParams(next)
  }

  function goToPage(nextPage: number) {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(nextPage))
    setSearchParams(next)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Blog</h1>
        <p className="text-slate-600">
          Guides, checklists and first-hand advice for studying overseas.
        </p>
      </header>

      <form onSubmit={applySearch} className="mb-8 flex max-w-md gap-2">
        <Input
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search articles…"
          aria-label="Search articles"
        />
        <Button type="submit" icon={<Search className="h-4 w-4" />}>
          Search
        </Button>
      </form>

      {search ? (
        <p className="mb-6 text-sm text-slate-500">
          {data ? pluralize(data.total, 'result') : 'Searching…'} for{' '}
          <span className="font-medium text-slate-700">“{search}”</span>
        </p>
      ) : null}

      {isPending ? <PageSpinner label="Loading articles…" /> : null}

      {isError ? (
        <EmptyState
          icon={<BookOpen className="h-5 w-5" />}
          title="Articles are unavailable"
          description="The blog could not be loaded. Please try again shortly."
        />
      ) : null}

      {data && data.items.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-5 w-5" />}
          title={search ? 'No matching articles' : 'No articles published yet'}
          description={
            search
              ? 'Try a different search term.'
              : 'Once a post is published from the admin panel it will appear here.'
          }
        />
      ) : null}

      {data && data.items.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="mt-8">
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />
          </div>
        </>
      ) : null}
    </div>
  )
}
