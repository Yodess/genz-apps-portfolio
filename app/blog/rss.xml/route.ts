import { getAllPosts } from '@/lib/blog'
import { Feed } from 'feed'

const SITE_URL = 'https://www.genz-apps.com'

export async function GET() {
  const posts = getAllPosts()

  const feed = new Feed({
    title: 'Blog — GenZ Apps',
    description: 'Développement d\'applications, digitalisation et retours d\'expérience de GenZ Apps.',
    id: SITE_URL,
    link: SITE_URL,
    language: 'fr',
    copyright: `© ${new Date().getFullYear()} GenZ Apps`,
    author: {
      name: 'GenZ Apps',
      email: 'contact@genz-apps.com',
      link: SITE_URL,
    },
  })

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/blog/${post.slug}`,
      link: `${SITE_URL}/blog/${post.slug}`,
      description: post.excerpt,
      date: new Date(post.date),
      category: post.tags.map((t) => ({ name: t })),
    })
  })

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
