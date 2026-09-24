import { useQuery } from '@tanstack/react-query'
import { BookOpen, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PostCard } from '../../components/PostCard'
import { SiteNotice, SitePagination, SiteSpinner } from '../../components/site/Feedback'
import { usePageTitle } from '../../components/site/hooks'
import { buttonClass } from '../../components/site/ui'
import { api } from '../../lib/api'
import { pluralize } from '../../lib/format'
import type { Paginated, PostSummary } from '../../types'

const PAGE_SIZE = 9

export function BlogList() {
  usePageTitle('Blog')
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
    <>
      <section className="bg-paper">
        <div className="container-site grid gap-x-8 gap-y-8 pt-14 pb-12 sm:pt-20 lg:grid-cols-12 lg:items-end lg:pt-24">
          <h1 className="type-title lg:col-span-6">Blog</h1>
          <div className="lg:col-span-6">
            <p className="type-lede max-w-[34rem]">
              Guides, checklists and first-hand advice for studying overseas.
            </p>
            <form role="search" onSubmit={applySearch} className="mt-6 flex max-w-[34rem] gap-2">
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <div className="relative flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted"
                />
                <input
                  id="blog-search"
                  type="search"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="Search articles…"
                  className="h-12 w-full rounded-full bg-mist pr-4 pl-12 text-ink ring-1 ring-transparent transition-shadow ring-inset placeholder:text-muted/80 focus:bg-paper focus:ring-2 focus:ring-leaf focus:outline-none"
                />
              </div>
              <button type="submit" className={buttonClass('primary')}>
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-paper pb-20 sm:pb-28">
        <div className="container-site">
          <div className="border-t border-line pt-10">
            {search ? (
              <p className="mb-8 text-[0.9375rem] text-muted">
                {data ? pluralize(data.total, 'result') : 'Searching…'} for{' '}
                <span className="font-semibold text-ink">“{search}”</span>
              </p>
            ) : null}

            {isPending ? <SiteSpinner label="Loading articles…" /> : null}

            {isError ? (
              <SiteNotice
                icon={<BookOpen className="h-6 w-6" />}
                title="Articles are unavailable"
                description="The blog could not be loaded. Please try again shortly."
              />
            ) : null}

            {data && data.items.length === 0 ? (
              <SiteNotice
                icon={<BookOpen className="h-6 w-6" />}
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
                <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                  {data.items.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                <div className="mt-16">
                  <SitePagination
                    page={data.page}
                    totalPages={data.totalPages}
                    onPageChange={goToPage}
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
