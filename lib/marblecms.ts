const MARBLECMS_API_URL = 'https://api.marblecms.com/v1'

interface Author {
  id: string
  name: string
  image: string | null
  bio: string | null
  role: string
  slug: string
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
}

interface Tag {
  id: string
  name: string
  slug: string
  description: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  status: string
  content: string
  featured: boolean
  coverImage: string | null
  description: string | null
  publishedAt: string
  updatedAt: string
  authors: Author[]
  category: Category | null
  tags: Tag[]
}

interface PostsResponse {
  posts: BlogPost[]
  pagination: {
    limit: number
    currentPage: number
    nextPage: number | null
    previousPage: number | null
    totalPages: number
    totalItems: number
  }
}

async function marbleFetch(endpoint: string) {
  const apiKey = process.env.MARBLECMS_API_KEY
  if (!apiKey) {
    throw new Error('MARBLECMS_API_KEY is not set')
  }

  const res = await fetch(`${MARBLECMS_API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    next: { revalidate: 60 } // revalidate every 60 seconds
  })

  if (!res.ok) {
    throw new Error(`MarbleCMS API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function getPosts(
  page = 1,
  limit = 10
): Promise<PostsResponse> {
  return marbleFetch(`/posts?page=${page}&limit=${limit}`)
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const data: PostsResponse = await marbleFetch('/posts')
    const post = data.posts.find(p => p.slug === slug)
    return post || null
  } catch {
    return null
  }
}
