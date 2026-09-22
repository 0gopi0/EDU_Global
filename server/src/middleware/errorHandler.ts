import type { ErrorRequestHandler, RequestHandler } from 'express'
import multer from 'multer'
import { ZodError } from 'zod'
import { env, isProduction } from '../config/env'

/** An error that is safe to show the client, with a deliberate status code. */
export class AppError extends Error {
  readonly status: number
  readonly code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
  }

  static badRequest(message: string, code = 'BAD_REQUEST'): AppError {
    return new AppError(400, message, code)
  }

  static unauthorized(message = 'You must be signed in.', code = 'UNAUTHORIZED'): AppError {
    return new AppError(401, message, code)
  }

  static notFound(message = 'Not found.', code = 'NOT_FOUND'): AppError {
    return new AppError(404, message, code)
  }

  static conflict(message: string, code = 'CONFLICT'): AppError {
    return new AppError(409, message, code)
  }
}

/** Turns the first validation problem into a human-readable sentence. */
function describeZodError(error: ZodError): string {
  const first = error.issues[0]
  if (!first) return 'The request could not be validated.'

  const field = first.path.join('.')
  return field ? `${field}: ${first.message}` : first.message
}

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    error: {
      message: `No route matches ${req.method} ${req.originalUrl}`,
      code: 'NOT_FOUND',
    },
  })
}

/** Reads the HTTP status an error carries, if it carries a sane one. */
function errorStatus(error: unknown): number | null {
  if (error === null || typeof error !== 'object') return null

  const { status, statusCode } = error as { status?: unknown; statusCode?: unknown }
  const value = typeof status === 'number' ? status : statusCode

  if (typeof value !== 'number' || !Number.isInteger(value)) return null
  if (value < 400 || value > 599) return null

  return value
}

/** True for the SyntaxError body-parser raises on an unparseable JSON body. */
function isMalformedJson(error: unknown): boolean {
  return (
    error !== null &&
    typeof error === 'object' &&
    (error as { type?: unknown }).type === 'entity.parse.failed'
  )
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  // If the response already started, the only correct move is to let Express
  // tear down the connection.
  if (res.headersSent) {
    next(error)
    return
  }

  if (error instanceof AppError) {
    res.status(error.status).json({
      error: { message: error.message, ...(error.code ? { code: error.code } : {}) },
    })
    return
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        message: describeZodError(error),
        code: 'VALIDATION_ERROR',
        // Field-keyed messages so forms can highlight the offending input.
        fields: Object.fromEntries(
          error.issues.map((issue) => [issue.path.join('.') || '_', issue.message]),
        ),
      },
    })
    return
  }

  if (error instanceof multer.MulterError) {
    const message =
      error.code === 'LIMIT_FILE_SIZE'
        ? `That image is too large. The maximum size is ${env.MAX_UPLOAD_MB} MB.`
        : 'That upload could not be processed.'

    res.status(400).json({ error: { message, code: error.code } })
    return
  }

  // `express.json` and http-errors attach a numeric status to client mistakes.
  // Without this, a malformed request body would be reported as a server fault.
  const status = errorStatus(error)
  if (status !== null) {
    const malformed = isMalformedJson(error)

    res.status(status).json({
      error: {
        message: malformed
          ? 'The request body is not valid JSON.'
          : error instanceof Error
            ? error.message
            : String(error),
        code: malformed ? 'INVALID_JSON' : 'BAD_REQUEST',
      },
    })
    return
  }

  // Anything unrecognised is a bug. Log it in full; tell the client as little
  // as possible outside development.
  console.error('[error] Unhandled:', error)

  res.status(500).json({
    error: {
      message:
        isProduction || !(error instanceof Error)
          ? 'Something went wrong.'
          : error.message,
      code: 'INTERNAL_ERROR',
    },
  })
}
