import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://www.raycast.com/ben_aguirre/google-calendar-quickadd",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Raycast page");
    }

    const html = await response.text();

    // The install count appears in the HTML like: >195<!-- --> Installs<
    const patterns = [
      />(\d+(?:,\d+)*)<!--\s*-->\s*Installs?</i,
      /(\d+(?:,\d+)*)\s*Installs?/i,
      /"installs?["\s:]+(\d+(?:,\d+)*)/i,
      /Avatar.*?(\d+(?:,\d+)*)\s*Installs?/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const installCount = match[1].replace(/,/g, "");
        return NextResponse.json({
          installs: parseInt(installCount, 10),
          formatted: match[1],
        });
      }
    }

    return NextResponse.json({
      installs: null,
      error: "Could not find install count",
    });
  } catch (error) {
    console.error("Error fetching Raycast installs:", error);
    return NextResponse.json(
      { installs: null, error: "Failed to fetch install count" },
      { status: 500 }
    );
  }
}
