import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../raycast-installs/route";

describe("GET /api/raycast-installs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns install count when found in HTML", async () => {
    const mockHtml = '<div>>195<!-- --> Installs</div>';
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      }),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.installs).toBe(195);
    expect(data.formatted).toBe("195");
  });

  it("returns install count with comma formatting", async () => {
    const mockHtml = '<div>>1,234<!-- --> Installs</div>';
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      }),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.installs).toBe(1234);
    expect(data.formatted).toBe("1,234");
  });

  it("returns error when install count not found", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve("<html><body>No installs here</body></html>"),
      }),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.installs).toBeNull();
    expect(data.error).toBe("Could not find install count");
  });

  it("returns 500 on fetch failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error")),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.installs).toBeNull();
    expect(data.error).toBe("Failed to fetch install count");
  });
});
