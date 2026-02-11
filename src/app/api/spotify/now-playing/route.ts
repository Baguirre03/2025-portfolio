import { NextResponse } from "next/server";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";
const SPOTIFY_RECENTLY_PLAYED_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

interface SpotifyTrack {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; width: number; height: number }>;
  };
  external_urls: { spotify: string };
}

interface SpotifyNowPlayingResponse {
  is_playing: boolean;
  item: SpotifyTrack | null;
}

interface SpotifyRecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
}

interface SpotifyRecentlyPlayedResponse {
  items: SpotifyRecentlyPlayedItem[];
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Spotify credentials not configured");
  }

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify token failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as SpotifyTokenResponse;
  return data.access_token;
}

function trackToPayload(track: SpotifyTrack) {
  const image = track.album?.images?.[0];
  return {
    title: track.name,
    artist: track.artists?.map((a) => a.name).join(", ") ?? "",
    album: track.album?.name ?? "",
    url: track.external_urls?.spotify ?? "",
    imageUrl: image?.url ?? null,
  };
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    const nowRes = await fetch(SPOTIFY_NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (nowRes.status === 204 || nowRes.status === 200) {
      if (nowRes.status === 204) {
        const recentRes = await fetch(SPOTIFY_RECENTLY_PLAYED_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        });
        if (recentRes.ok) {
          const recent =
            (await recentRes.json()) as SpotifyRecentlyPlayedResponse;
          const item = recent.items?.[0];
          if (item?.track) {
            return NextResponse.json(
              {
                isPlaying: false,
                ...trackToPayload(item.track),
                playedAt: item.played_at,
              },
              {
                headers: {
                  "Cache-Control":
                    "public, s-maxage=30, stale-while-revalidate=60",
                },
              },
            );
          }
        }
        return NextResponse.json(
          {
            isPlaying: false,
            title: null,
            artist: null,
            album: null,
            url: null,
            imageUrl: null,
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
            },
          },
        );
      }

      const data = (await nowRes.json()) as SpotifyNowPlayingResponse;
      const track = data?.item;
      if (track) {
        return NextResponse.json(
          {
            isPlaying: data.is_playing ?? true,
            ...trackToPayload(track),
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
            },
          },
        );
      }
    }

    return NextResponse.json(
      {
        isPlaying: false,
        title: null,
        artist: null,
        album: null,
        url: null,
        imageUrl: null,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    console.error("Spotify now-playing error:", error);
    return NextResponse.json(
      {
        isPlaying: false,
        title: null,
        artist: null,
        album: null,
        url: null,
        imageUrl: null,
        error: "Spotify not configured or token expired",
      },
      { status: 200, headers: { "Cache-Control": "public, s-maxage=60" } },
    );
  }
}
