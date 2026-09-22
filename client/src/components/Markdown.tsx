import { lazy, Suspense } from 'react'
import rehypeSanitize from 'rehype-sanitize'

// The markdown pipeline (remark/rehype plus syntax highlighting) is by far the
// heaviest dependency in the app, and only the article page needs it. Loading it
// lazily keeps it out of the bundle for the home and listing pages.
const MarkdownPreview = lazy(() => import('@uiw/react-markdown-preview'))

function MarkdownSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
    </div>
  )
}

/**
 * Renders post bodies.
 *
 * `rehype-sanitize` strips raw HTML, event handlers and `javascript:` URLs, so
 * a compromised admin account cannot store a script that then runs for every
 * visitor. Raw HTML is therefore displayed as text rather than executed.
 */
export function Markdown({ source, className }: { source: string; className?: string }) {
  return (
    <Suspense fallback={<MarkdownSkeleton />}>
      <MarkdownPreview
        source={source}
        className={className}
        rehypePlugins={[rehypeSanitize]}
      />
    </Suspense>
  )
}
