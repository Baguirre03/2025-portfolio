import Link from "next/link";

const posts = [
  {
    id: 1,
    title: "Building Scalable React Applications",
    slug: "scalable-react-applications",
  },
  {
    id: 2,
    title: "Modern JavaScript Patterns and Best Practices",
    slug: "modern-javascript-patterns",
  },
  {
    id: 3,
    title: "Database Design for High-Performance Applications",
    slug: "database-design-performance",
  },
  {
    id: 4,
    title: "API Architecture: REST vs GraphQL",
    slug: "api-architecture-rest-graphql",
  },
  {
    id: 5,
    title: "Deployment Strategies for Modern Web Apps",
    slug: "deployment-strategies-web-apps",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-5xl">
          Blog
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Technical thoughts and insights on software development
        </p>
      </div>

      <div className="mt-16 space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border-b border-border pb-6 last:border-b-0"
          >
            <h2 className="text-xl font-medium text-foreground hover:text-accent transition-colors">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
