import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET() {
  try {
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
              cookieStore.set({ name, value, ...options }),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const role = user?.app_metadata?.role as string | undefined;

    const { data: rows, error } = await supabase
      .from("photos")
      .select("tags")
      .limit(10000);

    if (error) throw error;

    const tags = [
      ...new Set(
        (rows ?? []).flatMap((r) => (r.tags ?? []) as string[]).filter(Boolean),
      ),
    ].sort();

    const cacheControl =
      role === "admin"
        ? "private, no-store, max-age=0"
        : "public, s-maxage=300, stale-while-revalidate=600, max-age=60";

    return NextResponse.json(
      { tags },
      { headers: { "Cache-Control": cacheControl } },
    );
  } catch (err) {
    console.error("Error fetching tags:", err);
    return NextResponse.json({ error: "Failed to load tags" }, { status: 500 });
  }
}
