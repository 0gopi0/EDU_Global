import { Suspense, lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { PageSpinner } from './components/ui/Spinner'
import { AdminLayout } from './layouts/AdminLayout'
import { PublicLayout } from './layouts/PublicLayout'
import { Dashboard } from './pages/admin/Dashboard'
import { Login } from './pages/admin/Login'
import { PostList } from './pages/admin/PostList'
import { BlogList } from './pages/public/BlogList'
import { BlogPost } from './pages/public/BlogPost'
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

// A data router is used rather than <BrowserRouter> because the post editor
// relies on `useBlocker` to warn about unsaved changes during in-app
// navigation, and that hook is only available on a data router.
export const router = createBrowserRouter([
  // Home is the marketing landing page and brings its own dark nav and footer,
  // so it sits outside PublicLayout — nesting it would stack two headers.
  { index: true, element: <Home /> },

  {
    element: <PublicLayout />,
    children: [
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
])
