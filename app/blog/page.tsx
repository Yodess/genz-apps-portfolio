import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — GenZ Apps',
  description: 'Articles sur le développement d\'applications, la digitalisation des commerces en Algérie, et les coulisses de GenZ Apps.',
  openGraph: {
    title: 'Blog — GenZ Apps',
    description: 'Articles sur le développement d\'applications, la digitalisation des commerces en Algérie, et les coulisses de GenZ Apps.',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Développement d'applications, digitalisation, et retours d'expérience de GenZ Apps.
          </p>
        </div>
      </div>

      {/* Articles */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">Aucun article pour l'instant.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 p-6 rounded-2xl border bg-card hover:border-foreground/30 transition-all"
              >
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold leading-snug group-hover:underline underline-offset-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {post.excerpt}
                </p>

                {/* Date */}
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(post.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
