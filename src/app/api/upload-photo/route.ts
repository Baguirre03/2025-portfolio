import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { v4 as uuidv4 } from "uuid";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/upload";

const PUBLIC_BUCKET = "photos-public";
const PRIVATE_BUCKET = "photos-private";

export async function POST(request: Request) {
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

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: "File is required" },
      { status: 400 }
    );
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return NextResponse.json(
      {
        success: false,
        error: `Unsupported file type. Allowed: ${ALLOWED_FILE_TYPES.join(
          ", "
        )}`,
      },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { success: false, error: "File exceeds maximum size (10MB)" },
      { status: 400 }
    );
  }

  const isPublicParam = formData.get("isPublic");
  const isPublic =
    typeof isPublicParam === "string"
      ? isPublicParam === "true"
      : Boolean(isPublicParam);
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const description =
    (formData.get("description") as string | null)?.trim() ?? "";

  const bucket = isPublic ? PUBLIC_BUCKET : PRIVATE_BUCKET;
  const fileExt = file.name.split(".").pop();
  const fileName = `${uuidv4()}${fileExt ? `.${fileExt}` : ""}`;
  const filePath = fileName;

  try {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    const { data: photoRecord, error: insertError } = await supabase
      .from("photos")
      .insert([
        {
          filename: fileName,
          public_url: urlData.publicUrl,
          title: title || file.name,
          description,
          file_size: file.size,
          mime_type: file.type,
          bucket,
          uploaded_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) {
      await supabase.storage.from(bucket).remove([filePath]);
      throw insertError;
    }

    return NextResponse.json(
      {
        success: true,
        photo: photoRecord,
        publicUrl: urlData.publicUrl,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload photo";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
