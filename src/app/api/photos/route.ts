import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Photo } from "@/lib/types";

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 50;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = Number.parseInt(searchParams.get("limit") ?? "", 10);
    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, MAX_LIMIT)
        : DEFAULT_LIMIT;
    const cursorParam = Number.parseInt(searchParams.get("cursor") ?? "", 10);
    const cursor =
      Number.isFinite(cursorParam) && cursorParam >= 0 ? cursorParam : 0;

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options })
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const role = user?.app_metadata?.role as string | undefined;

    const from = cursor;
    const to = cursor + limit - 1;

    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .order("uploaded_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const hasMore = (photos?.length ?? 0) === limit;
    const items = photos ?? [];
    const nextCursor = hasMore ? cursor + limit : null;

    // For private photos and admins, generate short-lived signed URLs
    const result = await Promise.all(
      items.map(async (p: Photo) => {
        if (p.bucket === "photos-private" && role === "admin") {
          const { data: signed } = await supabase.storage
            .from("photos-private")
            .createSignedUrl(p.filename, 60 * 60); // 1 hour
          return { ...p, public_url: signed?.signedUrl ?? p.public_url };
        }
        return p;
      })
    );

    // Only cache publicly for anonymous users; admin responses include signed URLs
    const cacheControl =
      role === "admin"
        ? "private, no-store, max-age=0"
        : "public, s-maxage=60, stale-while-revalidate=300, max-age=60";

    return NextResponse.json(
      { photos: result, nextCursor },
      { headers: { "Cache-Control": cacheControl } }
    );
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to load photos" },
      { status: 500 }
    );
  }
}
