import { NextResponse } from "next/server";

interface LetterboxdMovie {
  title: string;
  year?: string;
  link: string;
  watchedDate?: string;
  rating?: string;
  imageUrl?: string;
}

export async function GET(request: Request) {
  try {
    const letterboxdUsername = process.env.LETTERBOXD_USERNAME;

    if (!letterboxdUsername) {
      return NextResponse.json(
        { error: "Letterboxd username not configured" },
        { status: 500 },
      );
    }

    // Letterboxd RSS feed
    const rssUrl = `https://letterboxd.com/${letterboxdUsername}/rss/`;

    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Letterboxd RSS: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const movies = parseLetterboxdRSS(xmlText);
    const limitParam = new URL(request.url).searchParams.get("limit");
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 0, 500) : undefined;
    const result = limit != null ? movies.slice(0, limit) : movies;

    return NextResponse.json(
      { movies: result },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching Letterboxd data:", error);
    return NextResponse.json(
      { error: "Failed to load Letterboxd data", movies: [] },
      { status: 500 },
    );
  }
}

function parseLetterboxdRSS(xmlText: string): LetterboxdMovie[] {
  const movies: LetterboxdMovie[] = [];

  // Match all item blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];

    // Extract using Letterboxd namespace tags
    const filmTitleMatch = itemContent.match(
      /<letterboxd:filmTitle>(.*?)<\/letterboxd:filmTitle>/,
    );
    const filmYearMatch = itemContent.match(
      /<letterboxd:filmYear>(.*?)<\/letterboxd:filmYear>/,
    );
    const watchedDateMatch = itemContent.match(
      /<letterboxd:watchedDate>(.*?)<\/letterboxd:watchedDate>/,
    );
    const memberRatingMatch = itemContent.match(
      /<letterboxd:memberRating>(.*?)<\/letterboxd:memberRating>/,
    );
    const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
    const descriptionMatch = itemContent.match(
      /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/,
    );

    let imageUrl: string | undefined;
    if (descriptionMatch) {
      const imgMatch = descriptionMatch[1].match(/<img[^>]+src="([^"]+)"/);
      if (imgMatch) {
        imageUrl = imgMatch[1].trim();
      }
    }

    let rating: string | undefined;
    if (memberRatingMatch) {
      const numericRating = parseFloat(memberRatingMatch[1]);
      if (!isNaN(numericRating)) {
        const fullStars = Math.floor(numericRating);
        const halfStar = numericRating % 1 >= 0.5;
        rating = "★".repeat(fullStars) + (halfStar ? "½" : "");
      }
    }

    if (!rating) {
      const titleMatch = itemContent.match(/<title>(.*?)<\/title>/);
      if (titleMatch) {
        const ratingMatch = titleMatch[1].match(/[★½]+/);
        if (ratingMatch) {
          rating = ratingMatch[0];
        }
      }
    }

    if (filmTitleMatch && linkMatch) {
      movies.push({
        title: filmTitleMatch[1].trim(),
        year: filmYearMatch ? filmYearMatch[1].trim() : undefined,
        link: linkMatch[1].trim(),
        watchedDate: watchedDateMatch ? watchedDateMatch[1].trim() : undefined,
        rating,
        imageUrl,
      });
    }
  }

  return movies;
}
