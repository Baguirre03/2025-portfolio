import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

async function signOut() {
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

  await supabase.auth.signOut({ scope: "global" });
}

export async function GET(request: Request) {
  try {
    await signOut();
  } catch {}

  const redirectUrl = new URL("/login", request.url);
  return NextResponse.redirect(redirectUrl);
}

export async function POST() {
  try {
    await signOut();
    return NextResponse.json(
      { success: true },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Failed to sign out, ${error}` },
      { status: 500 }
    );
  }
}
