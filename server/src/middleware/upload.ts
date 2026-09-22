import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import multer from 'multer'
import { uploadsDir } from '../config/dotenv'
import { maxUploadBytes } from '../config/env'
import { AppError } from './errorHandler'

/**
 * The only image types accepted. The stored extension comes from this table,
 * never from the client-supplied filename, so a file cannot be given an
 * extension that the server would treat as executable.
 */
const EXTENSION_BY_MIME = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
])

export const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, done) => {
      const now = new Date()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const folder = path.join(uploadsDir, String(now.getFullYear()), month)

      fs.mkdir(folder, { recursive: true })
        .then(() => done(null, folder))
        .catch((error: unknown) =>
          done(error instanceof Error ? error : new Error(String(error)), ''),
        )
    },

    filename: (_req, file, done) => {
      const extension = EXTENSION_BY_MIME.get(file.mimetype) ?? '.bin'
      done(null, `${crypto.randomUUID()}${extension}`)
    },
  }),

  limits: { fileSize: maxUploadBytes, files: 1 },

  fileFilter: (_req, file, done) => {
    if (EXTENSION_BY_MIME.has(file.mimetype)) {
      done(null, true)
      return
    }

    done(AppError.badRequest('Only JPEG, PNG, WebP and GIF images can be uploaded.'))
  },
})
