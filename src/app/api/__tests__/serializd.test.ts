import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../serializd/route";

const mockHtmlWithNextData = `
<!DOCTYPE html>
<html>
<head></head>
<body>
  <script id="__NEXT_DATA__" type="application/json">
  {"props":{"pageProps":{"data":{"details":{"showWatchedCount":42,"reviewCount":10}}}}}
  </script>
</body>
</html>
`;

describe("GET /api/serializd", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    process.env = { ...originalEnv };
  });

  it("returns Serializd data on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtmlWithNextData),
      }),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.username).toBeDefined();
    expect(data.profileUrl).toContain("serializd.com");
    expect(data.watchedUrl).toBeDefined();
    expect(data.reviewsUrl).toBeDefined();
    expect(data.showWatchedCount).toBe(42);
    expect(data.reviewCount).toBe(10);
    expect(response.headers.get("Cache-Control")).toContain("s-maxage=3600");
  });

  it("uses SERIALIZD_USERNAME env when set", async () => {
    process.env.SERIALIZD_USERNAME = "customuser";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtmlWithNextData),
      }),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.username).toBe("customuser");
    expect(data.profileUrl).toContain("customuser");
  });

  it("returns 500 and null values on fetch failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false }),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to load Serializd");
    expect(data.profileUrl).toBeNull();
    expect(data.watchedUrl).toBeNull();
    expect(data.reviewsUrl).toBeNull();
    expect(data.showWatchedCount).toBeNull();
    expect(data.reviewCount).toBeNull();
  });
});
