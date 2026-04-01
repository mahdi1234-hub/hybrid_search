import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPostBySlug, getPosts } from '@/lib/marblecms'

export const revalidate = 60

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: `${post.title} | Slayma Blog`,
    description: post.description || post.title,
    openGraph: {
      title: post.title,
      description: post.description || post.title,
      images: post.coverImage ? [post.coverImage] : []
    }
  }
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          &larr; Back to Blog
        </Link>

        <article className="mt-6">
          {post.coverImage && (
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
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

          <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

          <div className="flex items-center gap-3 mb-8 pb-8 border-b">
            {post.authors?.map(author => (
              <div key={author.id} className="flex items-center gap-3">
                {author.image && (
                  <Image
                    src={author.image}
                    alt={author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-sm">{author.name}</p>
                  <p className="text-xs text-muted-foreground">{author.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="prose prose-neutral dark:prose-invert max-w-none
              prose-headings:font-semibold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:mx-auto
              prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
