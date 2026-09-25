import path from 'node:path'
import cookieParser from 'cookie-parser'
import express, { type Express } from 'express'
import helmet from 'helmet'
import { clientDistDir, uploadsDir } from './config/dotenv'
import { isProduction } from './config/env'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { authRouter } from './modules/auth/auth.routes'
import { healthRouter } from './modules/health/health.routes'
import { adminPostsRouter, publicPostsRouter } from './modules/posts/posts.routes'
import { statsRouter } from './modules/stats/stats.routes'
import { uploadsRouter } from './modules/uploads/uploads.routes'

/**
 * Builds the Express application. Separate from `index.ts` so the app can be
 * constructed without binding a port.
 */
export function createApp(): Express {
  const app = express()

  app.disable('x-powered-by')

  // Behind Hostinger's (LiteSpeed) reverse proxy: needed for a correct req.ip
  // in the login rate limiter and for X-Forwarded-Proto.
  app.set('trust proxy', 1)

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          // Post bodies may embed images hosted elsewhere, and the Tailwind and
          // markdown-editor styles are injected inline.
          imgSrc: ["'self'", 'data:', 'https:'],
          styleSrc: ["'self'", "'unsafe-inline'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          // Only meaningful over https. Leaving it on would break a local
          // `npm run build && npm start` preview over http.
          ...(isProduction ? {} : { upgradeInsecureRequests: null }),
        },
      },
    }),
  )

  app.use(express.json({ limit: '2mb' }))
  app.use(cookieParser())

  // Cover images. `index: false` prevents directory listings and
  // `dotfiles: 'deny'` keeps stray dotfiles unreachable.
  app.use(
    '/uploads',
    express.static(uploadsDir, { index: false, dotfiles: 'deny', maxAge: '7d' }),
  )

  app.use('/api/health', healthRouter)
  app.use('/api/auth', authRouter)
  app.use('/api/posts', publicPostsRouter)
  app.use('/api/admin/posts', adminPostsRouter)
  app.use('/api/admin/uploads', uploadsRouter)
  app.use('/api/admin/stats', statsRouter)

  if (isProduction) {
    app.use(express.static(clientDistDir, { index: false }))

    // SPA fallback so deep links and refreshes resolve. A RegExp is used
    // because Express 5 changed the meaning of string wildcards.
    app.get(/^(?!\/(api|uploads)(\/|$)).*/, (_req, res) => {
      res.sendFile(path.join(clientDistDir, 'index.html'))
    })
  }

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
