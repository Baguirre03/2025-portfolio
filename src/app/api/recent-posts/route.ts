import { NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");

  let posts = getAllBlogPosts();
  if (limitParam) {
    const limit = Number(limitParam);
    if (!Number.isNaN(limit) && limit > 0) {
      posts = posts.slice(0, limit);
    }
  }

  return NextResponse.json(
    posts.map(({ slug, title, date, excerpt }) => ({
      slug,
      title,
      date,
      excerpt,
    }))
  );
}
