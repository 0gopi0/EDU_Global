import { FileText, LayoutDashboard, LogOut, Plus, SquareArrowOutUpRight } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../lib/cn'

function NavItem({
  to,
  icon,
  label,
  end = false,
}: {
  to: string
  icon: ReactNode
  label: string
  end?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
          isActive
            ? 'bg-brand-50 text-brand-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await logout()
      navigate('/admin/login', { replace: true })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-slate-50 lg:flex-row">
      <aside className="sticky top-0 z-30 flex flex-col border-b border-slate-200 bg-white lg:h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
              EG
            </span>
            <span className="text-sm font-semibold text-slate-900">Admin panel</span>
          </Link>

          <Link
            to="/"
            title="View site"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <SquareArrowOutUpRight className="h-4 w-4" />
            <span className="sr-only">View site</span>
          </Link>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible">
          <NavItem to="/admin" end icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
          <NavItem to="/admin/posts" end icon={<FileText className="h-4 w-4" />} label="Posts" />
          <NavItem to="/admin/posts/new" icon={<Plus className="h-4 w-4" />} label="New post" />
        </nav>

        <div className="border-t border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-700">{user?.name}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              loading={signingOut}
              onClick={handleSignOut}
              title="Sign out"
              icon={<LogOut className="h-4 w-4" />}
            >
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  )
}
