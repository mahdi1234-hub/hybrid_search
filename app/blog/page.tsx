import Image from 'next/image'
import Link from 'next/link'

import { getPosts } from '@/lib/marblecms'

export const revalidate = 60

export default async function BlogPage() {
  let posts: any[] = []
  let error: string | null = null

  try {
    const data = await getPosts()
    posts = data.posts
  } catch (e: any) {
    error = e.message
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to Search
          </Link>
          <h1 className="text-4xl font-bold mt-4 mb-2">Blog</h1>
          <p className="text-muted-foreground text-lg">
            Latest updates and articles from the Slayma team
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 mb-6">
            Failed to load blog posts: {error}
          </div>
        )}

        {posts.length === 0 && !error && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No blog posts yet.</p>
            <p className="text-sm mt-2">Check back later for updates!</p>
          </div>
        )}

        <div className="grid gap-8">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="border rounded-xl overflow-hidden hover:border-foreground/20 transition-colors bg-card">
                {post.coverImage && (
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                    {post.category && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {post.category.name}
                      </span>
                    )}
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="text-muted-foreground line-clamp-2">
                      {post.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-4">
                    {post.authors?.map((author: any) => (
                      <div
                        key={author.id}
                        className="flex items-center gap-2"
                      >
                        {author.image && (
                          <Image
                            src={author.image}
                            alt={author.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {author.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
