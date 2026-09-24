import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CalendarDays, FileQuestion } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Markdown } from '../../components/Markdown'
import { SiteNotice, SiteSpinner } from '../../components/site/Feedback'
import { usePageTitle } from '../../components/site/hooks'
import { buttonClass } from '../../components/site/ui'
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

  usePageTitle(data?.post.title ?? 'Blog')

  if (isPending) return <SiteSpinner label="Loading article…" />

  if (isError) {
    const missing = error instanceof ApiError && error.status === 404

    return (
      <div className="container-site py-12">
        <SiteNotice
          icon={<FileQuestion className="h-6 w-6" />}
          title={missing ? 'Article not found' : 'Something went wrong'}
          description={
            missing
              ? 'This article may have been removed, or it is still a draft.'
              : 'The article could not be loaded. Please try again shortly.'
          }
          action={
            <Link to="/blog" className={buttonClass('primary')}>
              Back to the blog
            </Link>
          }
        />
      </div>
    )
  }

  const { post } = data

  return (
    <article className="bg-paper pb-20 sm:pb-28">
      <header className="container-site pt-12 sm:pt-16">
        <div className="mx-auto max-w-[46rem]">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-leaf transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            All articles
          </Link>

          <h1 className="mt-8 text-[clamp(2.25rem,1.4rem+3vw,3.75rem)] leading-[1.02] font-bold tracking-[-0.025em] text-balance">
            {post.title}
          </h1>

          <p className="mt-6 flex items-center gap-2 text-[0.9375rem] text-muted">
            <CalendarDays aria-hidden="true" className="h-4 w-4" />
            <time dateTime={post.publishedAt ?? post.createdAt}>
              {formatDate(post.publishedAt ?? post.createdAt)}
            </time>
          </p>

          {post.excerpt ? <p className="type-lede mt-6 text-ink">{post.excerpt}</p> : null}
        </div>
      </header>

      {post.coverImagePath ? (
        <div className="container-site mt-12">
          <img
            src={post.coverImagePath}
            alt=""
            className="mx-auto aspect-[16/9] w-full max-w-[64rem] rounded-[1.25rem] object-cover"
          />
        </div>
      ) : null}

      <div className="container-site mt-12">
        <div className="mx-auto max-w-[46rem]">
          <Markdown source={post.contentMd} />
        </div>
      </div>
    </article>
  )
}
