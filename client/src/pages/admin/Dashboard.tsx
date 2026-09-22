import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, FileText, Plus, SquarePen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../../components/ui/Badge'
import { Card, CardHeader } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { PageSpinner } from '../../components/ui/Spinner'
import { api } from '../../lib/api'
import { formatDate } from '../../lib/format'
import type { DashboardStats, PostSummary } from '../../types'

interface StatsResponse {
  counts: DashboardStats
  recent: PostSummary[]
}

export function Dashboard() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get<StatsResponse>('/api/admin/stats'),
  })

  if (isPending) return <PageSpinner label="Loading dashboard…" />

  if (isError) {
    return (
      <EmptyState
        icon={<FileText className="h-5 w-5" />}
        title="Dashboard unavailable"
        description="Your stats could not be loaded. Please refresh the page."
      />
    )
  }

  const cards = [
    { label: 'Total posts', value: data.counts.total, icon: FileText, tint: 'bg-slate-100 text-slate-600' },
    { label: 'Published', value: data.counts.published, icon: CheckCircle2, tint: 'bg-emerald-50 text-emerald-600' },
    { label: 'Drafts', value: data.counts.draft, icon: SquarePen, tint: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">An overview of your blog.</p>
        </div>

        <Link
          to="/admin/posts/new"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          New post
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, tint }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${tint}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader
          title="Recent posts"
          action={
            <Link
              to="/admin/posts"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all →
            </Link>
          }
        />

        {data.recent.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-5 w-5" />}
            title="No posts yet"
            description="Write your first article and it will show up here."
            action={
              <Link
                to="/admin/posts/new"
                className="mt-1 inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                <Plus className="h-4 w-4" />
                New post
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-200/70">
            {data.recent.map((post) => (
              <li key={post.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <Link
                    to={`/admin/posts/${post.id}/edit`}
                    className="block truncate text-sm font-medium text-slate-800 hover:text-brand-700"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-slate-500">
                    Updated {formatDate(post.updatedAt)}
                  </p>
                </div>

                <StatusBadge status={post.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
