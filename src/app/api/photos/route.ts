import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Photo } from "@/lib/types";

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
              cookieStore.set({ name, value, ...options })
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const role = (user?.user_metadata as { role?: string } | undefined)?.role;
    const { data: photos, error: error } = await supabase
      .from("photos")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) throw error;
    // For private photos and admins, generate short-lived signed URLs
    const result = await Promise.all(
      (photos ?? []).map(async (p: Photo) => {
        if (p.bucket === "photos-private" && role === "admin") {
          const { data: signed } = await supabase.storage
            .from("photos-private")
            .createSignedUrl(p.filename, 60 * 60); // 1 hour
          return { ...p, public_url: signed?.signedUrl ?? p.public_url };
        }
        return p;
      })
    );

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to load photos" },
      { status: 500 }
    );
  }
}
