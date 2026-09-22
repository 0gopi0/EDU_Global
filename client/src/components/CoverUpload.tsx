import { ImagePlus, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { api } from '../lib/api'
import { Button } from './ui/Button'
import { Spinner } from './ui/Spinner'
import { useToast } from './ui/Toast'

export function CoverUpload({
  value,
  onChange,
}: {
  value: string | null
  onChange: (path: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const toast = useToast()

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const result = await api.upload<{ path: string }>('/api/admin/uploads', file)
      onChange(result.path)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'That image could not be uploaded.')
    } finally {
      setUploading(false)
      // Reset so choosing the same file twice still fires a change event.
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void handleFile(file)
        }}
      />

      {value ? (
        <div className="relative overflow-hidden rounded-lg ring-1 ring-slate-200">
          <img src={value} alt="Cover preview" className="h-44 w-full object-cover" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 transition-colors hover:border-brand-400 hover:text-brand-600 disabled:opacity-60"
        >
          {uploading ? <Spinner className="h-5 w-5" /> : <ImagePlus className="h-6 w-6" />}
          <span className="text-sm font-medium">
            {uploading ? 'Uploading…' : 'Upload a cover image'}
          </span>
          <span className="text-xs text-slate-400">JPEG, PNG, WebP or GIF</span>
        </button>
      )}

      {value ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            loading={uploading}
            onClick={() => inputRef.current?.click()}
            icon={<ImagePlus className="h-4 w-4" />}
          >
            Replace
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onChange(null)}
            icon={<Trash2 className="h-4 w-4" />}
          >
            Remove
          </Button>
        </div>
      ) : null}
    </div>
  )
}
