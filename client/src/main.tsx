import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

// Vendor CSS is imported here rather than from index.css so Vite resolves the
// package paths directly. Loading it first also lets the Tailwind layer below
// win any specificity ties.
import '@fontsource-variable/inter'
// The public site's faces: Lato for headlines and reading copy, Tajawal for
// the small section labels. Both are static families, so each weight the type
// scale asks for is imported by number.
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'
import '@fontsource/lato/900.css'
import '@fontsource/tajawal/700.css'
// The brand name in the hero headline. Montserrat is variable, so one file
// covers the whole weight range.
import '@fontsource-variable/montserrat'
import '@uiw/react-markdown-preview/markdown.css'
import './index.css'

import { ToastProvider } from './components/ui/Toast'
import { AuthProvider } from './contexts/AuthContext'
import { queryClient } from './lib/queryClient'
import { router } from './router'

const container = document.getElementById('root')
if (!container) throw new Error('index.html is missing the #root element')

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>,
)
