import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | Your Name",
  description: "Thoughts, ideas, and stories from my journey.",
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

export default function Blog() {
  // This would typically come from a CMS, markdown files, or database
  const posts: BlogPost[] = [
    {
      slug: "welcome-to-my-blog",
      title: "Welcome to My Blog",
      excerpt:
        "An introduction to what you can expect from this space and why I decided to start writing.",
      date: "2024-01-15",
      readTime: "5 min read",
    },
    {
      slug: "building-this-website",
      title: "Building This Website",
      excerpt:
        "The technical journey of creating this personal website using Next.js and modern web technologies.",
      date: "2024-01-10",
      readTime: "8 min read",
    },
    {
      slug: "thoughts-on-creativity",
      title: "Thoughts on Creativity",
      excerpt:
        "Exploring what creativity means to me and how it influences both my work and personal projects.",
      date: "2024-01-05",
      readTime: "6 min read",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-xl text-gray-600 mb-12">
          Thoughts, ideas, and stories from my journey.
        </p>

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-gray-200 pb-8 last:border-b-0"
            >
              <Link href={`/blog/${post.slug}`} className="group">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No posts yet. Check back soon for new content!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
