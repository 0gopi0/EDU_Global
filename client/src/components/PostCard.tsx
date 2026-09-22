import { CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../lib/format'
import type { PostSummary } from '../types'
import { StatusBadge } from './ui/Badge'

/** Blog listing card. Used on the home page and the blog index. */
export function PostCard({ post, showStatus = false }: { post: PostSummary; showStatus?: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70 transition-shadow hover:shadow-md">
      <Link to={`/blog/${post.slug}`} className="block overflow-hidden">
        {post.coverImagePath ? (
          <img
            src={post.coverImagePath}
            alt=""
            className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-44 w-full bg-gradient-to-br from-brand-100 via-brand-50 to-slate-100" />
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          <time dateTime={post.publishedAt ?? post.createdAt}>
            {formatDate(post.publishedAt ?? post.createdAt)}
          </time>
          {showStatus ? <StatusBadge status={post.status} /> : null}
        </div>

        <h3 className="text-base font-semibold text-slate-900">
          <Link to={`/blog/${post.slug}`} className="hover:text-brand-700">
            {post.title}
          </Link>
        </h3>

        {post.excerpt ? (
          <p className="line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>
        ) : null}

        <Link
          to={`/blog/${post.slug}`}
          className="mt-auto text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Read more →
        </Link>
      </div>
    </article>
  )
}
