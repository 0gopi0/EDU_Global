/** An error response from the API, carrying the server's own message. */
export class ApiError extends Error {
  readonly status: number
  readonly code: string | undefined
  /** Field-keyed validation messages, when the server rejected a form. */
  readonly fields: Record<string, string> | undefined

  constructor(
    status: number,
    message: string,
    code?: string,
    fields?: Record<string, string>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
  }
}

interface ErrorEnvelope {
  error?: {
    message?: string
    code?: string
    fields?: Record<string, string>
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const isFormData = init.body instanceof FormData

  if (!isFormData && init.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(path, {
    // Required for the httpOnly session cookie. Same-origin thanks to the proxy.
    credentials: 'include',
    ...init,
    headers,
  })

  if (response.status === 204) return undefined as T

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const envelope = payload as ErrorEnvelope | null
    throw new ApiError(
      response.status,
      envelope?.error?.message ?? `Request failed with status ${response.status}.`,
      envelope?.error?.code,
      envelope?.error?.fields,
    )
  }

  return payload as T
}

function jsonBody(body: unknown): string | undefined {
  return body === undefined ? undefined : JSON.stringify(body)
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: jsonBody(body) }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: jsonBody(body) }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: jsonBody(body) }),

  delete: (path: string) => request<void>(path, { method: 'DELETE' }),

  upload: <T>(path: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return request<T>(path, { method: 'POST', body: form })
  },
}
