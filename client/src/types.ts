export type PostStatus = 'draft' | 'published'

export interface PostSummary {
  id: number
  title: string
  slug: string
  excerpt: string | null
  coverImagePath: string | null
  status: PostStatus
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PostDetail extends PostSummary {
  contentMd: string
}

export interface Paginated<T> {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AdminUser {
  id: number
  email: string
  name: string
}

export interface DashboardStats {
  total: number
  published: number
  draft: number
}
