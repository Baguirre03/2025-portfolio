import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../goodreads/route";

const mockRssXml = `
<rss>
  <channel>
    <item>
      <title><![CDATA[The Great Gatsby]]></title>
      <link><![CDATA[https://goodreads.com/book/123]]></link>
      <author_name>F. Scott Fitzgerald</author_name>
      <book_large_image_url><![CDATA[https://example.com/image.jpg]]></book_large_image_url>
      <user_read_at><![CDATA[2025-01-15]]></user_read_at>
    </item>
    <item>
      <title>1984</title>
      <link>https://goodreads.com/book/456</link>
      <author_name>George Orwell</author_name>
    </item>
  </channel>
</rss>
`;

describe("GET /api/goodreads", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    process.env = { ...originalEnv };
    process.env.GOODREADS_USER_ID = "12345";
    process.env.GOODREADS_USERNAME = "testuser";
  });

  it("returns 500 when credentials are not configured", async () => {
    delete process.env.GOODREADS_USER_ID;

    const request = new Request("http://localhost:3000/api/goodreads");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Goodreads credentials not configured");
  });

  it("returns books from RSS feed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockRssXml),
      }),
    );

    const request = new Request("http://localhost:3000/api/goodreads");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.books).toBeDefined();
    expect(data.books.length).toBeGreaterThanOrEqual(1);
    expect(data.books[0]).toMatchObject({
      title: expect.any(String),
      author: expect.any(String),
      link: expect.any(String),
    });
    expect(response.headers.get("Cache-Control")).toContain("s-maxage=3600");
  });

  it("respects limit query param", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockRssXml),
      }),
    );

    const request = new Request(
      "http://localhost:3000/api/goodreads?limit=1",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.books.length).toBeLessThanOrEqual(1);
  });

  it("returns 500 and empty books on fetch failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, statusText: "Not Found" }),
    );

    const request = new Request("http://localhost:3000/api/goodreads");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to load Goodreads data");
    expect(data.books).toEqual([]);
  });
});
