import { NextRequest, NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  uploadImageWithClient,
  createImageRecordWithClient,
  getImages,
  getAllImages,
} from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includePrivate = searchParams.get("all") === "true";

    const images = includePrivate ? await getAllImages() : await getImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const isPublic = formData.get("isPublic") !== "false"; // Default to true
    const displayOrder = parseInt(formData.get("displayOrder") as string) || 0;

    if (!file || !title) {
      return NextResponse.json(
        { error: "Missing required fields: image and title" },
        { status: 400 }
      );
    }

    return NextResponse.json(imageRecord, { status: 201 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
