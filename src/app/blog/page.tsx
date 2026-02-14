"use client";
import { BlogPost } from "@/lib/blog";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

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
    <div className="mx-auto max-w-2xl px-6 pt-5 pb-16">
      <h1 className="text-3xl font-medium tracking-tight text-foreground mb-1">
        Blog
      </h1>
      <p className="text-muted-foreground mb-8">Just some thoughts</p>

      <div className="space-y-5">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block border-b border-border pb-5 last:border-0"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <time
              dateTime={post.date}
              className="text-xs text-muted-foreground mt-1 block"
            >
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            {post.excerpt && (
              <p className="text-muted-foreground text-base leading-relaxed mt-1">
                {post.excerpt}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
