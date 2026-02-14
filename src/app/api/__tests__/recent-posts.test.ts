import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../recent-posts/route";

vi.mock("@/lib/blog", () => ({
  getAllBlogPosts: vi.fn(() => [
    {
      slug: "first-post",
      title: "First Post",
      date: "2026-02-01",
      excerpt: "First excerpt",
      content: "# Hello",
    },
    {
      slug: "second-post",
      title: "Second Post",
      date: "2026-01-15",
      excerpt: "Second excerpt",
      content: "# World",
    },
    {
      slug: "third-post",
      title: "Third Post",
      date: "2026-01-01",
      excerpt: "Third excerpt",
      content: "# Foo",
    },
  ]),
}));

describe("GET /api/recent-posts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all posts when no limit is provided", async () => {
    const request = new Request("http://localhost:3000/api/recent-posts");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(3);
    expect(data[0]).toEqual({
      slug: "first-post",
      title: "First Post",
      date: "2026-02-01",
      excerpt: "First excerpt",
    });
  });

  it("limits posts when limit query param is provided", async () => {
    const request = new Request(
      "http://localhost:3000/api/recent-posts?limit=2",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0].slug).toBe("first-post");
    expect(data[1].slug).toBe("second-post");
  });

  it("ignores invalid limit (NaN)", async () => {
    const request = new Request(
      "http://localhost:3000/api/recent-posts?limit=invalid",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(3);
  });

  it("ignores zero or negative limit", async () => {
    const request = new Request(
      "http://localhost:3000/api/recent-posts?limit=0",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(3);
  });

  it("excludes content from response", async () => {
    const request = new Request("http://localhost:3000/api/recent-posts");
    const response = await GET(request);
    const data = await response.json();

    expect(data[0]).not.toHaveProperty("content");
  });
});
