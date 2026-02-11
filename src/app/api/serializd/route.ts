import { NextResponse } from "next/server";

const SERIALIZD_BASE = "https://www.serializd.com";

export async function GET() {
  try {
    const username = process.env.SERIALIZD_USERNAME ?? "baguirre";
    const url = `${SERIALIZD_BASE}/user/${username}/shows`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Serializd returned ${res.status}`);
    }

    const html = await res.text();
    const nextData = parseNextData(html);

    const details = nextData?.props?.pageProps?.data?.details ?? {};
    const profileUrl = `${SERIALIZD_BASE}/user/${username}`;
    const reviewsUrl = `${profileUrl}/reviews`;
    const watchedUrl = `${profileUrl}/shows`;

    return NextResponse.json(
      {
        profileUrl,
        reviewsUrl,
        watchedUrl,
        username,
        showWatchedCount: details.showWatchedCount ?? null,
        reviewCount: details.reviewCount ?? null,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching Serializd:", error);
    return NextResponse.json(
      {
        error: "Failed to load Serializd",
        profileUrl: null,
        watchedUrl: null,
        reviewsUrl: null,
        showWatchedCount: null,
        reviewCount: null,
      },
      { status: 500 },
    );
  }
}

interface NextData {
  props?: {
    pageProps?: {
      data?: { details?: { showWatchedCount?: number; reviewCount?: number } };
    };
  };
}

function parseNextData(html: string): NextData | null {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim()) as NextData;
  } catch {
    return null;
  }
}
