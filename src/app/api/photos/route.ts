import { NextResponse } from "next/server";
import {
  getAllPhotoPublicUrls,
  supabase,
  uploadPhotoToBucket,
} from "@/lib/supabase";

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

export async function POST(request: Request) {
  const { image, title, description, isPublic } = await request.json();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  const photo = await uploadPhotoToBucket({
    file: image,
    title,
    description,
    isPublic,
  });
  return NextResponse.json(photo);
}
