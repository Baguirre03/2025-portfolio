import { NextResponse } from "next/server";
import { getAllPhotoPublicUrls } from "@/lib/supabase";

export async function GET() {
  try {
    const photos = await getAllPhotoPublicUrls();
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to load photos" },
      { status: 500 }
    );
  }
}
