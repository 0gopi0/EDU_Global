import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

// Vendor CSS is imported here rather than from index.css so Vite resolves the
// package paths directly. Loading it first also lets the Tailwind layer below
// win any specificity ties.
import '@fontsource-variable/inter'
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
