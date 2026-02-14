import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../letterboxd/route";

const mockRssXml = `
<rss xmlns:letterboxd="http://letterboxd.com/">
  <channel>
    <item>
      <letterboxd:filmTitle>Inception</letterboxd:filmTitle>
      <letterboxd:filmYear>2010</letterboxd:filmYear>
      <letterboxd:watchedDate>2025-01-20</letterboxd:watchedDate>
      <letterboxd:memberRating>4.5</letterboxd:memberRating>
      <link>https://letterboxd.com/film/inception/</link>
      <description><![CDATA[<img src="https://example.com/inception.jpg" />]]></description>
    </item>
  </channel>
</rss>
`;

describe("GET /api/letterboxd", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    process.env = { ...originalEnv };
    process.env.LETTERBOXD_USERNAME = "testuser";
  });

  it("returns 500 when username is not configured", async () => {
    delete process.env.LETTERBOXD_USERNAME;

    const request = new Request("http://localhost:3000/api/letterboxd");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Letterboxd username not configured");
  });

  it("returns movies from RSS feed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockRssXml),
      }),
    );

    const request = new Request("http://localhost:3000/api/letterboxd");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.movies).toBeDefined();
    expect(data.movies.length).toBeGreaterThanOrEqual(1);
    expect(data.movies[0]).toMatchObject({
      title: expect.any(String),
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
      "http://localhost:3000/api/letterboxd?limit=1",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.movies.length).toBeLessThanOrEqual(1);
  });

  it("returns 500 and empty movies on fetch failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, statusText: "Not Found" }),
    );

    const request = new Request("http://localhost:3000/api/letterboxd");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to load Letterboxd data");
    expect(data.movies).toEqual([]);
  });
});
