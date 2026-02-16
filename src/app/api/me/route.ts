import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET() {
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

  if (!user) {
    return NextResponse.json(
      { isAdmin: false },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  }

  const role = user.app_metadata?.role as string | undefined;
  return NextResponse.json(
    { isAdmin: role === "admin" },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    }
  );
}
