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
      <div className="space-y-6">
        {blogPosts.map((post, index) => (
          <div
            key={post.slug}
            className={`border-b pt-6 border-border pb-6 ${
              index === 0 ? "border-t" : ""
            }`}
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
