import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getPublicPhotos = async () => {
  const { data: photos, error } = await supabase
    .from("photos")
    .select("*")
    .order("uploaded_at", { ascending: false });

  if (error) throw error;
  return photos;
};

export type PublicPhoto = {
  id: string | number;
  title: string | null;
  description: string | null;
  display_url: string;
};

export async function getAllPhotoPublicUrls(): Promise<PublicPhoto[]> {
  const { data, error } = await supabase
    .from("photos")
    .select("id,title,description,public_url")
    .order("uploaded_at", { ascending: false });

  if (error) {
    throw error;
  }

  type PhotoDbRow = {
    id: string | number;
    title: string | null;
    description: string | null;
    public_url: string | null;
  };

  const rows = (data ?? []) as PhotoDbRow[];
  return rows
    .filter(
      (row) => typeof row.public_url === "string" && row.public_url.length > 0
    )
    .map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      display_url: row.public_url as string,
    }));
}

export async function uploadPhotoToPublicBucket(
  file: File,
  title = "",
  description = ""
) {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("photos-public")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("photos-public")
      .getPublicUrl(filePath);

    // Insert record into photos table
    const { data: photoRecord, error: dbError } = await supabase
      .from("photos")
      .insert([
        {
          filename: fileName,
          public_url: urlData.publicUrl,
          title: title || file.name,
          description: description,
          file_size: file.size,
          mime_type: file.type,
          bucket: "photos-public",
        },
      ])
      .select()
      .single();

    if (dbError) {
      // If database insert fails, clean up the uploaded file
      await supabase.storage.from("photos-public").remove([filePath]);
      throw dbError;
    }
    return {
      success: true,
      photo: photoRecord,
      publicUrl: urlData.publicUrl,
    };
  } catch (error) {
    console.error("Error uploading photo:", error);
    return {
      success: false,
      error: error,
    };
  }
}
