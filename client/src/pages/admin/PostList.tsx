import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff, FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { StatusBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Form'
import { ConfirmDialog } from '../../components/ui/Modal'
import { Pagination } from '../../components/ui/Pagination'
import { PageSpinner } from '../../components/ui/Spinner'
import { useToast } from '../../components/ui/Toast'
import { api } from '../../lib/api'
import { cn } from '../../lib/cn'
import { formatDate } from '../../lib/format'
import type { Paginated, PostStatus, PostSummary } from '../../types'

const PAGE_SIZE = 10

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
] as const

type StatusFilter = (typeof STATUS_FILTERS)[number]['value']

function parseStatus(value: string | null): StatusFilter {
  return value === 'published' || value === 'draft' ? value : 'all'
}

export function PostList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const toast = useToast()

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const status = parseStatus(searchParams.get('status'))
  const search = searchParams.get('q') ?? ''

  const [term, setTerm] = useState(search)
  const [pendingDelete, setPendingDelete] = useState<PostSummary | null>(null)

  const queryString = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
    status,
  })
  if (search) queryString.set('search', search)

  const { data, isPending, isError } = useQuery({
    queryKey: ['admin', 'posts', page, status, search],
    queryFn: () => api.get<Paginated<PostSummary>>(`/api/admin/posts?${queryString.toString()}`),
    // Keeps the previous page visible while the next one loads.
    placeholderData: (previous) => previous,
  })

  function setFilter(next: StatusFilter) {
    const params = new URLSearchParams()
    if (next !== 'all') params.set('status', next)
    if (search) params.set('q', search)
    setSearchParams(params)
  }

  function applySearch(event: FormEvent) {
    event.preventDefault()

    const params = new URLSearchParams()
    if (status !== 'all') params.set('status', status)
    if (term.trim()) params.set('q', term.trim())
    setSearchParams(params)
  }

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(nextPage))
    setSearchParams(params)
  }

  const statusMutation = useMutation({
    mutationFn: ({ id, next }: { id: number; next: PostStatus }) =>
      api.patch(`/api/admin/posts/${id}/status`, { status: next }),
    onSuccess: (_data, variables) => {
      toast.success(
        variables.next === 'published' ? 'Post published.' : 'Post moved to drafts.',
      )
      void queryClient.invalidateQueries({ queryKey: ['admin'] })
      void queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'That change could not be saved.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/admin/posts/${id}`),
    onSuccess: () => {
      toast.success('Post deleted.')
      setPendingDelete(null)

      // Deleting the only row on a page would otherwise leave the user staring
      // at an empty table.
      if (data && data.items.length === 1 && page > 1) {
        const params = new URLSearchParams(searchParams)
        params.set('page', String(page - 1))
        setSearchParams(params)
      }

      void queryClient.invalidateQueries({ queryKey: ['admin'] })
      void queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'That post could not be deleted.')
    },
  })

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Posts</h1>
          <p className="text-sm text-slate-500">Create, edit and publish your articles.</p>
        </div>

        <Link
          to="/admin/posts/new"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          New post
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg bg-slate-100 p-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setFilter(filter.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                status === filter.value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <form onSubmit={applySearch} className="flex flex-1 gap-2 sm:max-w-xs">
          <Input
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search posts…"
            aria-label="Search posts"
          />
          <Button type="submit" variant="secondary" icon={<Search className="h-4 w-4" />}>
            Search
          </Button>
        </form>
      </div>

      <Card>
        {isPending ? <PageSpinner label="Loading posts…" /> : null}

        {isError ? (
          <EmptyState
            icon={<FileText className="h-5 w-5" />}
            title="Posts could not be loaded"
            description="Please refresh the page and try again."
          />
        ) : null}

        {data && data.items.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-5 w-5" />}
            title={search ? 'No posts match your search' : 'No posts yet'}
            description={
              search
                ? 'Try a different search term or clear the filters.'
                : 'Write your first article to see it listed here.'
            }
            action={
              search ? undefined : (
                <Link
                  to="/admin/posts/new"
                  className="mt-1 inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                >
                  <Plus className="h-4 w-4" />
                  New post
                </Link>
              )
            }
          />
        ) : null}

        {data && data.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200/70 text-xs tracking-wide text-slate-500 uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Title
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="hidden px-5 py-3 font-medium md:table-cell">
                    Updated
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70">
                {data.items.map((post) => {
                  const busy = statusMutation.isPending || deleteMutation.isPending

                  return (
                    <tr key={post.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="max-w-xs px-5 py-3.5">
                        <Link
                          to={`/admin/posts/${post.id}/edit`}
                          className="block truncate font-medium text-slate-800 hover:text-brand-700"
                        >
                          {post.title}
                        </Link>
                        <p className="truncate text-xs text-slate-400">/{post.slug}</p>
                      </td>

                      <td className="px-5 py-3.5">
                        <StatusBadge status={post.status} />
                      </td>

                      <td className="hidden px-5 py-3.5 text-slate-500 md:table-cell">
                        {formatDate(post.updatedAt)}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          {post.status === 'published' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Move to drafts"
                              disabled={busy}
                              onClick={() =>
                                statusMutation.mutate({ id: post.id, next: 'draft' })
                              }
                              icon={<EyeOff className="h-4 w-4" />}
                            >
                              <span className="sr-only">Unpublish {post.title}</span>
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Publish"
                              disabled={busy}
                              onClick={() =>
                                statusMutation.mutate({ id: post.id, next: 'published' })
                              }
                              icon={<Eye className="h-4 w-4" />}
                            >
                              <span className="sr-only">Publish {post.title}</span>
                            </Button>
                          )}

                          <Link
                            to={`/admin/posts/${post.id}/edit`}
                            title="Edit"
                            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit {post.title}</span>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            title="Delete"
                            disabled={busy}
                            onClick={() => setPendingDelete(post)}
                            icon={<Trash2 className="h-4 w-4" />}
                          >
                            <span className="sr-only">Delete {post.title}</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />
          </div>
        ) : null}
      </Card>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this post?"
        description={`“${pendingDelete?.title ?? ''}” will be permanently removed, along with its cover image. This cannot be undone.`}
        confirmLabel="Delete post"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (pendingDelete) deleteMutation.mutate(pendingDelete.id)
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
