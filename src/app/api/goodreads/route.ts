import { NextResponse } from "next/server";

interface GoodreadsBook {
  title: string;
  author: string;
  link: string;
  imageUrl?: string;
  readAt?: string;
}

export async function GET(request: Request) {
  try {
    const goodreadsUserId = process.env.GOODREADS_USER_ID;
    const goodreadsUsername = process.env.GOODREADS_USERNAME;

    if (!goodreadsUserId || !goodreadsUsername) {
      return NextResponse.json(
        { error: "Goodreads credentials not configured" },
        { status: 500 },
      );
    }

    const rssUrl = `https://www.goodreads.com/review/list_rss/${goodreadsUserId}-${goodreadsUsername}`;

    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Goodreads RSS: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const limitParam = new URL(request.url).searchParams.get("limit");
    const limit = limitParam
      ? Math.min(parseInt(limitParam, 10) || 0, 500)
      : undefined;
    const books = parseGoodreadsRSS(xmlText).sort((a, b) => {
      if (!a.readAt && !b.readAt) return 0;
      if (!a.readAt) return 1;
      if (!b.readAt) return -1;
      return new Date(b.readAt).getTime() - new Date(a.readAt).getTime();
    });
    const result = limit != null ? books.slice(0, limit) : books;

    return NextResponse.json(
      { books: result },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching Goodreads data:", error);
    return NextResponse.json(
      { error: "Failed to load Goodreads data", books: [] },
      { status: 500 },
    );
  }
}

function parseGoodreadsRSS(xmlText: string): GoodreadsBook[] {
  const books: GoodreadsBook[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];

    // Extract title (handles CDATA)
    const titleMatch = itemContent.match(
      /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/,
    );
    // Extract link (handles CDATA)
    const linkMatch = itemContent.match(
      /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/,
    );
    // Extract author_name (no CDATA wrapper in the XML)
    const authorMatch = itemContent.match(
      /<author_name>([\s\S]*?)<\/author_name>/,
    );
    // Extract book_large_image_url (handles CDATA)
    const imageMatch = itemContent.match(
      /<book_large_image_url>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/book_large_image_url>/,
    );
    // Extract user_read_at (handles CDATA)
    const readAtMatch = itemContent.match(
      /<user_read_at>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/user_read_at>/,
    );

    if (titleMatch && linkMatch) {
      const title = titleMatch[1].trim();
      const author = authorMatch ? authorMatch[1].trim() : "Unknown Author";
      const readAt = readAtMatch ? readAtMatch[1].trim() : undefined;

      books.push({
        title,
        author,
        link: linkMatch[1].trim(),
        imageUrl: imageMatch ? imageMatch[1].trim() : undefined,
        readAt,
      });
    }
  }

  return books;
}
