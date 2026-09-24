import { Suspense, lazy, useLayoutEffect, useRef } from 'react'
import {
  Navigate,
  Outlet,
  createBrowserRouter,
  useLocation,
  useNavigationType,
  type RouteObject,
} from 'react-router-dom'
import { PageSpinner } from './components/ui/Spinner'
import { AdminLayout } from './layouts/AdminLayout'
import { SiteLayout, type SiteRouteHandle } from './layouts/SiteLayout'
import { Dashboard } from './pages/admin/Dashboard'
import { Login } from './pages/admin/Login'
import { PostList } from './pages/admin/PostList'
import { About } from './pages/public/About'
import { Admissions } from './pages/public/Admissions'
import { BlogList } from './pages/public/BlogList'
import { BlogPost } from './pages/public/BlogPost'
import { Contact } from './pages/public/Contact'
import { Franchise } from './pages/public/Franchise'
import { Home } from './pages/public/Home'
import { NotFound } from './pages/public/NotFound'
import { ProtectedRoute } from './routes/ProtectedRoute'

// The markdown editor is the heaviest dependency in the app and only the admin
// editor uses it, so it is split into a separate chunk. Visitors to the public
// blog never download it.
const PostEditor = lazy(() =>
  import('./pages/admin/PostEditor').then((module) => ({ default: module.PostEditor })),
)

function LazyEditor() {
  return (
    <Suspense fallback={<PageSpinner label="Loading editor…" />}>
      <PostEditor />
    </Suspense>
  )
}

/**
 * Wraps every route. Router navigations open the new page at the top —
 * otherwise the browser keeps the previous offset, and a link at the foot of
 * one page lands halfway down the next. A link with a `#hash` lands on that
 * element instead: instantly when it opens a new page, smoothly when it only
 * moves within the current one. Back/forward (POP) is left to the browser,
 * except that a deep link opened directly is honoured once the page exists.
 */
function RootLayout() {
  const { key, pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  const previousPath = useRef(pathname)
  const firstRender = useRef(true)

  useLayoutEffect(() => {
    const initial = firstRender.current
    firstRender.current = false
    const samePage = !initial && previousPath.current === pathname
    previousPath.current = pathname
    if (navigationType === 'POP' && !initial) return

    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) {
      target.scrollIntoView({ behavior: samePage ? 'smooth' : 'instant', block: 'start' })
      return
    }
    if (!initial) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [key, pathname, hash, navigationType])

  return <Outlet />
}

const noFooterCta: SiteRouteHandle = { footerCta: false }

const routes: RouteObject[] = [
  {
    element: <SiteLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      // Franchise and Contact end in their own enquiry form.
      { path: 'franchise', element: <Franchise />, handle: noFooterCta },
      { path: 'admissions', element: <Admissions /> },
      { path: 'contact', element: <Contact />, handle: noFooterCta },
      { path: 'blog', element: <BlogList /> },
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: '*', element: <NotFound /> },
    ],
  },

  // Sits outside AdminLayout so the sidebar is not wrapped around a
  // signed-out form.
  { path: '/admin/login', element: <Login /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'posts', element: <PostList /> },
          { path: 'posts/new', element: <LazyEditor /> },
          { path: 'posts/:id/edit', element: <LazyEditor /> },
        ],
      },
    ],
  },

  { path: '/admin/*', element: <Navigate to="/admin" replace /> },
]

// A data router is used rather than <BrowserRouter> because the post editor
// relies on `useBlocker` to warn about unsaved changes during in-app
// navigation, and that hook is only available on a data router.
export const router = createBrowserRouter([{ element: <RootLayout />, children: routes }])
