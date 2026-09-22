import path from 'node:path'
import { Router } from 'express'
import { uploadsDir } from '../../config/dotenv'
import { AppError } from '../../middleware/errorHandler'
import { requireAuth } from '../../middleware/requireAuth'
import { upload } from '../../middleware/upload'

export const uploadsRouter = Router()

uploadsRouter.use(requireAuth)

uploadsRouter.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    throw AppError.badRequest('No image was uploaded. Send it as the "file" field.')
  }

  // Store forward slashes regardless of platform so the value is a valid URL.
  const relative = path.relative(uploadsDir, req.file.path).split(path.sep).join('/')

  res.status(201).json({ path: `/uploads/${relative}` })
})
