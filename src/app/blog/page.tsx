"use client";
import { BlogPost } from "@/lib/blog";
import { BlogH1 } from "@/components/blog-h1";
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
    <div className="mx-auto max-w-4xl px-6 pt-5 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-medium text-foreground mb-2">Blog</h1>
        <p className="text-muted-foreground">Just some thoughts</p>
      </div>

      <div className="space-y-4">
        {blogPosts.map((post) => {
          return (
            <article
              key={post.slug}
              className="group border-b border-border pb-8 last:border-0 transition-all"
            >
              <div className="flex items-center justify-between gap-4 mb-2">
                <BlogH1
                  title={post.title}
                  href={`/blog/${post.slug}`}
                  size="lg"
                />
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-all translate-x-0 group-hover:translate-x-1 group-hover:text-foreground" />
              </div>

              <div
                className={`text-xs text-muted-foreground ${
                  post.excerpt ? "mb-2" : "mb-0"
                }`}
              >
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
