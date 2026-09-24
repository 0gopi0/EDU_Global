import { Link } from 'react-router-dom'
import { formatDate } from '../lib/format'
import type { PostSummary } from '../types'
import { LogoMark } from './site/Logo'
import { TextLink } from './site/ui'
import { StatusBadge } from './ui/Badge'

/** Blog listing card on the public site. */
export function PostCard({
  post,
  showStatus = false,
}: {
  post: PostSummary
  showStatus?: boolean
}) {
  const href = `/blog/${post.slug}`

  return (
    <article className="group flex flex-col">
      <Link
        to={href}
        tabIndex={-1}
        aria-hidden="true"
        className="block aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-mist"
      >
        {post.coverImagePath ? (
          <img
            src={post.coverImagePath}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <span className="flex h-full items-center justify-center">
            <LogoMark className="h-10 w-10 opacity-30" />
          </span>
        )}
      </Link>

      <div className="mt-5 flex items-center gap-2 text-[0.875rem] text-muted">
        <time dateTime={post.publishedAt ?? post.createdAt}>
          {formatDate(post.publishedAt ?? post.createdAt)}
        </time>
        {showStatus ? <StatusBadge status={post.status} /> : null}
      </div>

      <h2 className="type-subheading mt-2">
        <Link to={href} className="transition-colors hover:text-leaf">
          {post.title}
        </Link>
      </h2>

      {post.excerpt ? <p className="mt-3 line-clamp-3">{post.excerpt}</p> : null}

      <TextLink to={href} className="mt-4 self-start">
        Read more
      </TextLink>
    </article>
  )
}
