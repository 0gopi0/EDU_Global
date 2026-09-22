import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CalendarDays, FileQuestion } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Markdown } from '../../components/Markdown'
import { EmptyState } from '../../components/ui/EmptyState'
import { PageSpinner } from '../../components/ui/Spinner'
import { ApiError, api } from '../../lib/api'
import { formatDate } from '../../lib/format'
import type { PostDetail } from '../../types'

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['posts', 'detail', slug],
    queryFn: () => api.get<{ post: PostDetail }>(`/api/posts/${encodeURIComponent(slug ?? '')}`),
    enabled: Boolean(slug),
    retry: false,
  })

  if (isPending) return <PageSpinner label="Loading article…" />

  if (isError) {
    const missing = error instanceof ApiError && error.status === 404

    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <EmptyState
          icon={<FileQuestion className="h-5 w-5" />}
          title={missing ? 'Article not found' : 'Something went wrong'}
          description={
            missing
              ? 'This article may have been removed, or it is still a draft.'
              : 'The article could not be loaded. Please try again shortly.'
          }
          action={
            <Link
              to="/blog"
              className="mt-1 inline-flex h-10 items-center rounded-lg bg-brand-600 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              Back to the blog
            </Link>
          }
        />
      </div>
    )
  }

  const { post } = data

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        All articles
      </Link>

      <header className="mt-6 space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {post.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <CalendarDays className="h-4 w-4" />
          <time dateTime={post.publishedAt ?? post.createdAt}>
            {formatDate(post.publishedAt ?? post.createdAt)}
          </time>
        </div>

        {post.excerpt ? (
          <p className="text-lg text-slate-600">{post.excerpt}</p>
        ) : null}
      </header>

      {post.coverImagePath ? (
        <img
          src={post.coverImagePath}
          alt=""
          className="mt-8 h-72 w-full rounded-xl object-cover shadow-sm sm:h-96"
        />
      ) : null}

      <div className="mt-8">
        <Markdown source={post.contentMd} />
      </div>
    </article>
  )
}
