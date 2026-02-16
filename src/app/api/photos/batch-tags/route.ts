import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
export async function POST(request: Request) {
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
    if (!user || role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const ids = body.ids.filter(
      (id: string): id is string => id.trim().length > 0,
    );
    const tagsToAdd = Array.isArray(body.tagsToAdd)
      ? body.tagsToAdd
          .filter((t: string): t is string => t.trim().length > 0)
          .map((t: string) => (t as string).trim().toLowerCase())
      : [];

    if (ids.length === 0 || tagsToAdd.length === 0) {
      return NextResponse.json(
        { error: "ids and tagsToAdd must be non-empty arrays" },
        { status: 400 },
      );
    }

    const adminClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {},
        },
      },
    );

    const { data: photos, error: fetchError } = await adminClient
      .from("photos")
      .select("id, tags")
      .in("id", ids);

    if (fetchError) throw fetchError;

    const updates = (photos ?? []).map((p) => {
      const current = (p.tags ?? []) as string[];
      const merged = [...new Set([...current, ...tagsToAdd])].sort();
      return { id: p.id, tags: merged };
    });

    for (const u of updates) {
      const { error: updateError } = await adminClient
        .from("photos")
        .update({ tags: u.tags })
        .eq("id", u.id);
      if (updateError) throw updateError;
    }

    return NextResponse.json({ updated: updates.length });
  } catch (error) {
    console.error("Error batch updating tags:", error);
    return NextResponse.json(
      { error: "Failed to update tags" },
      { status: 500 },
    );
  }
}
