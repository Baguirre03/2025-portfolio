import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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

  const allowed: Record<string, unknown> = {};
  if (typeof body.title === "string") allowed.title = body.title.trim();
  if (typeof body.description === "string")
    allowed.description = body.description.trim();
  if (body.roll_number === null || typeof body.roll_number === "number")
    allowed.roll_number = body.roll_number;
  if (body.published_date === null || typeof body.published_date === "string")
    allowed.published_date = body.published_date || null;

  const VALID_VISIBILITY = ["public", "private", "friends", "family"];
  if (
    typeof body.visibility === "string" &&
    VALID_VISIBILITY.includes(body.visibility)
  ) {
    allowed.visibility = body.visibility;
    allowed.bucket =
      body.visibility === "public" ? "photos-public" : "photos-private";
  }

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
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

  // If visibility changed, we may need to move the file between buckets
  if (allowed.bucket) {
    const { data: current } = await adminClient
      .from("photos")
      .select("filename, bucket")
      .eq("id", id)
      .single();

    if (current && current.bucket !== allowed.bucket) {
      const oldBucket = current.bucket as string;
      const newBucket = allowed.bucket as string;
      const filename = current.filename as string;

      // Download from old bucket
      const { data: fileData } = await adminClient.storage
        .from(oldBucket)
        .download(filename);

      if (fileData) {
        // Upload to new bucket
        await adminClient.storage
          .from(newBucket)
          .upload(filename, fileData, { upsert: true });

        // Delete from old bucket
        await adminClient.storage.from(oldBucket).remove([filename]);

        // Update public_url for the new bucket
        if (newBucket === "photos-public") {
          const { data: urlData } = adminClient.storage
            .from(newBucket)
            .getPublicUrl(filename);
          allowed.public_url = urlData.publicUrl;
        } else {
          // For private bucket, store the path — signed URLs are generated at read time
          const { data: urlData } = adminClient.storage
            .from(newBucket)
            .getPublicUrl(filename);
          allowed.public_url = urlData.publicUrl;
        }
      }
    }
  }

  const { data, error } = await adminClient
    .from("photos")
    .update(allowed)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json(
      { error: "Failed to update photo" },
      { status: 500 },
    );
  }

  // For private-bucket photos, return a signed URL so the client can display it
  let photo = data;
  if (photo.bucket === "photos-private") {
    const { data: signed } = await adminClient.storage
      .from("photos-private")
      .createSignedUrl(photo.filename, 60 * 60);
    if (signed?.signedUrl) {
      photo = { ...photo, public_url: signed.signedUrl };
    }
  }

  return NextResponse.json({ photo });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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

  // Get the photo record first to know which bucket/file to delete
  const { data: photo, error: fetchError } = await adminClient
    .from("photos")
    .select("filename, bucket")
    .eq("id", id)
    .single();

  if (fetchError || !photo) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  // Delete from storage
  await adminClient.storage.from(photo.bucket).remove([photo.filename]);

  // Delete the database record
  const { error: deleteError } = await adminClient
    .from("photos")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Error deleting photo:", deleteError);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
