import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  date: string;
  readTime: string;
}

// This would typically come from a CMS, markdown files, or database
const posts: BlogPost[] = [
  {
    slug: "welcome-to-my-blog",
    title: "Welcome to My Blog",
    content: `
      <p>Welcome to my personal blog! I'm excited to share this space with you.</p>
      
      <p>This blog will be a place where I share my thoughts, experiences, and learnings across various topics that interest me. You can expect to find posts about technology, creativity, personal growth, and life in general.</p>
      
      <h2>What to Expect</h2>
      <p>I plan to write regularly about:</p>
      <ul>
        <li>Technical discoveries and learning experiences</li>
        <li>Creative projects and processes</li>
        <li>Personal reflections and insights</li>
        <li>Interesting finds and recommendations</li>
      </ul>
      
      <p>Thank you for taking the time to visit. I hope you find something here that resonates with you or sparks your curiosity.</p>
    `,
    date: "2024-01-15",
    readTime: "5 min read",
  },
  {
    slug: "building-this-website",
    title: "Building This Website",
    content: `
      <p>Creating this personal website has been an exciting journey. I wanted to share the technical decisions and process behind building it.</p>
      
      <h2>Technology Stack</h2>
      <p>I chose Next.js 15 with the App Router for several reasons:</p>
      <ul>
        <li>Modern React patterns with server components</li>
        <li>Excellent performance and SEO capabilities</li>
        <li>Built-in image optimization</li>
        <li>File-based routing system</li>
      </ul>
      
      <h2>Design Philosophy</h2>
      <p>The design focuses on simplicity and readability. I used Tailwind CSS for styling, which allowed me to:</p>
      <ul>
        <li>Maintain consistent spacing and typography</li>
        <li>Create responsive layouts easily</li>
        <li>Keep the bundle size optimized</li>
      </ul>
      
      <p>The goal was to create a clean, fast-loading site that puts content first while still feeling personal and unique.</p>
    `,
    date: "2024-01-10",
    readTime: "8 min read",
  },
  {
    slug: "thoughts-on-creativity",
    title: "Thoughts on Creativity",
    content: `
      <p>Creativity is something I've been thinking about a lot lately. What does it mean to be creative, and how can we nurture it in our daily lives?</p>
      
      <h2>Creativity as Problem Solving</h2>
      <p>I've come to see creativity not just as artistic expression, but as a fundamental way of approaching problems. Whether it's writing code, taking photos, or figuring out how to organize my day, creativity plays a role.</p>
      
      <h2>The Importance of Constraints</h2>
      <p>Paradoxically, I find that constraints often lead to more creative solutions. When we have unlimited options, it can be paralyzing. But when we have specific limitations to work within, our minds naturally start finding clever ways around them.</p>
      
      <h2>Daily Practice</h2>
      <p>Like any skill, creativity benefits from regular practice. This can be as simple as:</p>
      <ul>
        <li>Taking a different route to work</li>
        <li>Trying a new cooking technique</li>
        <li>Writing in a journal</li>
        <li>Learning something completely outside your field</li>
      </ul>
      
      <p>The key is staying curious and open to new experiences.</p>
    `,
    date: "2024-01-05",
    readTime: "6 min read",
  },
];

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Your Name`,
    description: post.content.substring(0, 160),
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          ← Back to Blog
        </Link>

        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-gray-600 space-x-4">
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
          </header>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}
