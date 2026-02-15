import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "photo_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }

    const friendsPassword = process.env.PHOTO_FRIENDS_PASSWORD;
    const familyPassword = process.env.PHOTO_FAMILY_PASSWORD;

    // Check which level the password matches
    let matchedLevel: "friends" | "family" | null = null;

    if (friendsPassword && password === friendsPassword) {
      matchedLevel = "friends";
    } else if (familyPassword && password === familyPassword) {
      matchedLevel = "family";
    }

    if (!matchedLevel) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 },
      );
    }

    // Read existing access cookie and merge in the new level
    const cookieStore = await cookies();
    const existing = cookieStore.get(COOKIE_NAME)?.value ?? "";
    const levels = new Set(existing.split(",").filter(Boolean));
    levels.add(matchedLevel);

    const value = Array.from(levels).join(",");

    cookieStore.set(COOKIE_NAME, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return NextResponse.json({ level: matchedLevel, levels: Array.from(levels) });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}

/** GET — return the current access levels from the cookie */
export async function GET() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value ?? "";
  const levels = existing.split(",").filter(Boolean);
  return NextResponse.json({ levels });
}
