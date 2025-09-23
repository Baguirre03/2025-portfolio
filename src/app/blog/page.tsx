"use client";
import { BlogPost } from "@/lib/blog";
import { BlogH1 } from "@/components/blog-h1";
import { useEffect, useState } from "react";

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  useEffect(() => {
    fetch("/api/recent-posts")
      .then((r) => r.json())
      .then(setBlogPosts)
      .catch(() => setBlogPosts([]));
  }, []);

  if (blogPosts.length === 0) {
    return <div>...posts coming soon</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8">
      <div className="mt-16 space-y-6">
        {blogPosts.map((post) => (
          <div
            key={post.slug}
            className="border-b border-border pb-6 last:border-b-0"
          >
            <BlogH1
              title={post.title}
              href={`/blog/${post.slug}`}
              size="lg"
              index={-1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
