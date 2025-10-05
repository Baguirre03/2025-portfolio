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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div>...posts coming soon</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pt-5 lg:px-8">
      <div className="divide-y divide-border">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="py-8 transition-all -mx-4 px-4 rounded-lg"
          >
            <div className="space-y-3">
              <BlogH1
                title={post.title}
                href={`/blog/${post.slug}`}
                size="lg"
              />
              {post.excerpt && (
                <p className="text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
