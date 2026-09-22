import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import MDEditor from '@uiw/react-md-editor'
import { ArrowLeft, ExternalLink, FileQuestion, Info } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useBeforeUnload, useBlocker, useNavigate, useParams } from 'react-router-dom'
import rehypeSanitize from 'rehype-sanitize'
import { CoverUpload } from '../../components/CoverUpload'
import { StatusBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Field, Input, Textarea } from '../../components/ui/Form'
import { ConfirmDialog } from '../../components/ui/Modal'
import { PageSpinner } from '../../components/ui/Spinner'
import { useToast } from '../../components/ui/Toast'
import { ApiError, api } from '../../lib/api'
import { formatDateTime } from '../../lib/format'
import { slugify } from '../../lib/slug'
import type { PostDetail, PostStatus } from '../../types'

const EXCERPT_LIMIT = 500

interface FormState {
  title: string
  slug: string
  excerpt: string
  contentMd: string
  coverImagePath: string | null
  status: PostStatus
}

const EMPTY_FORM: FormState = {
  title: '',
  slug: '',
  excerpt: '',
  contentMd: '',
  coverImagePath: null,
  status: 'draft',
}

export function PostEditor() {
  const { id } = useParams<{ id: string }>()
  const postId = id ? Number(id) : null
  const isEdit = postId !== null && Number.isInteger(postId)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const toast = useToast()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [slugEdited, setSlugEdited] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<PostStatus | null>(null)

  // Lets the post-save redirect through the unsaved-changes blocker, which
  // would otherwise see the pre-save `dirty` value and stop navigation.
  const allowNavigation = useRef(false)

  const postQuery = useQuery({
    queryKey: ['admin', 'post', postId],
    queryFn: () => api.get<{ post: PostDetail }>(`/api/admin/posts/${postId}`),
    enabled: isEdit,
    retry: false,
  })

  // Seeds the form once, when the existing post arrives.
  useEffect(() => {
    if (!postQuery.data || seeded) return

    const { post } = postQuery.data
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? '',
      contentMd: post.contentMd,
      coverImagePath: post.coverImagePath,
      status: post.status,
    })
    // An existing post already has a deliberate slug, so stop deriving it.
    setSlugEdited(true)
    setSeeded(true)
  }, [postQuery.data, seeded])

  // Mirrors the title into the slug until the slug is edited by hand.
  useEffect(() => {
    if (slugEdited) return
    setForm((current) => ({ ...current, slug: slugify(current.title) }))
  }, [form.title, slugEdited])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setDirty(true)

    // Any edit re-arms the navigation guard.
    allowNavigation.current = false

    // Clear the inline error for the field being edited.
    setFieldErrors((current) => {
      const next = { ...current }
      delete next[key as string]
      return next
    })
  }

  const saveMutation = useMutation({
    mutationFn: (status: PostStatus) => {
      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt.trim() ? form.excerpt : null,
        contentMd: form.contentMd,
        coverImagePath: form.coverImagePath,
        status,
      }

      return isEdit
        ? api.put<{ post: PostDetail }>(`/api/admin/posts/${postId}`, payload)
        : api.post<{ post: PostDetail }>('/api/admin/posts', payload)
    },

    onSuccess: (data) => {
      setDirty(false)
      setFieldErrors({})
      setForm((current) => ({ ...current, status: data.post.status }))
      toast.success(isEdit ? 'Post saved.' : 'Post created.')

      void queryClient.invalidateQueries({ queryKey: ['admin'] })
      void queryClient.invalidateQueries({ queryKey: ['posts'] })

      if (!isEdit) {
        allowNavigation.current = true
        navigate(`/admin/posts/${data.post.id}/edit`, { replace: true })
      }
    },

    onError: (error) => {
      if (error instanceof ApiError) {
        setFieldErrors(error.fields ?? {})
        toast.error(error.message)
      } else {
        toast.error('That post could not be saved.')
      }
    },
  })

  function save(status: PostStatus) {
    setPendingStatus(status)
    saveMutation.mutate(status)
  }

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty &&
      !allowNavigation.current &&
      currentLocation.pathname !== nextLocation.pathname,
  )

  useBeforeUnload((event) => {
    if (dirty) event.preventDefault()
  })

  if (isEdit && postQuery.isPending) return <PageSpinner label="Loading post…" />

  if (isEdit && postQuery.isError) {
    const missing = postQuery.error instanceof ApiError && postQuery.error.status === 404

    return (
      <EmptyState
        icon={<FileQuestion className="h-5 w-5" />}
        title={missing ? 'Post not found' : 'Post could not be loaded'}
        description={
          missing
            ? 'It may have been deleted. Head back to the list to pick another.'
            : 'Please refresh the page and try again.'
        }
        action={
          <Link
            to="/admin/posts"
            className="mt-1 inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to posts
          </Link>
        }
      />
    )
  }

  const isPublished = form.status === 'published'
  const saving = saveMutation.isPending

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/posts"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            title="Back to posts"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to posts</span>
          </Link>

          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              {isEdit ? 'Edit post' : 'New post'}
            </h1>
            <p className="text-sm text-slate-500">
              {dirty ? 'Unsaved changes' : 'All changes saved'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPublished ? (
            <Link
              to={`/blog/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-300 ring-inset transition-colors hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4" />
              View
            </Link>
          ) : null}

          <Button
            variant="secondary"
            loading={saving && pendingStatus === 'draft'}
            disabled={saving}
            onClick={() => save('draft')}
          >
            {isPublished ? 'Unpublish' : 'Save draft'}
          </Button>

          <Button loading={saving && pendingStatus === 'published'} disabled={saving} onClick={() => save('published')}>
            {isPublished ? 'Save changes' : 'Publish'}
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <Card className="space-y-5 p-5">
            <Field label="Title" htmlFor="title" error={fieldErrors.title}>
              <Input
                id="title"
                value={form.title}
                onChange={(event) => update('title', event.target.value)}
                placeholder="How to choose the right university"
                invalid={Boolean(fieldErrors.title)}
              />
            </Field>

            <Field
              label="Slug"
              htmlFor="slug"
              hint={`/blog/${form.slug || '…'}`}
              error={fieldErrors.slug}
            >
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugEdited(true)
                    update('slug', event.target.value)
                  }}
                  placeholder="how-to-choose-the-right-university"
                  invalid={Boolean(fieldErrors.slug)}
                />
                {slugEdited ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSlugEdited(false)
                      update('slug', slugify(form.title))
                    }}
                  >
                    Reset
                  </Button>
                ) : null}
              </div>
            </Field>

            <Field
              label="Excerpt"
              htmlFor="excerpt"
              hint={`${form.excerpt.length}/${EXCERPT_LIMIT} characters — shown on the blog listing.`}
              error={fieldErrors.excerpt}
            >
              <Textarea
                id="excerpt"
                rows={2}
                maxLength={EXCERPT_LIMIT}
                value={form.excerpt}
                onChange={(event) => update('excerpt', event.target.value)}
                placeholder="A one or two sentence summary of the article."
                invalid={Boolean(fieldErrors.excerpt)}
              />
            </Field>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader title="Body" description="Written in Markdown, with a live preview." />

            <div className="p-1" data-color-mode="light">
              <MDEditor
                value={form.contentMd}
                onChange={(value) => update('contentMd', value ?? '')}
                height={560}
                previewOptions={{ rehypePlugins: [rehypeSanitize] }}
              />
            </div>

            {fieldErrors.contentMd ? (
              <p className="px-5 pb-4 text-sm text-red-600">{fieldErrors.contentMd}</p>
            ) : null}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Status"
              action={<StatusBadge status={form.status} />}
            />

            <div className="space-y-3 p-5 text-sm text-slate-600">
              <p>
                {isPublished
                  ? 'This post is live on the blog.'
                  : 'This post is a draft and is not visible to visitors.'}
              </p>

              {postQuery.data ? (
                <dl className="space-y-1 border-t border-slate-200/70 pt-3 text-xs text-slate-500">
                  <div className="flex justify-between gap-3">
                    <dt>Created</dt>
                    <dd>{formatDateTime(postQuery.data.post.createdAt)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Updated</dt>
                    <dd>{formatDateTime(postQuery.data.post.updatedAt)}</dd>
                  </div>
                  {postQuery.data.post.publishedAt ? (
                    <div className="flex justify-between gap-3">
                      <dt>Published</dt>
                      <dd>{formatDateTime(postQuery.data.post.publishedAt)}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : (
                <p className="flex items-start gap-2 border-t border-slate-200/70 pt-3 text-xs text-slate-500">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Saving creates the post. Publish it when you are ready for it to be public.
                </p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Cover image" description="Shown on the listing and at the top of the post." />
            <div className="p-5">
              <CoverUpload
                value={form.coverImagePath}
                onChange={(path) => update('coverImagePath', path)}
              />
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={blocker.state === 'blocked'}
        title="Discard unsaved changes?"
        description="This post has changes that have not been saved. Leaving now will lose them."
        confirmLabel="Discard changes"
        destructive
        onConfirm={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      />
    </div>
  )
}
