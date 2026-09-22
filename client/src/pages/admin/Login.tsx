import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Form'
import { PageSpinner } from '../../components/ui/Spinner'
import { useAuth } from '../../contexts/AuthContext'
import { ApiError } from '../../lib/api'

export function Login() {
  const { user, isLoading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? '/admin'

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : 'Sign in failed. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return <PageSpinner label="Checking your session…" />
  if (user) return <Navigate to={from} replace />

  return (
    <div className="flex min-h-full items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
            EG
          </span>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Sign in to the admin panel
            </h1>
            <p className="text-sm text-slate-500">Manage blog posts for EDU_Global.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70"
        >
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>

          <Field label="Password" htmlFor="password">
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>

          {error ? (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200 ring-inset"
            >
              {error}
            </p>
          ) : null}

          <Button type="submit" loading={submitting} className="w-full">
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm">
          <Link to="/" className="font-medium text-brand-600 hover:text-brand-700">
            ← Back to the site
          </Link>
        </p>
      </div>
    </div>
  )
}
